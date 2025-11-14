<script setup lang="ts">
import { ref } from 'vue'

import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import $axios from '@/util/axios'

import gobierno from '@/assets/images/logos/gobierno-mx.svg'
import { baseURL } from '@/util'

import AccionGuardar from './AccionGuardar.vue'
import AccionDescarga from './AccionDescarga.vue'

import type { Components } from '@/types/component'
import { useProjectStore } from '@/stores/project'
import { useConfigStore } from '@/stores/config'
import { notify } from '@kyvg/vue3-notification'

defineProps(['logo', 'nickname'])

const project = useProjectStore()
const config = useConfigStore()
const router = useRouter()

const isMobile = ref(false)

const seguimiento = () => {
  return {
    intro:
      project.estructura.introduccion.capturado && project.estructura.introduccion.captura
        ? project.estructura.introduccion.captura
        : undefined,
    situacion:
      project.estructura.antecedentes.capturado && project.estructura.antecedentes.situacion
        ? project.estructura.antecedentes.situacion
        : undefined,
    logros:
      project.estructura.antecedentes.capturado && project.estructura.antecedentes.logros
        ? project.estructura.antecedentes.logros
        : undefined,
    metas:
      project.estructura.resultados.capturado && project.estructura.resultados.captura
        ? project.estructura.resultados.captura
        : undefined,
    objetivo:
      project.estructura.objetivo.capturado && project.estructura.objetivo.captura
        ? project.estructura.objetivo.captura
        : undefined,
    obsResumen:
      project.estructura.resumen.capturado && project.estructura.resumen.observaciones
        ? project.estructura.resumen.observaciones
        : undefined,
  }
}

const procesarActividades = (listado: any) => {
  return listado.map((actividad: any) => {
    delete actividad.conIVA
    delete actividad.descAct
    delete actividad.descEntregable
    delete actividad.descSubAct
    delete actividad.descSubcomp
    delete actividad.descUnidad
    delete actividad.placeHolderDesc
    delete actividad.placeHolderDescAct
    delete actividad.placeHolderEnt
    delete actividad.toggleText
    return actividad
  })
}

const procesarComponentes = (componentes: any) => {
  return componentes.map((componente: any) => {
    delete componente.actualizado
    delete componente.vertiente
    delete componente.posicion
    delete componente.total
    componente.actividades = procesarActividades([...componente.actividades])
    return componente
  })
}

const filtrarComponentes = (componentes: Components) => {
  return componentes.filter((componente) => componente.actualizado)
}

const cerrarSesion = () => {
  if (config.getToken) {
    config?.destruirToken()!.then(() => {
      config.asignarLayout('ContentLogin')
      router.push({ name: 'login' })
      setTimeout(() => {
        location.reload()
      }, 1000)
    })
  }
}

const descarga = () => {
  project.obtenerPDF().then((data) => {
    const elem = document.getElementById('docPDF')
    if (elem) {
      elem.remove()
    }

    const fileLink = document.createElement('a')

    fileLink.href = window.URL.createObjectURL(
      new Blob([data as BlobPart], { type: 'application/pdf' }),
    )
    fileLink.setAttribute('download', 'Proyecto Ejecutivo de Modernización.pdf')
    fileLink.setAttribute('id', 'docPDF')

    document.body.appendChild(fileLink)

    fileLink.click()
  })
}

const guardar = () => {
  const distribucion = project.obtenerDistribucion

  const datos = {
    mEst:
      project.estructura.resumen.capturado && project.estructura.resumen.calculado
        ? distribucion.total.estatal
        : undefined,
    mFed:
      project.estructura.resumen.capturado && project.estructura.resumen.calculado
        ? distribucion.total.federal
        : undefined,
    mTotal:
      project.estructura.resumen.capturado && project.estructura.resumen.calculado
        ? distribucion.total.total
        : undefined,
    millar:
      project.estructura.resumen.capturado && project.estructura.resumen.calculado
        ? project.estructura.resumen.millar
        : undefined,
    diagnosticoId: project.diagnostico.id ?? undefined,
    presupuesto: project.estructura.introduccion.presupuesto,
    vertiente: project.vertiente ?? undefined,
    version: project.version ?? 0,
    rm: project.removerComponente,
    id: project.id && project.id > 0 ? project.id : undefined,
    seguimiento: { ...seguimiento() },
    desarrollo: procesarComponentes(
      filtrarComponentes([
        ...project.estructura.desarrollo.componentes?.pec,
        ...project.estructura.desarrollo.componentes?.pem,
      ]),
    ),
  }

  console.log(datos)
  //return
  $axios
    .post(`${baseURL()}/api/save`, datos)
    .then((response) => {
      if (response.data.solicitud) {
        notify({ group: 'auth', type: 'success', text: response.data.message })
      }
    })
    .catch((error: AxiosError | Error | unknown) => {
      let message = (error as Error).message
      if (error instanceof AxiosError) {
        message = error?.response?.data?.message || message
      }
      notify({ group: 'auth', type: 'error', title: '¡Error!', text: message })
    })
}
</script>
<template>
  <header class="hero is-primary">
    <div class="hero-head">
      <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <img class="navbar-brand-logo" :src="gobierno" alt="SEDATU" />
          <a class="navbar-item"> </a>
          <a class="navbar-item is-tab is-hidden-mobile1">
            <span class="icon is-medium"><i class="fa fa-home"></i></span>Inicio
          </a>
          <a class="navbar-item is-tab is-hidden-mobile">Ayuda</a>
          <a
            role="button"
            class="navbar-burger"
            :class="{ 'is-active': isMobile }"
            aria-label="menu"
            aria-expanded="false"
            data-target="navMenuGuia"
            @click="isMobile = !isMobile"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div class="navbar-menu" :class="{ 'is-active': isMobile }" id="navMenuGuia">
          <div class="navbar-end">
            <AccionGuardar v-if="config?.acciones[12]!" :clase="'is-size-5'" @guardar="guardar" />
            <AccionDescarga v-if="config?.acciones[9]!" :clase="'is-size-5'" @descarga="descarga" />
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link has-text-weight-medium">
                <span class="icon is-small"> <i class="fas fa-user-circle"></i> </span>&nbsp;
                {{ nickname }}
              </a>

              <div class="navbar-dropdown is-right is-boxed">
                <!--router-link tag="a" :to="{name:'logout'}" class="navbar-item" active-class="is-active"-->
                <a @click.preventDefault="cerrarSesion" class="navbar-item">
                  <span class="icon is-small">
                    <i class="fa fa-power-off"></i>
                  </span>
                  &nbsp; Salir
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

import { createWebHistory, createRouter } from 'vue-router'

import ContentLogin from '../components/layouts/ContentLogin.vue'
import Introduccion from '../components/project/Introduccion.vue'
import Antecedente from '../components/project/AntecedenteInstitucion.vue'
import Situacion from '../components/project/Situacion.vue'
import Desarrollo from '../components/project/DesarrolloProyecto.vue'
import Objetivo from '../components/project/Objetivo.vue'
import Programa from '../components/project/Programa.vue'
import Resumen from '../components/project/Resumen.vue'
import Resultados from '../components/project/Resultados.vue'
import Anexos from '../components/project/AnexosActividad.vue'
import Inicio from '../components/project/Inicio.vue'
import Logout from '../components/login/LogoutApp.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: ContentLogin,
    },
    {
      path: '/inicio',
      name: 'inicio',
      component: Inicio,
    },
    {
      path: '/introduccion',
      name: 'introduccion',
      component: Introduccion,
    },
    {
      path: '/antecedentes',
      name: 'antecedentes',
      component: Antecedente,
    },
    {
      path: '/situacion',
      name: 'situacion',
      component: Situacion,
    },
    {
      path: '/objetivo',
      name: 'objetivo',
      component: Objetivo,
    },
    {
      path: '/desarrollo',
      name: 'desarrollo',
      component: Desarrollo,
    },
    {
      path: '/programa',
      name: 'programa',
      component: Programa,
    },
    {
      path: '/resumen_financiero',
      name: 'resumen',
      component: Resumen,
    },
    {
      path: '/resultados',
      name: 'resultados',
      component: Resultados,
    },
    {
      path: '/anexos',
      name: 'anexos',
      component: Anexos,
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
    },
  ],
})

export default router

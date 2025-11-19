<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useConfigStore } from '@/stores/config'
import { notify } from '@kyvg/vue3-notification'
import { AxiosError } from 'axios'
import $axios from '@/util/axios'
import { baseURL } from '@/util'
import router from '@/router'

defineProps(['logo'])

const config = useConfigStore()

const usuario = reactive({
  nickname: '',
  password: '',
  recordar: true,
  iniNickname: false,
  iniPassword: false,
  focusNickname: false,
  focusPassword: false,
})

const showPassword = ref(false)

const typeFieldPassword = ref('password')

//const $me = this

const statusInputUser = computed(() => {
  if (!usuario.iniNickname) {
    return ''
  }
  return hasError(usuario.nickname)
})

const statusInputPassword = computed(() => {
  if (!usuario.iniPassword) {
    return ''
  }
  return hasError(usuario.password)
})

const toggleClassIconUser = computed(() => {
  if (usuario.iniNickname || usuario.focusNickname) {
    return usuario.nickname.trim().length > 0 || usuario.focusNickname ? 'icon-active' : ''
  }
  return ''
})

const toggleClassIconPassword = computed(() => {
  if (usuario.iniPassword || usuario.focusPassword) {
    return usuario.password.trim().length > 0 || usuario.focusPassword ? 'icon-active' : ''
  }
  return ''
})

const classIconPassword = computed(() => {
  return showPassword.value ? 'fa-eye-slash' : 'fa-eye'
})

const pointerPassword = computed(() => {
  return usuario.password.trim().length > 0 || usuario.focusPassword ? 'pointer-password' : ''
})

const captureCharacter = (event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement

  if (input.name === 'nickname') {
    usuario.iniNickname = true
  }
  if (input.name === 'password') {
    usuario.iniPassword = true
  }
}

const toggleFocusInput = (event: FocusEvent) => {
  const input = event.target as HTMLInputElement
  if (input.name === 'nickname') {
    usuario.focusNickname = true
  }

  if (input.name === 'password') {
    usuario.focusPassword = true
  }
}

const toggleBlurInput = (event: FocusEvent) => {
  const input = event.target as HTMLInputElement

  if (input.name === 'nickname') {
    usuario.focusNickname = false
  }

  if (input.name === 'password') {
    usuario.focusPassword = false
  }
}

const toggleFieldPassword = () => {
  showPassword.value = !showPassword.value
  typeFieldPassword.value = showPassword.value ? 'text' : 'password'
}

/*const toggleFielRecordar = () => {
  usuario.recordar = !usuario.recordar
}*/

const hasError = (strInput: string) => {
  if (strInput.trim().length > 0 && strInput.trim().length < 5) {
    return 'has-warning'
  }
  return strInput.trim().length == 0 ? 'has-error' : ''
}

const validData = () => {
  if (usuario.nickname.trim().length == 0) {
    notify({ group: 'auth', type: 'warn', title: '¡Advertencia!', text: 'Ingrese su usuario' })
    return false
  }
  if (usuario.password.trim().length == 0) {
    notify({ group: 'auth', type: 'warn', title: '¡Advertencia!', text: 'Ingrese su contraseña' })
    return false
  }
  return true
}

const loginUser = () => {
  if (!validData()) {
    return false
  }

  const $params = {
    nickname: usuario.nickname,
    password: usuario.password,
    remember: usuario.recordar,
  }

  $axios.get(`${baseURL()}/sanctum/csrf-cookie`).then(() => {
    $axios
      .post(`${baseURL()}/api/login`, $params)
      .then((response) => {
        $axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token
        localStorage.setItem('authToken', response.data.access_token)
        config.asignarToken({
          token: response.data.access_token,
          nickname: response.data.user.nickname,
          rol: response.data.user.rol,
          acciones: response.data.user.acciones,
        })

        notify({
          group: 'auth',
          type: 'success',
          text: `Bienvenido ${response.data.user.nombre}`,
        })

        setTimeout(() => {
          if (response.data.user.rol === 'admin') {
            router.push('/admin/proyectos')
            return
          }
          router.push('/inicio')
        }, 1000)
      })
      .catch(handleErrorsLogin)
  })
}

const handleErrorsLogin = (error: AxiosError | Error | unknown) => {
  let message = (error as Error).message
  if (error instanceof AxiosError) {
    message = error?.response?.data?.message || message
  }
  notify({ group: 'auth', type: 'error', title: '¡Error!', text: message })
}
</script>
<template>
  <div id="login">
    <div class="login-card">
      <div class="card-title">
        <img src="@/assets/images/logos/desarrollo-guinda.png" />
        <h1 class="my-3">Guía para la Integración de Proyectos Registrales y Catastrales</h1>
      </div>
      <div class="content">
        <form @submit.prevent="loginUser">
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input
                id="nickname"
                type="text"
                name="nickname"
                :class="statusInputUser"
                v-model="usuario.nickname"
                @keyup="captureCharacter"
                @focus="toggleFocusInput"
                @blur="toggleBlurInput"
                title="Ingrese su usuario aquí"
                placeholder="Usuario"
                required
                autofocus
              />
              <span class="icon is-small is-left" :class="toggleClassIconUser">
                <IconFas :img="'user'" />
              </span>
            </p>
          </div>
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input
                id="password"
                :type="typeFieldPassword"
                name="password"
                :class="statusInputPassword"
                title="Ingrese su contraseña aquí"
                @keyup="captureCharacter"
                @focus="toggleFocusInput"
                @blur="toggleBlurInput"
                placeholder="Contraseña"
                v-model="usuario.password"
                required
              />
              <span class="icon is-small is-left" :class="toggleClassIconPassword">
                <IconFas :img="'lock'" />
              </span>
              <span
                class="icon is-small is-right"
                :class="toggleClassIconPassword"
                @click="toggleFieldPassword"
              >
                <i class="fas" :class="[classIconPassword, pointerPassword]"></i>
              </span>
            </p>
          </div>
          <div class="buttons btn-submit">
            <button type="submit" class="button is-danger is-rounded has-text-white-bis">
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
    <!--notifications group="auth" position="bottom right"/-->
  </div>
</template>

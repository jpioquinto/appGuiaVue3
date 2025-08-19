//import './assets/main.css'
/*
import '@mdi/font/scss/materialdesignicons.scss'*/
import '@fortawesome/fontawesome-free/scss/fontawesome.scss'
import '@fortawesome/fontawesome-free/scss/brands.scss'
import '@fortawesome/fontawesome-free/scss/regular.scss'
import '@fortawesome/fontawesome-free/scss/solid.scss'
import '@fortawesome/fontawesome-free/scss/v4-shims.scss'

import './assets/sass/app.scss'
//import 'bulma/css/bulma.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { QuillEditor } from '@vueup/vue-quill'
import IconFas from './components/icons/IconFas.vue'
import Notifications from '@kyvg/vue3-notification'

import App from './App.vue'
import router from './router/index'

const globalOptions = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
    ],
  },
  placeholder: 'Contenido aquí...',
  theme: 'snow',
}

QuillEditor.props.globalOptions.default = () => globalOptions

const app = createApp(App)
app.component('IconFas', IconFas)
app.component('QuillEditor', QuillEditor)

app.use(createPinia())
app.use(router)
app.use(Notifications)

app.mount('#app')

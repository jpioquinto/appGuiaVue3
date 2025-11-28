import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { createWebHistory, createRouter } from 'vue-router'

import ContentProject from '@/components/layouts/ContentProject.vue'
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
import Home from '@/views/Home.vue'
import Dashboard from '@/components/admin/Dashboard.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
    meta: { layout: 'default' },
    name: 'home',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/login/FormLogin.vue'),
    meta: { layout: 'auth' },
  },
  {
    path: '/admin/proyectos',
    name: 'admin-proyectos',
    component: Dashboard,
    meta: { layout: 'admin', requiresAuth: true },
  },
  {
    path: '/inicio',
    name: 'inicio',
    component: Inicio,
    meta: { layout: 'project', requiresAuth: true },
  },
  {
    path: '/proyecto',
    children: [
      {
        path: 'introduccion',
        name: 'introduccion',
        component: Introduccion,
        meta: { layout: 'project', requiresAuth: true },
      },
      {
        path: 'antecedentes',
        name: 'antecedentes',
        component: Antecedente,
        meta: { layout: 'project', requiresAuth: true },
      },
      {
        path: 'situacion',
        name: 'situacion',
        component: Situacion,
        meta: { layout: 'project', requiresAuth: true },
      },
      {
        path: '/objetivo',
        name: 'objetivo',
        component: Objetivo,
        meta: { layout: 'project', requiresAuth: true },
      },
      {
        path: '/desarrollo',
        name: 'desarrollo',
        component: Desarrollo,
        meta: { layout: 'project', requiresAuth: true },
      },
      {
        path: '/programa',
        name: 'programa',
        component: Programa,
        meta: { layout: 'project', requiresAuth: true },
      },
      {
        path: '/resumen-financiero',
        name: 'resumen',
        component: Resumen,
        meta: { layout: 'project', requiresAuth: true },
      },
      {
        path: '/resultados',
        name: 'resultados',
        component: Resultados,
        meta: { layout: 'project', requiresAuth: true },
      },
      {
        path: '/anexos',
        name: 'anexos',
        component: Anexos,
        meta: { layout: 'project', requiresAuth: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(
  (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ): void => {
    const requiresAuth = (to.meta.requiresAuth as boolean) ?? false
    const isAuthenticated = !!localStorage.getItem('authToken')

    if (requiresAuth && !isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  },
)

export default router

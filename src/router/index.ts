import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS, APP_CONFIG } from '@/constants/app'

// Extend RouteMeta interface for SEO
declare module 'vue-router' {
  interface RouteMeta {
    title: string
    description?: string
    keywords?: string
    requiresAuth: boolean
  }
}

const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')

const routes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.LOGIN,
    name: ROUTE_NAMES.LOGIN,
    component: Login,
    meta: {
      title: `Sign In - ${APP_CONFIG.NAME}`,
      description: `Sign in to your ${APP_CONFIG.NAME} account to manage your tasks and stay productive.`,
      keywords: 'login, sign in, todo app, authentication',
      requiresAuth: false,
    },
  },
  {
    path: ROUTE_PATHS.HOME,
    name: ROUTE_NAMES.HOME,
    component: Home,
    meta: {
      title: `Dashboard - ${APP_CONFIG.NAME}`,
      description: `Manage your tasks efficiently with our modern Vue 3 todo application. Create, edit, and organize your tasks.`,
      keywords: 'todo, tasks, dashboard, productivity, vue 3',
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: ROUTE_PATHS.LOGIN,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Update meta tags on route change for SEO
router.beforeEach((to, from, next) => {
  // Check authentication for protected routes
  if (to.meta.requiresAuth) {
    const savedUser = localStorage.getItem('todo-user')
    const savedAuth = localStorage.getItem('todo-auth')

    if (!savedUser || savedAuth !== 'true') {
      console.log('🚫 Access denied, redirecting to login')
      next(ROUTE_PATHS.LOGIN)
      return
    }
  }

  // Redirect authenticated users away from login page
  if (to.path === ROUTE_PATHS.LOGIN) {
    const savedUser = localStorage.getItem('todo-user')
    const savedAuth = localStorage.getItem('todo-auth')

    if (savedUser && savedAuth === 'true') {
      console.log('✅ User already authenticated, redirecting to home')
      next(ROUTE_PATHS.HOME)
      return
    }
  }

  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // Update meta description
  const descriptionMeta = document.querySelector('meta[name="description"]')
  if (descriptionMeta && to.meta.description) {
    descriptionMeta.setAttribute('content', to.meta.description as string)
  }

  // Update meta keywords
  const keywordsMeta = document.querySelector('meta[name="keywords"]')
  if (keywordsMeta && to.meta.keywords) {
    keywordsMeta.setAttribute('content', to.meta.keywords as string)
  }

  // Update Open Graph title
  const ogTitleMeta = document.querySelector('meta[property="og:title"]')
  if (ogTitleMeta && to.meta.title) {
    ogTitleMeta.setAttribute('content', to.meta.title as string)
  }

  // Update Open Graph description
  const ogDescMeta = document.querySelector('meta[property="og:description"]')
  if (ogDescMeta && to.meta.description) {
    ogDescMeta.setAttribute('content', to.meta.description as string)
  }

  next()
})

export default router

import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _698136ce = () => interopDefault(import('..\\pages\\chat.vue' /* webpackChunkName: "pages/chat" */))
const _3bab9de4 = () => interopDefault(import('..\\pages\\dashboard.vue' /* webpackChunkName: "pages/dashboard" */))
const _43e4fd06 = () => interopDefault(import('..\\pages\\stamps.vue' /* webpackChunkName: "pages/stamps" */))
const _a8c3408a = () => interopDefault(import('..\\pages\\visitors.vue' /* webpackChunkName: "pages/visitors" */))
const _3d07ddd8 = () => interopDefault(import('..\\pages\\booth\\dashboard.vue' /* webpackChunkName: "pages/booth/dashboard" */))
const _71d0b5ac = () => interopDefault(import('..\\pages\\booth\\information.vue' /* webpackChunkName: "pages/booth/information" */))
const _3893614c = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/chat",
    component: _698136ce,
    name: "chat"
  }, {
    path: "/dashboard",
    component: _3bab9de4,
    name: "dashboard"
  }, {
    path: "/stamps",
    component: _43e4fd06,
    name: "stamps"
  }, {
    path: "/visitors",
    component: _a8c3408a,
    name: "visitors"
  }, {
    path: "/booth/dashboard",
    component: _3d07ddd8,
    name: "booth-dashboard"
  }, {
    path: "/booth/information",
    component: _71d0b5ac,
    name: "booth-information"
  }, {
    path: "/",
    component: _3893614c,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}

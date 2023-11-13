import Vue from 'vue'
import App from './App.vue'
// import router from './router'
// import store from './store'
import './plugins/axios-instance'

Vue.config.productionTip = false


import store from './store/index';

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import VueRouter from 'vue-router'
Vue.use(VueRouter)
import routes from './routes/routes'

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    window.scroll(0, 0)
    next()
})

import JsonExcel from 'vue-json-excel'
Vue.component('downExcel', JsonExcel)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/es'
Vue.use(ElementUI, {locale})


import VueSession from 'vue-session'

const options = {
  persist: false
}

Vue.use(VueSession, options)

import './assets/scss/main.scss'

import helpers from './utils/index'

const plugin = {
  install (Vue) {
    Vue.prototype.$hlp = helpers
  }
}

Vue.use(plugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

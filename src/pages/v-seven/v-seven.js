import Vue from 'Vue'
import vSeven from './v-seven.vue'
// import router from '@/router/index.js'
import VueRouter from 'vue-router'
import sevenMessage from './components/seven-message/seven-message.vue'

const routes = [
  { path: '/', component: sevenMessage }
]

Vue.use(VueRouter)

const router = new VueRouter({
  routes: routes
})

let myForEach = (arr, callback) => {
  if (arr instanceof Array) {
    arr.forEach(callback)
  }
}
Vue.prototype.myForEach = myForEach

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(vSeven),
  router
})

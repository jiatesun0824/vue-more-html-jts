import Vue from 'Vue'
import vRoam from './v-roam.vue'
// import router from '@/router/index.js'
import VueRouter from 'vue-router'
import roamMessage from './components/roam-message/roam-message.vue'

const routes = [
  { path: '/', component: roamMessage }
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
  el: '#roam',
  render: h => h(vRoam),
  router
})

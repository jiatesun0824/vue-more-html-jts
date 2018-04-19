import Vue from 'vue'
import Router from 'vue-router'
import sevenMessage from '@/pages/v-seven/components/seven-message/seven-message.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/sevenMessage',
      name: 'sevenMessage',
      component: sevenMessage
    }
  ]
})

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TastaturenView from '../views/TastaturenView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/tastaturen',
      name: 'Tastaturen',
      component: TastaturenView
    },
  ]
})
export default router

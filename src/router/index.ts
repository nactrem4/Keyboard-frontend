import { createRouter, createWebHistory } from 'vue-router'
import TastaturView from '../views/TastaturView.vue'
import TastaturCreate from '../views/TastaturCreate.vue'
import TastaturSuche from '../views/TastaturSuche.vue'
import TastaturDetail from '../views/TastaturDetail.vue'
import TastaturenVerwalten from '../views/TastaturenVerwalten.vue' // Verwaltungsübersicht
import TastaturEdit from '../views/TastaturEdit.vue'

const routes = [
  { path: '/', component: TastaturView },
  { path: '/tastaturen/create', component: TastaturCreate },
  { path: '/TastaturSuche', component: TastaturSuche },
  { path: '/tastaturen/verwalten', name: 'TastaturenVerwalten', component: TastaturenVerwalten },
  { path: '/tastaturen/:id', name: 'TastaturDetail', component: TastaturDetail },
  { path: '/tastaturen/:id/edit', name: 'TastaturEdit', component: TastaturEdit }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

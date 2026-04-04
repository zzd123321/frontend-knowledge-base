import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import SkillDetail from '../pages/SkillDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/skill/:id', component: SkillDetail },
  ],
})

export default router

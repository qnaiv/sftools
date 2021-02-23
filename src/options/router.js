import Vue from 'vue'
import VueRouter from 'vue-router'
import IndexPage from './pages/Index.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: IndexPage},
]

const router = new VueRouter({
    routes // `routes: routes` の短縮表記
  })

// ストアをエクスポート
export default router
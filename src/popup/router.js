import Vue from 'vue'
import VueRouter from 'vue-router'
import AccountForm from './pages/AccountForm.vue'
import AccountList from './pages/AccountList.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: AccountList},
    { path: '/editAccount', name:'editAccount', component: AccountForm, props: true},
]

const router = new VueRouter({
    routes // `routes: routes` の短縮表記
  })

// ストアをエクスポート
export default router
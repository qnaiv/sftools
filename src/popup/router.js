import Vue from 'vue'
import VueRouter from 'vue-router'
import AccountForm from './AccountForm.vue'
import AccountList from './AccountList.vue'
import ExportPage from './ExportPage.vue'
import ImportPage from './ImportPage.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: AccountList},
    { path: '/editAccount', name:'editAccount', component: AccountForm, props: true},
    { path: '/export', name:'export', component: ExportPage},
    { path: '/import', name:'import', component: ImportPage},
]

const router = new VueRouter({
    routes // `routes: routes` の短縮表記
  })

// ストアをエクスポート
export default router
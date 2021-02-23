import Vue from 'vue'
import 'bulma-fluent/bulma.sass'
import VuejsDialog from 'vuejs-dialog'
import VueShortKey from 'vue-shortkey';


import 'vuejs-dialog/dist/vuejs-dialog.min.css';

import store from '../entity/store'
import router from './router'

import App from './App.vue'


Vue.use(VuejsDialog)
Vue.use(VueShortKey)
// eslint-disable-next-line
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
})

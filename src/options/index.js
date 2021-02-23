import Vue from 'vue'
import 'bulma-fluent/bulma.sass'
import VuejsDialog from 'vuejs-dialog'
import 'vuejs-dialog/dist/vuejs-dialog.min.css';

import router from './router'
import store from '../entity/store'

import App from './App.vue'


Vue.use(VuejsDialog)

// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})

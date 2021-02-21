import Vue from 'vue'
import 'bulma-fluent/bulma.sass'
import VuejsDialog from 'vuejs-dialog'
import 'vuejs-dialog/dist/vuejs-dialog.min.css';

import store from './store'
import router from './router'

import App from './App.vue'


// eslint-disable-next-line
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
})

Vue.use(VuejsDialog)
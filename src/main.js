// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'common/stylus/index.styl'
Vue.config.productionTip = false
import 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import store from './store/index.js'
Vue.use(VueLazyLoad)
import 'babel-polyfill'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

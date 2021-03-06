// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
Vue.use(ElementUI);
import './assets/css/reset.css';
import VueParticles from 'vue-particles'
Vue.use(VueParticles)

import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)

// import request from './utils/util'
import http from "./utils/http";
// Vue.prototype.request = request
Vue.prototype.$http = http
Vue.config.productionTip = false

import { MessageBox } from 'element-ui' //删除确认
Vue.prototype.$confirm = MessageBox.confirm

// 引入echarts
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts
import store from './store'

import moment from 'moment'
//  全局过滤器 时间戳
Vue.filter('dateformat', function (dataStr, pattern = 'yyyy-MM-dd HH:mm:ss') {
  if (dataStr) {
    return moment(dataStr).format(pattern)
  } else {
    return dataStr
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

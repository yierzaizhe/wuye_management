import Vue from 'vue'
import Router from 'vue-router'

import NProgress from 'nprogress'; //进度条
import 'nprogress/nprogress.css';
// 解决点击同一路由时报错
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
      path: '/',
      redirect: '/login',
    },
    {
      path: '/index',
      component: () => import('../pages/index.vue'),
      children: [
        {
          path: "/home",
          name: '/home',
          component: () => import('../pages/home.vue')
        },
        {
          path: "/user",
          name: '/user',
          component: () => import('../pages/user/User.vue')
        },
        {
          path: "/building",
          name: '/building',
          component: () => import('../pages/building/Building.vue')
        },
        {
          path: "/houseProperty",
          name: '/houseProperty',
          component: () => import('../pages/building/HouseProperty.vue')
        },
        {
          path: "/houseLive",
          name: '/houseLive',
          component: () => import('../pages/building/HouseLive.vue')
        },
        {
          path: "/parking",
          name: '/parking',
          component: () => import('../pages/parking/Parking.vue')
        },
        {
          path: "/parkingUse",
          name: '/parkingUse',
          component: () => import('../pages/parking/ParkingUse.vue')
        },
        {
          path: "/parkingLog",
          name: '/parkingLog',
          component: () => import('../pages/parking/ParkingLog.vue')
        },
        {
          path: "/owner",
          name: '/owner',
          component: () => import('../pages/owner/Owner.vue')
        },
        /*{
          path: "/parkingPay",
          name: '/parkingPay',
          component: () => import('../pages/garbage/Garbage.vue')
        },
        {
          path: "/stock",
          name: '/stock',
          component: () => import('../pages/garbage/Garbage.vue')
        },*/
      ]
    },
    {
      path: '/login',
      name: '/login',
      component: () => import('../pages/login.vue')
    },
    {
      path: '*',
      name: '/nulls',
      component: () => import('../pages/nulls.vue')
    },
  ]
})
router.beforeEach((to, form, next) => {
  NProgress.start()
  next()
})
router.afterEach(() => {
  NProgress.done()
})
export default router

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
      meta: {
        needLogin: true
      },
      children: [
        {
          path: "/home",
          name: '/home',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/home.vue')
        },
        {
          path: "/user",
          name: '/user',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/user/User.vue')
        },
        {
          path: "/userAdd",
          name: '/userAdd',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/user/addUser.vue')
        },
        {
          path: "/building",
          name: '/building',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/building/Building.vue')
        },
        {
          path: "/houseProperty",
          name: '/houseProperty',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/building/HouseProperty.vue')
        },
        {
          path: "/houseLive",
          name: '/houseLive',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/building/HouseLive.vue')
        },
        {
          path: "/parking",
          name: '/parking',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/parking/Parking.vue')
        },
        {
          path: "/parkingUse",
          name: '/parkingUse',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/parking/ParkingUse.vue')
        },
        {
          path: "/parkingLog",
          name: '/parkingLog',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/parking/ParkingLog.vue')
        },{
          path: "/paySuccess",
          name: '/paySuccess',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/parking/PaySuccess.vue')
        },
        {
          path: "/owner",
          name: '/owner',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/owner/Owner.vue')
        },
        {
          path: "/parkingPay",
          name: '/parkingPay',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/parking/ParkingPay.vue')
        },
        {
          path: "/stock",
          name: '/stock',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/stock/Stock.vue')
        },
        {
          path: "/stockLog",
          name: '/stockLog',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/stock/StockLog.vue')
        },
        {
          path: "/updateStock",
          name: '/updateStock',
          meta: {
            needLogin: true
          },
          component: () => import('../pages/stock/UpdateStockLog.vue')
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
  if (to.meta.needLogin == true) {
    let auth = localStorage.getItem("Authorization");
    let token = null;
    if (auth == null) {
      next("/login");
    } else {
      //token = JSON.parse(auth).token;
      token = auth;
      console.log("router取得的token为：" + token);
    }

    if (token == null || token == "") {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }

})
router.afterEach(() => {
  NProgress.done()
})
export default router

import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({

  mode: 'history',
  routes: [{
      path: '/',
      redirect: "/map"
    },
    {
      path: '/map',
      redirect: "/map/home"
    },
    {
      path: '/map/home',
      name: '地图首页',
      component: () =>
        import("../page/Home/Home.vue")
    }
  ]
})
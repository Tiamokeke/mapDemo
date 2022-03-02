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
      redirect: "/map/railaways"
    },
    {
      path: '/map/railaways',
      name: '轨道线',
      component: () =>
        import("../page/Railaways/Railaways.vue")
    }, {
        path: '/map/province',
        name: '省区规划',
        component: () =>
          import("../page/Province/Province.vue")
      }
  ]
})
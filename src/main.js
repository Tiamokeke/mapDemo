import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BMap from "vue-baidu-map";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'  // 安装axios后引入
Vue.prototype.$axios = axios

Vue.use(ElementUI,BMap, {ak: 'URGrmm3xDKuybv42Fb9rr0O1LMEN9Bvn'})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

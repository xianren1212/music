import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  // loading没有请求前设置加载样式
  data() {
    return {
      isShowLoading: false,
    }
  },
}).$mount('#app')

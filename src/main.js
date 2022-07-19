import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Vant导入所有组件
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

// rem转换
// import 'amfe-flexible'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

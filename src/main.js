import Vue from 'vue'
import App from './App.vue'
import VueAnalytics from 'vue-ua'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

Vue.use(VueAnalytics, {
    appName: 'crisis tracker',
    appVersion: '1.0',
    trackingId: 'UA-154055629-1',
})

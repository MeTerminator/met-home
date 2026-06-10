import { createApp } from 'vue'
import VueFullPage from 'vue-fullpage.js'
import 'vue-fullpage.js/dist/style.css'
import './style.css'
import './index.css'
import './header.css'
import App from './App.vue'
import { vScrollChain } from './directives/scrollChain'

const app = createApp(App)
app.use(VueFullPage)
app.directive('scroll-chain', vScrollChain)
app.mount('#app')
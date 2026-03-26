import { createApp } from 'vue'
import VueFullPage from 'vue-fullpage.js'
import 'vue-fullpage.js/dist/style.css'
import './style.css'
import './index.css'
import './header.css'
import App from './App.vue'

const app = createApp(App)
app.use(VueFullPage)
app.mount('#app')
import { createApp } from 'vue'
import App from './App'
import router from './router'
import axios from './axios'
import VueAxios from 'vue-axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css';

let app = createApp(App);

app.use(ElementPlus)
    .use(VueAxios,axios)
    .use(router)
    .mount('#app')


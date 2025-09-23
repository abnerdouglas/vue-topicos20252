import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'

axios.defaults.baseURL = 'https://super-duper-waddle-q5qjqq5vj5h4qjr-8080.app.github.dev/'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

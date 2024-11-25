import './style.scss'
import "vue3-openlayers/styles.css";

import { createApp } from 'vue'

import { createPinia } from 'pinia'

import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

import { startFetcher } from './fetcher'

startFetcher()

app.mount('#app')

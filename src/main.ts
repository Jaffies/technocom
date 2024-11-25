import './style.scss'
import "vue3-openlayers/styles.css";

import { createApp } from 'vue'

import { createPinia } from 'pinia'
import OpenLayersMap from "vue3-openlayers";

import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.use(OpenLayersMap)

import { startFetcher } from './fetcher'

startFetcher()


app.mount('#app')

import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

import { useCredentialsStore } from './store/token'
import { fetchToken } from './fetcher'

const store = useCredentialsStore()

fetchToken().then(fetchedToken => {
    if (!fetchedToken) return

    store.token = fetchedToken
})

app.mount('#app')

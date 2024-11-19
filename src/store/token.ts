import { defineStore } from "pinia"
import { ref, Ref } from "vue"

export const useCredentialsStore = defineStore('credentials', () => {
    const token: Ref<string|null> = ref(null)

    return {token}
})
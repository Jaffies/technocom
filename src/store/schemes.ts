import { defineStore } from "pinia"
import { Ref, ref, watch } from "vue"
import { useCredentialsStore } from "./token"
import { fetchSchemas } from "../fetcher"

export interface Scheme {
    ID : string,
    Name : string,
    Group : string,
    GroupID : string       
}

export const useSchemasStore = defineStore('schemas', () => {
    const store = useCredentialsStore()

    const schemas : Ref<Scheme[]> = ref([])

    watch(
        () => store.token,
        async (newToken) => {
            if (!newToken) return
            schemas.value = await fetchSchemas(newToken) || []
        }
    )

    const selectedScheme : Ref<Scheme | null> = ref(null)

    return {schemas, selectedScheme: selectedScheme}
})
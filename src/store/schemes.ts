import { defineStore } from "pinia"
import { Ref, computed, ref, shallowRef, watch } from "vue"
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

    const schemas = shallowRef<Scheme[]>([]) 

    watch(
        () => store.token,
        async (newToken) => {
            if (!newToken) return
            schemas.value = await fetchSchemas(newToken) || []
        }
    )

    const selectedSchemeID : Ref<string | null> = ref(null)
    
    const selectedScheme = computed(() => schemas.value.find(x => x.ID == selectedSchemeID.value) || null)

    return {schemas, selectedScheme: selectedScheme, selectedSchemeID}
})

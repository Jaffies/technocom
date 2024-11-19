import { defineStore } from "pinia"
import { Ref, computed, ref, watch } from "vue"
import { useSchemasStore } from "./schemes"
import { fetchDevices } from "../fetcher"
import { useCredentialsStore } from "./token"

interface Group {
    ID : string,
    ParentID : string|null,
    Name : string
}

interface Item {
    Image : string,
    ImageColored : string,
    ImageHue : number,
    ID : string,
    ParentID : string|null,
    Name : string,
    Allowed : boolean,
    Properties : {inherited : boolean, type : number, name : string, value : string}[],
    FixedLocation : {lat : number, lng : number} | null,
    TripSplitters : Array<{ID : number, Name : string}>,
    IsAreaEnabled : boolean,
    Selected : boolean | null // Оно уже внутри js ставится, не в запросе самом
}

interface Tree extends Group {
    childrenGroups : Array<Tree>,
    childrenItems : Array<Item>
}

export type {Item, Tree, Group}

function toTree(parent : Tree, groupArray : Group[], itemArray : Item[]) {
    const groups = groupArray.filter(x => x.ParentID == parent.ID)

    for (const group of groups) {
        const newTree = Object.assign({ childrenGroups : [], childrenItems : [] }, group)

        parent.childrenGroups.push(newTree)
        toTree(newTree, groupArray, itemArray)
    }

    const items = itemArray.filter(x => x.ParentID == parent.ID)

    for (const item of items) {
        parent.childrenItems.push(item)
    }
}

export const useDevicesStore = defineStore('devices', () => {
    const deviceGroups : Ref<Group[]> = ref([])
    const devices : Ref<Item[]> = ref([])

    const deviceTree = computed(() => {
        
        const firstOne = deviceGroups.value.find(x => x.ParentID == null) as Group

        const tree : Tree = Object.assign({ childrenGroups : [], childrenItems : [] }, firstOne)

        toTree(tree, deviceGroups.value, devices.value)

        return tree
    })

    const schemas = useSchemasStore()
    const credentials = useCredentialsStore()

    watch(() => schemas.selectedScheme, (newValue) => {
        if (!newValue || !credentials.token) return

        const {groups, items} = fetchDevices(credentials.token, newValue.ID)
    })

    return {deviceGroups, devices, deviceTree}
})
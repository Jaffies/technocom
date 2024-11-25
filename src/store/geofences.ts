import { defineStore } from "pinia"
import { Ref, ref, shallowRef} from "vue"
import { GeoFenceItem, Group, Tree } from "../types"

function toTree(parent : Tree, groupArray : Group[], itemArray : GeoFenceItem[]) {
    const groups = groupArray.filter(x => x.ParentID == parent.ID)

    for (const group of groups) {
        const newTree = Object.assign({ childrenGroups : [] as Group[] , childrenItems : [] as GeoFenceItem[] }, group) as Tree

        parent.childrenGroups.push(newTree)
        toTree(newTree, groupArray, itemArray)
    }

    const items = itemArray.filter(x => x.ParentID == parent.ID)

    for (const item of items) {
        parent.childrenItems.push(item)
    }
}

export const useGeoFencesStore = defineStore('geofences', () => {
    // const geoFenceGroups : Ref<Group[]> = ref([])
    const geoFenceGroups = shallowRef<Group[]>([])
    const geoFences : Ref<GeoFenceItem[]> = ref([])

    const geoFenceTree = shallowRef<Tree>()
    function computeTree() {
        const firstOne = geoFenceGroups.value.find(x => x.ParentID == null) as Group

        const tree : Tree = Object.assign({ childrenGroups : [], childrenItems : [] }, firstOne)

        toTree(tree, geoFenceGroups.value, geoFences.value)

        geoFenceTree.value = tree
    }
  
    return {geoFenceGroups, geoFences, geoFenceTree, computeTree}
})

import { defineStore } from "pinia"
import { Ref, ref, shallowRef } from "vue"
import { Tree, Group, DeviceItem } from "../types"

function toTree(parent : Tree, groupArray : Group[], itemArray : DeviceItem[]) {
    const groups = groupArray.filter(x => x.ParentID == parent.ID)

    for (const group of groups) {
        const newTree = Object.assign({ childrenGroups: [] as Group[], childrenItems: [] as DeviceItem[] }, group) as unknown as Tree

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
    const devices : Ref<DeviceItem[]> = ref([])

    const deviceTree = shallowRef<Tree>()

    function computeTree() {
        const firstOne = deviceGroups.value.find(x => x.ParentID == null) as Group

        const tree : Tree = Object.assign({ childrenGroups : [], childrenItems : [] }, firstOne)

        toTree(tree, deviceGroups.value, devices.value)

        deviceTree.value = tree
    }

    return {deviceGroups, devices, computeTree, deviceTree}
})

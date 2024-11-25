<script setup lang="ts" vapor>
    //import { useSchemesStore } from './store/schemes';
    import {computed, ref, Ref} from 'vue'

    import SchemeSelecter from './components/SchemeSelecter.vue';
    import TreeView from './components/TreeView.vue';
    import { useDevicesStore } from './store/devices';
    import { useGeoFencesStore } from './store/geofences';
    import MapComponent from './components/MapComponent.vue';
import { Item } from './types';
    
    const selectedTree : Ref< string|null > = ref(null)

    function changeTree(tree: string) {
        selectedTree.value = tree
    }

    const deviceStore = useDevicesStore()
    const geoFencesStore = useGeoFencesStore()

    const items = computed(() => {
        return (deviceStore.devices.filter(x => x.Selected) as Item[]).concat(geoFencesStore.geoFences.filter(x => x.Selected) as Item[])
    })
</script>

<template>
    <SchemeSelecter></SchemeSelecter>

    <div class="bar">
        <button :class="selectedTree == 'devices' && 'active' || ''" @click="changeTree('devices')">Транспорт</button>
        <button :class="selectedTree == 'geofences' && 'active' || ''" @click="changeTree('geofences')">Геозоны</button>
    </div>

    <div ref="tree" class="tree">
        <div style="flex-grow: 0.3; overflow: scroll;">
            <TreeView class='treeView' v-show="selectedTree == 'devices'" :data="deviceStore.deviceTree"></TreeView>
            <TreeView class='treeView' v-show="selectedTree == 'geofences'" :data="geoFencesStore.geoFenceTree"></TreeView>
        </div>

        <MapComponent :data="items" style="flex-grow: 1;"></MapComponent>
    </div>
</template>

<style scoped lang="scss">
    .bar {
        display: flex;
        justify-content: space-around;
    }

    .active {
        filter: brightness(2);
    }

    .tree {
        background-color: #171418;
        border-radius: 8px;
        margin: 12px;
        height: 500px;
        overflow: scroll;
        display: flex;
    }

    .treeView {
        will-change: display;
    }
</style>

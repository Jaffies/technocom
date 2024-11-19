<script setup lang="ts">
    //import { useSchemesStore } from './store/schemes';
    import {ref, Ref} from 'vue'

    import SchemeSelecter from './components/SchemeSelecter.vue';
    import TreeView from './components/TreeView.vue';
    
    const selectedTree : Ref< string|null > = ref(null)

    function changeTree(tree: string) {
        selectedTree.value = tree
    }
</script>

<template>
    <SchemeSelecter></SchemeSelecter>

    <div class="bar">
        <button :class="selectedTree == 'devices' && 'active' || ''" @click="changeTree('devices')">Транспорт</button>
        <button :class="selectedTree == 'geozones' && 'active' || ''" @click="changeTree('geozones')">Геозоны</button>
    </div>

    <TreeView></TreeView>
</template>

<style scoped lang="scss">
    .bar {
        display: flex;
        justify-content: space-around;
    }

    .active {
        filter: brightness(2);
    }
</style>
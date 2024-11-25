<script setup lang="ts">
import { Tree } from '../types';

const props = defineProps<{
    data ?: Tree,
    // geozoneTree ?: GeozoneTree
}>()

</script>

<template>
    <div v-if="props.data && (props.data.childrenGroups.length > 0 || props.data.childrenItems.length > 0)">
        <ul>
            <details open v-for="group in props.data.childrenGroups">
                <summary>
                    {{ group.Name }}
                </summary>
                <div>
                    <TreeView :data="group"></TreeView>
                </div>
            </details>
            <li v-for="item in props.data.childrenItems" class="item">
                <div class="container">
                    <img :src='"https://test.agweb.cloud/Image/Car/" + item.ImageColored' height="32px" width="32px"/>
                    <div>{{ item.Name }}</div>
                </div>

                <div class="container">
                    <input type="checkbox" :name="item.ID" v-model="item.Selected"></input>
                </div>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    .item {
        border-style: solid;
        border-radius: 8px;
        border-color: #4930a5;
        padding: 8px;
        margin: 8px;

        display: flex;
        align-content: start;
        justify-content: space-between;
        vertical-align: middle;
    }

    img {
        margin-right: 1rem;
    }

    .container {
        display: flex;
        align-items: center;
    }
</style>

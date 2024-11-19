<script setup lang="ts">

interface TreeDataObject {
    checked : boolean,
    name : string,
    id : string
}

type TreeData = Array<TreeData | TreeDataObject>

const {data}  = defineProps({
    data : Array<TreeData | TreeDataObject>
})
</script>

<template>
    <div v-if="data && data.length > 0">
        <ul>
            <li v-for="(i, index) in data" :key="index">
                <div v-if="Array.isArray(i)">
                    <TreeView :data="i"></TreeView>
                </div>
                <div v-else>
                    <div>
                        {{ i.name }}
                    </div>

                    <input type="checkbox" :name="i.id"></input>
                    <label :for="i.id">
                        {{ i.name }}
                    </label>
                </div>

            </li>
        </ul>
    </div>
</template>
<script setup lang="ts" vapor>
import { storeToRefs } from 'pinia';
import { useSchemasStore } from '../store/schemes';

const store = useSchemasStore()

const {selectedSchemeID} = storeToRefs(store)
</script>

<template>
    <select placeholder="Схема" v-model="selectedSchemeID">
        <option v-for="(data, index) in store.schemas" :key = "index" :value="data.ID" :label="data.Name"></option>
    </select>
</template>
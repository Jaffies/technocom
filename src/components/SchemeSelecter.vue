<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSchemasStore } from '../store/schemes';

const store = useSchemasStore()

const {selectedScheme} = storeToRefs(store)
</script>

<template>
    <select placeholder="Схема" v-model="selectedScheme">
        <option v-for="(data, index) in store.schemas" :key = "index" v-html="data.Name"></option>
    </select>
</template>
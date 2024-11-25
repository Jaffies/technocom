<script setup lang="ts">
  import { Map, Layers, Sources, Geometries, Styles } from 'vue3-openlayers';
  import { DeviceItem, GeoFenceItem, Item, isDevice } from '../types';
  import { computed, onWatcherCleanup, ref, shallowRef, triggerRef, watch } from 'vue';
  import axios from 'axios';
  import { useCredentialsStore } from '../store/token';
  import { useSchemasStore } from '../store/schemes';

  const props = defineProps<{
    data ?: Item[]
  }>()

  const devices = computed(() => {
    if (!props.data) return []
    return props.data?.filter(x => isDevice(x)) as DeviceItem[]
  })

  const geoFences = computed(() => {
    if (!props.data) return []
    return props.data?.filter(x => !isDevice(x)) as GeoFenceItem[]
  })

  type Point = Array<number>[]

  const deviceTrackPoints = shallowRef<Point[]>([])

  watch(() => devices.value, async (newValue) => {
    if (newValue.length == 0) return
       
    const schemasStore = useSchemasStore()

    if (!schemasStore.selectedScheme) return

    let stopped = false
    onWatcherCleanup(() => {
      stopped = true
    })

    const date = new Date()
    const prevDate = new Date(Date.now() - 1000*3600*24)

    const {data} = await axios.post('https://test.agweb.cloud/ServiceJSON/GetTrack', {
      session : useCredentialsStore().token,
      schemaID : schemasStore.selectedScheme.ID,
      IDs : newValue.map(x => x.ID).join(','),
      SD : `${prevDate.getFullYear()}${prevDate.getMonth()+1}${prevDate.getDate()}`,
      ED : `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}`
     }) as {data : {[key : string] : {Lat : number[], Lng : number[]}[]}}

    if (stopped) return

    const newPoints : Point[] = []


    for (const deviceID in data) {
      const device = data[deviceID]

      console.log(device)

      for (const track of device) {
        const point = Array.from(Array(track.Lng.length).keys(), x => [track.Lng[x], track.Lat[x]])

        newPoints.push(point)
      }
    }

    deviceTrackPoints.value = newPoints
  })

  type Polygon = Array<number[][]>
  
  const geoFencesPolygons = shallowRef<Polygon[]>([])

  watch( () => geoFences.value, async (newValue) => {
    if (newValue.length == 0) return

    const schemasStore = useSchemasStore()

    if (!schemasStore.selectedScheme) return

    let stopped = false

    onWatcherCleanup(() => {
      stopped = true
    })

    const {data} = await axios.post('https://test.agweb.cloud/ServiceJSON/GetGeoFences', {
      session : useCredentialsStore().token,
      schemaID : schemasStore.selectedScheme.ID,
      IDs : newValue.map(x => x.ID).join(',')
    }) as {data : {[key: string] : {Lat : number[], Lng : number[], Holes : Array<{Lat : number[], Lng : number[]}> | null}}}

    if (stopped) return
    const newPolygons : number[][][][]  = []
    for (const index in data) {
      const item = data[index]
      const newItem = [
        Array.from(Array(item.Lat.length).keys(), x => [item.Lng[x], item.Lat[x]])
      ]

      if (item.Holes) {
        for (const hole of item.Holes) {
          newItem.push(
            Array.from(Array(hole.Lat.length).keys(), x => [hole.Lat[x], hole.Lng[x]])
          )
        }
      }
      
      newPolygons.push(newItem)
    }

    geoFencesPolygons.value = newPolygons

    triggerRef(geoFencesPolygons)
  } )

  const center = ref<number[]>([35.3629947, 51.9950183])
  const zoom = ref<number>(13)
</script>

<template>
    <Map.OlMap>
      <Map.OlView :center="center" :zoom="zoom" projection="EPSG:4326"/>
      <Layers.OlTileLayer>
       <Sources.OlSourceOsm/>
      </Layers.OlTileLayer>

      <Layers.OlVectorLayer :z-index="1">
        <Sources.OlSourceVector>
          <Map.OlFeature v-for="i in deviceTrackPoints">
            <Geometries.OlGeomMultiPoint :coordinates="i" />
            <Styles.OlStyle>
              <Styles.OlStyleCircle :radius="4">
                <Styles.OlStyleFill color="white"></Styles.OlStyleFill>
                <Styles.OlStyleStroke color="gray"></Styles.OlStyleStroke>
              </Styles.OlStyleCircle>
            </Styles.OlStyle>
          </Map.OlFeature>
          <Map.OlFeature>
            <Geometries.OlGeomMultiPolygon :coordinates="geoFencesPolygons"></Geometries.OlGeomMultiPolygon>
            <Styles.OlStyle>
              <Styles.OlStyleStroke color="green" :width="2"></Styles.OlStyleStroke>
              <Styles.OlStyleFill color="#32008040"></Styles.OlStyleFill>
            </Styles.OlStyle>
          </Map.OlFeature>
        </Sources.OlSourceVector>
      </Layers.OlVectorLayer>
    </Map.OlMap> 
  </template>

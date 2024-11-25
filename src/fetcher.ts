import axios from "axios-queue-js"
import { Scheme, useSchemasStore } from "./store/schemes"
import { DeviceItem, GeoFenceItem, Group, Item } from "./types"
import { watch } from "vue"
import { useCredentialsStore } from "./store/token"
import { useDevicesStore } from "./store/devices"
import { useGeoFencesStore } from "./store/geofences"

const fetchToken = async () => {
    const res = await axios.post('https://test.agweb.cloud/ServiceJSON/Login', {
        UserName : 'userapi',
        Password : '123'
    })

    if (res.status != 200) {
        alert('Сбой аутентификации.')
        return
    }

    return res.data as string
}

const fetchSchemas = async (token: string) => {
    const res = await axios.post('https://test.agweb.cloud/ServiceJSON/EnumSchemas', {
        session : token
    })

    const data:Scheme[] | undefined = res.data

    return data
}

const fetchGroup = async (endPoint : string, groups : Array<Group>, items : Array<Item>, token : string, schemaID : string, parentID : string | null) => {
    const {data} = await axios.post('https://test.agweb.cloud/ServiceJSON/Enum' + endPoint, {
        session: token,
        schemaID,
        parentIDs : parentID
    })

    const fetchedGroups : Array<Group> = data.Groups || []
    const fetchedItems : Array<Item> = data.Items || []

    fetchedItems.forEach(x => {x.Selected = false})

    items.push(...(fetchedItems.filter(x => !items.find(y => y.ID == x.ID))))

    for (const group of fetchedGroups) {
        if (!groups.find(x => x.ID == group.ID)) {
            groups.push(group)

            await fetchGroup(endPoint, groups, items, token, schemaID, group.ID)
        }
    }
}

const fetchDevices = async (token: string, schemaID : string) => {
    const groups : Array<Group> = []
    const items : Array<DeviceItem> = []
    await fetchGroup('Devices', groups, items, token, schemaID, null)
    return {groups, items}
}

const fetchGeoFences = async (token : string, schemaID : string) => {
    const groups : Array<Group> = []
    const items : Array<GeoFenceItem> = []

    await fetchGroup('GeoFences', groups, items, token, schemaID, null)
    return {groups, items}
}

const startFetcher = () => {
    const schemaStore = useSchemasStore()
    const credentialStore = useCredentialsStore()

    const devicesStore = useDevicesStore()
    const geoFencesStore = useGeoFencesStore()

    watch(() => schemaStore.selectedScheme, async (newValue) => {
        if (!newValue || !credentialStore.token) return

        {
            const {groups, items} = await fetchDevices(credentialStore.token, newValue.ID)

            devicesStore.deviceGroups = groups
            devicesStore.devices = items

            devicesStore.computeTree()
        }

        {
            const {groups, items} = await fetchGeoFences(credentialStore.token,newValue.ID)

            geoFencesStore.geoFenceGroups = groups
            geoFencesStore.geoFences = items

            geoFencesStore.computeTree()
        }
    })

    fetchToken().then(fetchedToken => {
        if (!fetchedToken) return
    
        credentialStore.token = fetchedToken
    })
}

export {fetchSchemas, startFetcher}

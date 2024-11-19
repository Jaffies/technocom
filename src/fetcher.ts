import axios from "axios"
import { Scheme } from "./store/schemes"
import { Group, Item } from "./store/devices"

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

const fetchGroup = async (groups : Array<Group>, token : string, schemaID : string, parentID : string) {

}

const fetchDevices = async (token: string, schemaID : string) => {
    const res = await axios.post('https://test.agweb.cloud/ServiceJSON/EnumDevices', {
        session: token,
        schemaID
    })

    const data = res.data

    const groups : Array<Group> = data.Groups
    const items : Array<Item> = data.Items

    return {groups, items}
}

export {fetchToken, fetchSchemas, fetchDevices}
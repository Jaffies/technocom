interface Group {
    ID : string,
    ParentID : string|null,
    Name : string
}

interface Tree extends Group {
    childrenGroups : Array<Tree>,
    childrenItems : Array<Item>
}

interface DeviceItem extends Item {
    ImageHue : number,
    Allowed : boolean,
    TripSplitters : Array<{ID : number, Name : string}>,
    IsAreaEnabled : boolean,
}

interface GeoFenceItem extends Item {} // хз что там особенного лол

interface Item {
    ID : string,
    ParentID : string|null,
    Name : string,
    FixedLocation : {lat : number, lng : number},
    Properties : {inherited : boolean, type : number, name : string, value : string}[],
    Image : string,
    ImageColored : string,
    Selected ?: boolean, // Оно уже внутри js ставится, не в запросе самом
}

const isDevice = (device : any) => {
    return device?.Allowed != undefined // говно решение
}

export type {Item, Tree, Group, DeviceItem, GeoFenceItem}

export {isDevice}
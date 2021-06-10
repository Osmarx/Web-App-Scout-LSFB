


export  interface MapsData{
    
    lat: Number,
    lng: Number,
    label: String

}

export interface MapHtml{
    zoom:Number;
  
    
}

export interface Camp{

    _id: String;
    Lugar: String;
    Ano: Number;
    Longitud: Number;
    Latitud: Number;
    Estacion: String;

}

export interface CampsArray{

    CampsData: Array<Camp>

}
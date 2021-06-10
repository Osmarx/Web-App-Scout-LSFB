export  interface HistoryData{
    _id: string;
    Elemento: string;
    Titulo: string;
    Texto: string;
    Imagen: string;

}

export interface History{
    Data: Array<HistoryData>
}

export interface HistoryImageFile{
    body: Blob
}
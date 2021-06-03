export interface Carrousel_Data{
    _id: string;
    NumeroCarrousel:string;
    TituloCarrousel: string;
    CuerpoCarrousel: string;
    ImagenCarrousel: string;
}

export interface Carrousel{
   
	CarrouselData: Array<Carrousel_Data>
}

export interface CarrouselImageFile{
	body: Blob;
}



export interface NewData{

	_id: string;
	Bajada: string;
	Cuerpo: string;
	Entradilla: string;
	Fecha: string;
	Imagen: string;
	Titulo: string;


}

export interface News{
   
	Noticias: Array<NewData>
}

export interface NewsImage{
	body: Blob;
}


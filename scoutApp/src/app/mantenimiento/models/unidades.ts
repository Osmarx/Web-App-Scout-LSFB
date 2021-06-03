export interface Unidad{
	_id: string;
	Unidad: string;

}

export interface unidad{
	_id: string;
	_idRama: string;
	Unidad: string;
	Texto: string;
	Titulo: string;
	ImageFile: string;
	Field: string;

}

export interface UnidadesArray{
	DataRama: Array<unidad>
}

export interface ElementImageFile{
	body: Blob;
}




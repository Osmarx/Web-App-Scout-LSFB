export interface FileData{
	_id: string;
	Nombre: string;
	Descripcion: string;
}

export interface Files{
	body: {Archivos: Array<FileData>;}
}

export interface FilesASD{
	body: Blob;
}
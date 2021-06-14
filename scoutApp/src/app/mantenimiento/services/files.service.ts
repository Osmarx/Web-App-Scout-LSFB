import {Injectable} from '@angular/core';
import {GLOBAL} from './global';
import {HttpClient, HttpHeaders, HttpResponse} from  '@angular/common/http';
import {Files,FilesASD} from '../models/files'
import {Observable} from 'rxjs'

@Injectable()
export class FilesService{

    public url: string;
    private token: string;

    constructor(private http: HttpClient ){
		this.url = GLOBAL.url;
        this.token = localStorage.getItem('Token')
	}

    UploadFile(File){
		
        let params = File
        let headers = new HttpHeaders({ 'enctype': 'multipart/form-data','Authorization':  this.token})
    
        let options = { headers: headers, observe: 'response' as 'body'};

      
		return this.http.post<void>(this.url + 'uploadFile', params, options) 
    }

    getFiles(): Observable<Files>{
		
        let headers = new HttpHeaders({ 'enctype': 'application/json','Authorization': this.token})
    
        let options = { headers: headers, observe: 'response' as 'body'};

      
		return this.http.get<Files>(this.url + 'getFiles', options) 
    }

    DownloadFiles(_id) {	

        let headers = new HttpHeaders({ 'Content-Type': 'application/json','Authorization':  this.token})
    
        let options = { headers: headers, observe: 'response' as 'body' , responseType: 'blob' as 'json' };
        
        return this.http.get<FilesASD>(this.url + 'downloadFile/'+JSON.stringify(_id),options) 	
		
   }

   deleteFiles(FileData){

    let headers = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': this.token})
    let options = { headers: headers, observe: 'response' as 'body'};

    return this.http.delete(this.url + 'deleteFiles/'+JSON.stringify(FileData),options)

   }

}
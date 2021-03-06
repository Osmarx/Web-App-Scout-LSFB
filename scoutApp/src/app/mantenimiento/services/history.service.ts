import {Injectable} from '@angular/core';
import {GLOBAL} from './global';
import {HttpClient, HttpHeaders, HttpResponse} from  '@angular/common/http';
import {History,HistoryImageFile} from '../models/history'

@Injectable()
export class HistoryService{
    public url: string;
    private token: string;

    constructor(private http: HttpClient ){
		this.url = GLOBAL.url;
        this.token = localStorage.getItem('Token')
	}

    AddHistoryData(_id,Data){
		
        let params = Data
        let headers = new HttpHeaders({'enctype': 'multipart/form-data','Authorization': this.token});
    
        let options = { headers: headers, observe: 'response' as 'body'};
  
        return this.http.put<void>(this.url + 'updateHistory/'+JSON.stringify(_id), params,options)
        
    }

    getHistoryData(){
		
        return this.http.get<History>(this.url + 'history')
        
    }

    getHistoryImage(_id){

        let headers = new HttpHeaders({ 'enctype': 'application/json','Authorization': this.token})
    
        let options = { headers: headers, observe: 'response' as 'body' , responseType: 'blob' as 'json' };
		
        return this.http.get<HistoryImageFile>(this.url + 'getHistoryImage/'+JSON.stringify(_id),options)
        
    }

}
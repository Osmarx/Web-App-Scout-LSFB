
import {GLOBAL} from './global';
import {HttpClient, HttpHeaders, HttpResponse} from  '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class TokenService{

    public url: string;

    constructor(private http: HttpClient){
        this.url = GLOBAL.url;
    }

    getToken(userData){

        let params = userData;

        let headers = new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origen':'POST'
        
    })
    
        let options = { headers: headers, observe: 'response' as 'body'};

		return this.http.post<any>(this.url + 'token', params, options)

    }


}
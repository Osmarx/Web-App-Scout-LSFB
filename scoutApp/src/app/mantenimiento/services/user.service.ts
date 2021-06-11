import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from  '@angular/common/http';
import {GLOBAL} from './global';
import {Token} from '../models/token'
import {User} from '../models/user'


@Injectable()
export class UserService{

    private token
    public url: string;

    constructor(private http: HttpClient ){
		this.url = GLOBAL.url;

	}

    signUp(userData){
        let params = userData;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json'})
    
        let options = { headers: headers, observe: 'response' as 'body'};

		return this.http.post<User>(this.url + 'login', params, options)
    }
    


}
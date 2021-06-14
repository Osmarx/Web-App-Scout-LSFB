import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CampsArray } from '../models/maps'

@Injectable()
export class CampsService {

  public url: string;
  private token: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('Token')

  }

  AddCamps(CampsData) {

    console.log(this.token)
    let params = CampsData
    
    let headers = new HttpHeaders({ 
      
      
      'Content-Type': 'application/json',
      'Authorization':  this.token
  
  })

    let options = { headers: headers, observe: 'response' as 'body' };


    return this.http.post<void>(this.url + 'Camp', params, options)


  }

  getAllsCamps() {
    return this.http.get<CampsArray>(this.url + 'Camp')
  }

  deleteCamp(_id) {

    let headers = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': this.token})
    let options = { headers: headers, observe: 'response' as 'body' };

    return this.http.delete(this.url + '/deleteCamp/' + JSON.stringify(_id), options)


  }

}
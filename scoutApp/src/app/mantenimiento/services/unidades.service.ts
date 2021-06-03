import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { GLOBAL } from './global';
import { Unidad,UnidadesArray,ElementImageFile} from '../models/unidades'

@Injectable()
export class UnidadesService {

  public url: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  UpdateData(Data) {
    console.log(Data)

    let params = Data
    let headers = new HttpHeaders({ 'enctype': 'multipart/form-data' })

    let options = { headers: headers, observe: 'response' as 'body' };


    return this.http.put<void>(this.url + 'ramas', params, options)
  }

  getDataPage(Rama) {

    return this.http.get<Unidad>(this.url + 'ramas/' + Rama)
  }

  AddData(Data,_idRama) {

    let params = Data
    let headers = new HttpHeaders({ 'enctype': 'multipart/form-data' })

    let options = { headers: headers, observe: 'response' as 'body' };

    return this.http.post<void>(this.url + 'rama/'+JSON.stringify(_idRama), params, options)
  }

  getElementsPage(_idRama) {
      
      return this.http.get<UnidadesArray>(this.url + 'rama/'+JSON.stringify(_idRama))
   
  }

  getImageElementsperPage(_id) {

      let headers = new HttpHeaders({ 'enctype': 'application/json'})
    
      let options = { headers: headers, observe: 'response' as 'body' , responseType: 'blob' as 'json' };

	  	return this.http.get<ElementImageFile>(this.url + 'getImageRama/'+JSON.stringify(_id), options) 
      
     
   
  }

}
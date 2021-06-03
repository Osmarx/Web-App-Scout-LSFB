import {Injectable} from '@angular/core';
import {GLOBAL} from './global';
import {HttpClient, HttpHeaders, HttpResponse} from  '@angular/common/http';
import {Carrousel,CarrouselImageFile} from '../models/carrousel'
import {Observable} from 'rxjs'


@Injectable()
export class CarrouselService{
    public url: string;

    constructor(private http: HttpClient ){
		this.url = GLOBAL.url;

	}


    getCarrouselData(){
	
		 return this.http.get<Carrousel>(this.url + 'carrousel') 
    }

    getImageCarrousel(_id){

        let headers = new HttpHeaders({ 'enctype': 'application/json'})
    
        let options = { headers: headers, observe: 'response' as 'body' , responseType: 'blob' as 'json' };

		return this.http.get<CarrouselImageFile>(this.url + 'getImageCarrousel/'+JSON.stringify(_id), options) 

    }

    updateCarrouselData(CarrouselData,isUpdateImage){
		
        let params = CarrouselData
        let headers = new HttpHeaders({'enctype': 'multipart/form-data'})
    
        let options = { headers: headers, observe: 'response' as 'body'};

      
		return this.http.put<void>(this.url + 'UpdateCarrousel/'+isUpdateImage, params, options) 
    }

    AddCarrouselData(CarrouselData){
		
        let params = CarrouselData
        let headers = new HttpHeaders({ 'Content-Type': 'application/json'})
    
        let options = { headers: headers, observe: 'response' as 'body'};

      
		return this.http.post<void>(this.url + 'carrousel', params, options) 
     
        
    }

}
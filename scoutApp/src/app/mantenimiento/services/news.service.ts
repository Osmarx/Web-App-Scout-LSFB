import {News,NewsImage} from '../models/news'
import {Injectable} from '@angular/core';
import {GLOBAL} from './global';
import {HttpClient, HttpHeaders, HttpResponse} from  '@angular/common/http';


@Injectable()
export class NewsService{
    
    public url: string;
    private token: string;

    constructor(private http: HttpClient ){
		this.url = GLOBAL.url;
    this.token = localStorage.getItem('Token')
	}

    getAllnews(){
        
		return this.http.get<News>(this.url + 'news')

    }

    getImageNews(_id){
      
      let headers = new HttpHeaders({ 'enctype': 'application/json','Authorization': this.token})
    
      let options = { headers: headers, observe: 'response' as 'body' , responseType: 'blob' as 'json' };

      let id = JSON.stringify(_id)

      return this.http.get<NewsImage>(this.url + 'getImageNews/'+id,options)
  
      }

    addNews(NewsData){
      
      let params = NewsData
      let headers = new HttpHeaders({'enctype': 'multipart/form-data','Authorization': this.token});
  
      let options = { headers: headers, observe: 'response' as 'body'};

    
     
      return this.http.post<void>(this.url + 'news', params,options)
 
    }

    updateNews(NewsData,_id){
      
      console.log(JSON.stringify(_id))
      let params = NewsData
      let headers = new HttpHeaders({'enctype': 'multipart/form-data','Authorization': this.token});
  
      let options = { headers: headers, observe: 'response' as 'body'};

    
    
      return this.http.put<void>(this.url + 'updateNews/'+JSON.stringify(_id), params,options)


    }

    deleteNews(_id){

      
    
      let headers = new HttpHeaders({'enctype': 'multipart/form-data','Authorization': this.token});
  
      let options = { headers: headers, observe: 'response' as 'body'};

    
    
      return this.http.delete<void>(this.url + 'deleteNews/'+JSON.stringify(_id), options)


    }

}

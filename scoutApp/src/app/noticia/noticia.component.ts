import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {NewData} from '../mantenimiento/models/news'
import {NewsService} from '../mantenimiento/services/news.service'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.css'],
  providers: [NewsService]

})
export class NoticiaComponent implements OnInit {


  newData: NewData
  catch;
  urlsImage

  constructor(
    private router:Router, 
    private activatedRoute:ActivatedRoute,
     private _newsService: NewsService,
     private sanitizer : DomSanitizer,) { 

    this.catch = this.router.getCurrentNavigation().extras.state
    if(this.catch){
      localStorage.setItem('PreloadNew',JSON.stringify(this.catch.state))
    }else{
      
    }
  }
    
  ngOnInit(): void {
    if(this.catch){
      this.newData = this.catch.state
    }else{
      
      this.newData = JSON.parse(localStorage.getItem('PreloadNew'))
    }
    
    
    

  
    this._newsService.getImageNews(this.newData._id).subscribe(
      (response)=>{

        let urlImageNews = window.URL.createObjectURL(response.body);
        this.urlsImage = this.sanitizer.bypassSecurityTrustUrl(urlImageNews)
   
      }
    ) 
  }
  


}

import { Component, OnInit} from '@angular/core';
import {NewsService} from '../mantenimiento/services/news.service'
import {CarrouselService} from '../mantenimiento/services/carrousel.service'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import {Carrousel_Data} from '../mantenimiento/models/carrousel'
import {NewData} from '../mantenimiento/models/news'
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { Router } from '@angular/router';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [NewsService,CarrouselService]
})



export class MainComponent implements OnInit {

  constructor(
    
    private _newsService: NewsService,
    private modalService: NgbModal,
    private _carrouselService: CarrouselService,
    private sanitizer : DomSanitizer,
    private router : Router

    ) {


     this.config = {
      itemsPerPage: 3,
      currentPage: 1,
      totalItems: 0
    }; 

     }
    


  
  allNews: Array<NewData>
  _file
  _fileImgCarrousel
  fileName: string; 
  user: string
  closeResult: string;
  messageForm: string;
  NewsForm = new FormGroup({
    Titulo: new FormControl(''),
    Bajada: new FormControl(''),
    Entradilla: new FormControl(''),
    Cuerpo: new FormControl(''),
    Imagen: new FormControl(null)
  });
    isAlertOnErr: boolean;
    isAlertOnSucc: boolean;
    isDeveloperModeOn: boolean;
    tittleNewsForm: string;
    isModeAddNews: boolean;
    TittleNumberCarrousel = 'Carrusel 1' 
    
    CarrouselForm = new FormGroup({
      NumeroCarrousel: new FormControl(''),
      TituloCarrousel: new FormControl(''),
      CuerpoCarrousel: new FormControl(''),
      ImagenCarrousel: new FormControl(''),
    });
    carrouselData: Array<Carrousel_Data>
    urlImageCarrousel: string;
    CarrouselImage: Array<Blob>;
    urlCarrouselImage1
    urlCarrouselImage2
    urlCarrouselImage3
    DataCarrousel1: Carrousel_Data = {_id: '',NumeroCarrousel:'',TituloCarrousel: '', CuerpoCarrousel: '',ImagenCarrousel: ''}
    DataCarrousel2: Carrousel_Data = {_id: '',NumeroCarrousel:'',TituloCarrousel: '', CuerpoCarrousel: '',ImagenCarrousel: ''}
    DataCarrousel3: Carrousel_Data = {_id: '',NumeroCarrousel:'',TituloCarrousel: '', CuerpoCarrousel: '',ImagenCarrousel: ''}
    idCarrouselImage: Array<object>
    idCarrouselSelect
    config: any;
    imagesNews: Array<Blob>;
    urlsImagesNews: Array<object>;
    tittleDeleteModal: string
    CarrouselSelected = 0
    isAlertCarrouselOn 
    alertMessageCarrousel: string
    

  ngOnInit(): void {
   

    this.isAlertOnErr = false
    this.isAlertOnSucc = false
    this.isAlertCarrouselOn = false
    
    
    this.user = localStorage.getItem('user')

   

    this._newsService.getAllnews().subscribe(
      (response) => {                           
       
        
        this.allNews = response.Noticias
        console.log(this.allNews)

        this.config = {
          itemsPerPage: 3,
          currentPage: 1,
          totalItems: this.allNews.length
        };  

        this.imagesNews = []
        this.urlsImagesNews = []

        for(var i = 0; i < this.allNews.length ; i++){
          this._newsService.getImageNews(this.allNews[i]._id).subscribe(
            (response)=>{
 
              this.imagesNews.push(response.body)
              let urlImageNews = window.URL.createObjectURL(response.body);
              this.urlsImagesNews.push(this.sanitizer.bypassSecurityTrustUrl(urlImageNews))
         
            }
          )
        }
        

      
      
      },
      (error) => {                            
      }
    )
    
    
    
    this._carrouselService.getCarrouselData().subscribe(
      (response) => {  
        this.CarrouselImage = []
        this.carrouselData = response.CarrouselData

        this.idCarrouselSelect = this.carrouselData[0]._id
        
        

        this.DataCarrousel1 = this.carrouselData[0]
        this.DataCarrousel2 = this.carrouselData[1]
        this.DataCarrousel3 = this.carrouselData[2]

           this.CarrouselForm = new FormGroup({
      NumeroCarrousel: new FormControl(this.carrouselData[0].NumeroCarrousel),
      TituloCarrousel: new FormControl(this.carrouselData[0].TituloCarrousel),
      CuerpoCarrousel: new FormControl(this.carrouselData[0].CuerpoCarrousel),
      ImagenCarrousel: new FormControl('')
    });
      
        var idCarrouselImage = []



        for (let i = 0; i < this.carrouselData.length; i++) {
          idCarrouselImage.push(this.carrouselData[i]._id)
        }
        
        
        this._carrouselService.getImageCarrousel(idCarrouselImage[0]).subscribe(
          (res)=>{
            this.CarrouselImage.push(res.body) 
            
            this._carrouselService.getImageCarrousel(idCarrouselImage[1]).subscribe(
                (res)=>{
                      this.CarrouselImage.push(res.body)
                      this._carrouselService.getImageCarrousel(idCarrouselImage[2]).subscribe(
                        (res)=>{
                           const reader = new FileReader();

                          this.CarrouselImage.push(res.body)

                          
                          
                      
                          let urlCarrousel1 = window.URL.createObjectURL(this.CarrouselImage[0]);
                          let urlCarrousel2 = window.URL.createObjectURL(this.CarrouselImage[1]);
                          let urlCarrousel3 = window.URL.createObjectURL(this.CarrouselImage[2]);
                        
    
                          this.urlCarrouselImage1 = this.sanitizer.bypassSecurityTrustUrl(urlCarrousel1)
                          this.urlCarrouselImage2 = this.sanitizer.bypassSecurityTrustUrl(urlCarrousel2)
                          this.urlCarrouselImage3 = this.sanitizer.bypassSecurityTrustUrl(urlCarrousel3)
                          
                         
                          
                     
                        }
                      )
                }

            )
          }
        )
        })


    if(localStorage.getItem('isLogin')=="true"){
      console.log("modo desarrollador")
      this.isDeveloperModeOn = true

    }else{
      console.log("modo no desarrollador")
      this.isDeveloperModeOn = false
    }
    
    
  }



  open(content,mode) {

    if(mode=='Add'){
      this.tittleNewsForm = 'Formulario Agregar Noticia'
      this.isModeAddNews = true
      this.fileName = ''
    }

    if(mode=='Update'){
      this.tittleNewsForm = 'Formulario Modificar Noticia'
      this.isModeAddNews = false
     
      this.fileName = this.allNews[0].Imagen
      
      this.NewsForm = new FormGroup({
        Titulo: new FormControl(this.allNews[0].Titulo),
        Bajada: new FormControl(this.allNews[0].Bajada),
        Entradilla: new FormControl(this.allNews[0].Entradilla),
        Cuerpo: new FormControl(this.allNews[0].Cuerpo),
        Imagen: new FormControl(this.allNews[0].Imagen),
        _ID: new FormControl(this.allNews[0]._id)
      });

    }

    if(mode=='Carrousel'){
      
      this.urlImageCarrousel = this.carrouselData[0].ImagenCarrousel
      this.tittleNewsForm = 'Formulario Carrusel'
      
    }
  
    if(mode=='delete'){
      this.tittleDeleteModal = 'Eliminar Noticia'
      
    }

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result)
      
      this.closeResult = result
        /* window.location.reload();  */ 


    }, (reason) => {
      this.urlImageCarrousel = this.carrouselData[this.CarrouselSelected].ImagenCarrousel 
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
       
    });
  }

  private getDismissReason(reason: any): string {
    
    this.isAlertCarrouselOn = false
    this.isAlertOnErr = false

    this.NewsForm = new FormGroup({
      Titulo: new FormControl(),
      Bajada: new FormControl(),
      Entradilla: new FormControl(),
      Cuerpo: new FormControl(),
      Imagen: new FormControl(),
      _ID: new FormControl()
    });

    
    this.CarrouselForm = new FormGroup({
      NumeroCarrousel: new FormControl(this.carrouselData[this.CarrouselSelected].NumeroCarrousel),
      TituloCarrousel: new FormControl(this.carrouselData[this.CarrouselSelected].TituloCarrousel),
      CuerpoCarrousel: new FormControl(this.carrouselData[this.CarrouselSelected].CuerpoCarrousel),
      ImagenCarrousel: new FormControl('')
    });
    
    
    

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  addNews(){

    var News = this.NewsForm.value


    if(this._file && News.Titulo.length > 0 && News.Bajada.length > 0 && News.Entradilla.length > 0 && News.Cuerpo.length > 0){

      const NewsData: FormData = new FormData();
      
      NewsData.append('Titulo',News.Titulo); 
      NewsData.append('Bajada',News.Bajada); 
      NewsData.append('Entradilla',News.Entradilla);
      NewsData.append('Cuerpo',News.Cuerpo);
      NewsData.append('Imagen',this._file);
      

      this._newsService.addNews(NewsData).subscribe(
        (res)=>{
          this.isAlertOnSucc = true
          this.isAlertOnErr = false
          this.messageForm = "Noticia Guardada en el Servidor y Publicada con Éxito"
          window.location.reload();
        },
        (err)=>{
          this.isAlertOnErr = true
          this.isAlertOnSucc = false
          this.messageForm = "Error en el Servidor"
         
        }
      )

    }else{
      this.isAlertOnErr = true
      this.isAlertOnSucc = false
      this.messageForm = "Falta LLenar un Campo"
    }
    
    
  
  }

  onFileSelected(event){
    if(event.target.files.length > 0) 
    {
      this._file = event.target.files[0]
      this.fileName = this._file.name

    }
  }

  onFileSelectedCarrousel(event){
    if(event.target.files.length > 0) 
    {
      this._fileImgCarrousel = event.target.files[0]
      this.urlImageCarrousel = this._fileImgCarrousel.name

    }
  }
  

  getDataNew(index){

   


    this._newsService.getAllnews().subscribe(
      (response) => {                           
       
        
    
        this.NewsForm = new FormGroup({
          Titulo: new FormControl(response.Noticias[index].Titulo),
          Bajada: new FormControl(response.Noticias[index].Bajada),
          Entradilla: new FormControl(response.Noticias[index].Entradilla),
          Cuerpo: new FormControl(response.Noticias[index].Cuerpo),
          Imagen: new FormControl(response.Noticias[index].Imagen),
          _ID: new FormControl(response.Noticias[index]._id)
        });

        this.fileName = response.Noticias[index].Imagen
        

      },
      (error) => {                            
      }
    )
  }

  updateNews(){
    var News = this.NewsForm.value

    if(News.Titulo.length > 0 && News.Bajada.length > 0 && News.Entradilla.length > 0 && News.Cuerpo.length > 0){
      const UpdateNewsData: FormData = new FormData();
      
    
      UpdateNewsData.append('Titulo',News.Titulo); 
      UpdateNewsData.append('Bajada',News.Bajada); 
      UpdateNewsData.append('Entradilla',News.Entradilla);
      UpdateNewsData.append('Cuerpo',News.Cuerpo); 
      if(this._file){
        UpdateNewsData.append('Imagen',this._file);      
        this._newsService.updateNews(UpdateNewsData,News._ID).subscribe(
          (res)=>{
            console.log(res)
            window.location.reload();
          }
        )

      }else{
        //No se actualiza la imagen
        UpdateNewsData.append('Imagen',News.Imagen);
        this._newsService.updateNews(UpdateNewsData,News._ID).subscribe(
          (res)=>{
            console.log(res)
            this.isAlertOnErr = false
            this.isAlertOnSucc = true
            this.messageForm = 'Noticia Actualizada con Éxito'
            window.location.reload();



          }

        )

      }
      
      
    
    }else{
      this.isAlertOnErr = true
      this.isAlertOnSucc = false
      this.messageForm = "Falta LLenar un Campo"
    }

  }

      deleteNews(){

        var News = this.NewsForm.value
        

        this._newsService.deleteNews(News._ID).subscribe(
          (res)=>{
            console.log(res)
            this.isAlertOnErr = false
            this.isAlertOnSucc = true
            this.messageForm = 'Noticia Eliminada con Éxito'
            window.location.reload();
            
          }
        )
        }

        ChangeCarrouselMenu(NumberCarrousel){
        

          if(NumberCarrousel=='Carrusel 1'){
            
            this.CarrouselSelected = 0

            this.TittleNumberCarrousel = 'Carrusel 1'

        
          this.urlImageCarrousel = this.carrouselData[0].ImagenCarrousel
          this.idCarrouselSelect =  this.carrouselData[0]._id

      
            this.CarrouselForm = new FormGroup({
            NumeroCarrousel: new FormControl(this.carrouselData[0].NumeroCarrousel),
            TituloCarrousel: new FormControl(this.carrouselData[0].TituloCarrousel),
            CuerpoCarrousel: new FormControl(this.carrouselData[0].CuerpoCarrousel),
            ImagenCarrousel: new FormControl()
            });

            
          }

          if(NumberCarrousel=='Carrusel 2'){
            this.CarrouselSelected = 1
            this.TittleNumberCarrousel = 'Carrusel 2'

          this.urlImageCarrousel = this.carrouselData[1].ImagenCarrousel
          this.idCarrouselSelect =  this.carrouselData[1]._id
      
            this.CarrouselForm = new FormGroup({
            NumeroCarrousel: new FormControl(this.carrouselData[1].NumeroCarrousel),
            TituloCarrousel: new FormControl(this.carrouselData[1].TituloCarrousel),
            CuerpoCarrousel: new FormControl(this.carrouselData[1].CuerpoCarrousel),
            ImagenCarrousel: new FormControl()
            }); 

        
          }

          if(NumberCarrousel=='Carrusel 3'){
            this.CarrouselSelected = 2
            this.TittleNumberCarrousel = 'Carrusel 3'

          this.urlImageCarrousel = this.carrouselData[2].ImagenCarrousel
          this.idCarrouselSelect =  this.carrouselData[2]._id
      
            this.CarrouselForm = new FormGroup({
            NumeroCarrousel: new FormControl(this.carrouselData[2].NumeroCarrousel),
            TituloCarrousel: new FormControl(this.carrouselData[2].TituloCarrousel),
            CuerpoCarrousel: new FormControl(this.carrouselData[2].CuerpoCarrousel),
            ImagenCarrousel: new FormControl()
            });
         
          }

        }

        updateCarrousel(NumberCarrousel){

         
          console.log("carousel", NumberCarrousel)

          this.CarrouselForm.value.NumeroCarrousel = this.TittleNumberCarrousel
          
          
          
          const CarrouselData: FormData = new FormData();
          let imageCarrousel
          let isUpdateImage

          CarrouselData.append('_id',this.idCarrouselSelect.$oid);
          CarrouselData.append('NumeroCarrousel',this.CarrouselForm.value.NumeroCarrousel); 
          CarrouselData.append('TituloCarrousel',this.CarrouselForm.value.TituloCarrousel); 
          CarrouselData.append('CuerpoCarrousel',this.CarrouselForm.value.CuerpoCarrousel);
          
          
          

          if(this._fileImgCarrousel){
            isUpdateImage = 'True'
            imageCarrousel = this._fileImgCarrousel
            CarrouselData.append('ImagenCarrousel', this._fileImgCarrousel); 
          }else{
            

            if(NumberCarrousel=='Carrusel 1'){
                isUpdateImage = 'False'
                imageCarrousel = this.carrouselData[0].ImagenCarrousel
                CarrouselData.append('ImagenCarrousel', this.carrouselData[0].ImagenCarrousel);
            }

             if(NumberCarrousel=='Carrusel 2'){
              isUpdateImage = 'False'
              imageCarrousel=this.carrouselData[1].ImagenCarrousel
              CarrouselData.append('ImagenCarrousel', this.carrouselData[1].ImagenCarrousel);
            }

             if(NumberCarrousel=='Carrusel 3'){
              isUpdateImage = 'False'
              imageCarrousel= this.carrouselData[2].ImagenCarrousel
              CarrouselData.append('ImagenCarrousel', this.carrouselData[2].ImagenCarrousel);
            }
          }
          
          
  
        if(this.CarrouselForm.value.NumeroCarrousel && 
          this.CarrouselForm.value.TituloCarrousel && 
          this.CarrouselForm.value.CuerpoCarrousel && 
          imageCarrousel
          ){

            this._carrouselService.updateCarrouselData(CarrouselData,isUpdateImage).subscribe(
              (req)=>{
                
                console.log("respuesta",req)
                window.location.reload();
              }
            ) 

        }else{
          this.isAlertCarrouselOn = true
          console.log("falta un campo")
          this.alertMessageCarrousel = "Falta Llenar un Campo"
        }
  
    
         

        }

        pageChanged(event){
          this.config.currentPage = event;
        }
        
  
      
}


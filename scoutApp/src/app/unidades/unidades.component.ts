import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { UnidadesService } from '../mantenimiento/services/unidades.service'
import { Unidad, unidad,ElementImageFile} from '../mantenimiento/models/unidades'
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';  // RxJS 6 syntax

@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.css'],
  providers: [UnidadesService]
})
export class UnidadesComponent implements OnInit {
  rama: string;
  _file;
  fileName;
  isAlertOnSucc: boolean;
  isAlertOnErr: boolean;
  messageForm: string;
  dataForm = new FormGroup({
    Unidad: new FormControl(''),
    Field: new FormControl(''),
    Titulo: new FormControl(''),
    Texto: new FormControl('')
  });
  element
  isDeveloperModeOn: boolean
  unidad: Unidad
  _idRama
  dataWithoutImage: Array<unidad>
  imageFile: Blob
  urlsImages: Array<object>
  
  urlImagenCarrusel1
  urlImagenCarrusel2
  urlImagenCarrusel3
  urlImagenCircular1
  urlImagenCircular2
  urlImagenCircular3
  urlImagenRectangulo1
  urlImagenRectangulo2
  urlImagenRectangulo3
  urlImagenRectangulo4
  urlImagenRectangulo5
  urlImagenRectangulo6

  TituloCarrusel1: string
  TituloCarrusel2: string
  TituloCarrusel3: string
  TituloCircular1: string
  TituloCircular2: string
  TituloCircular3: string
  TituloRectangulo1: string
  TituloRectangulo2: string
  TituloRectangulo3: string
  TituloRectangulo4: string
  TituloRectangulo5: string
  TituloRectangulo6: string

  TextoCarrusel1 : string
  TextoCarrusel2 : string
  TextoCarrusel3 : string
  TextoCircular1 : string
  TextoCircular2 : string
  TextoCircular3 : string
  TextoRectangulo1 : string
  TextoRectangulo2 : string
  TextoRectangulo3 : string
  TextoRectangulo4 : string
  TextoRectangulo5 : string
  TextoRectangulo6 : string

  ShowImageCarrusel1 : boolean = false
  ShowImageCarrusel2 : boolean = false
  ShowImageCarrusel3 : boolean = false
  ShowImageCircular1 : boolean = false
  ShowImageCircular2 : boolean = false
  ShowImageCircular3 : boolean = false
  ShowImageRectangulo1 : boolean = false
  ShowImageRectangulo2 : boolean = false
  ShowImageRectangulo3 : boolean = false
  ShowImageRectangulo4 : boolean = false
  ShowImageRectangulo5 : boolean = false
  ShowImageRectangulo6 : boolean = false

  TituloRectangulo1Parte1: string
  TituloRectangulo1Parte2: string
  TituloRectangulo2Parte1: string
  TituloRectangulo2Parte2: string
  TituloRectangulo3Parte1: string
  TituloRectangulo3Parte2: string
  TituloRectangulo4Parte1: string
  TituloRectangulo4Parte2: string
  TituloRectangulo5Parte1: string
  TituloRectangulo5Parte2: string
  TituloRectangulo6Parte1: string
  TituloRectangulo6Parte2: string

  multipleRequest: Array<object>;
  imagesUnidades: Array<ElementImageFile>

  constructor(
    private modalService: NgbModal,
    private _unidadesService: UnidadesService,
    private sanitizer : DomSanitizer
  ) { }

  @Input() childMessage: string;
  public url1carrusel = "../../assets/img/TropaAillarehue/Carrusel/1.jpg"


  ngOnInit(): void {
    this.rama = this.childMessage
    

    if (localStorage.getItem('isLogin') == "true") {
      console.log("modo desarrollador")
      this.isDeveloperModeOn = true

    } else {
      console.log("modo no desarrollador")
      this.isDeveloperModeOn = false
    }

    this._unidadesService.getDataPage(this.rama).subscribe(
      (res) => {

        this.unidad = res
       
        this._idRama = this.unidad._id

        this._unidadesService.getElementsPage(this._idRama).subscribe(
          (res) => {

            this.dataWithoutImage = res.DataRama

            

            this.urlsImages = []
            this.multipleRequest = []
            this.imagesUnidades = []

            for (var i = 0; i < this.dataWithoutImage.length; i++) {
                
                this.multipleRequest.push(this._unidadesService.getImageElementsperPage(this.dataWithoutImage[i]._id))
    
            }

             forkJoin(this.multipleRequest).subscribe((res)=>{
                
              for (var i = 0; i < this.dataWithoutImage.length; i++) {
                  this.imagesUnidades.push(res[i])
              }

              for (var i = 0; i < this.dataWithoutImage.length; i++) {
                let urlImage = window.URL.createObjectURL(this.imagesUnidades[i].body);
                this.urlsImages.push(this.sanitizer.bypassSecurityTrustUrl(urlImage))
              }
              
             })

            setTimeout(() => {
              

              for (var i = 0; i < this.dataWithoutImage.length; i++) {
              
                

                if(this.dataWithoutImage[i].Field == "Carrusel1"){
                  
                  this.urlImagenCarrusel1 = this.urlsImages[i]
                  this.TituloCarrusel1 = this.dataWithoutImage[i].Titulo
                  this.TextoCarrusel1 = this.dataWithoutImage[i].Texto
                  
                 
                }
  
                if(this.dataWithoutImage[i].Field == "Carrusel2"){
                  this.urlImagenCarrusel2 = this.urlsImages[i]
                  this.TituloCarrusel2 = this.dataWithoutImage[i].Titulo
                  this.TextoCarrusel2 = this.dataWithoutImage[i].Texto
                }
  
                if(this.dataWithoutImage[i].Field == "Carrusel3"){
                  this.urlImagenCarrusel3 = this.urlsImages[i]
                  this.TituloCarrusel3 = this.dataWithoutImage[i].Titulo
                  this.TextoCarrusel3 = this.dataWithoutImage[i].Texto
                                     
                }
  
                
                if(this.dataWithoutImage[i].Field == "Circular1"){
                  this.urlImagenCircular1 = this.urlsImages[i]
                  this.TituloCircular1 = this.dataWithoutImage[i].Titulo
                  this.TextoCircular1 = this.dataWithoutImage[i].Texto
                  this.ShowImageCircular1 = true
                }
  
                if(this.dataWithoutImage[i].Field == "Circular2"){
                  this.urlImagenCircular2 = this.urlsImages[i]
                  this.TituloCircular2 = this.dataWithoutImage[i].Titulo
                  this.TextoCircular2 = this.dataWithoutImage[i].Texto
                  this.ShowImageCircular2 = true
                }
  
                if(this.dataWithoutImage[i].Field == "Circular3"){
                  this.urlImagenCircular3 = this.urlsImages[i]
                  this.TituloCircular3 = this.dataWithoutImage[i].Titulo
                  this.TextoCircular3 = this.dataWithoutImage[i].Texto
                  this.ShowImageCircular3 = true
                }
  
                if(this.dataWithoutImage[i].Field == "Rectangulo1"){
                  this.urlImagenRectangulo1 = this.urlsImages[i]
                 
                  this.TituloRectangulo1 = this.dataWithoutImage[i].Titulo
                  this.TextoRectangulo1 = this.dataWithoutImage[i].Texto
                  this.ShowImageRectangulo1 = true
                  this.TituloRectangulo1Parte1 = this.splitTittle(this.TituloRectangulo1)[0]
                  this.TituloRectangulo1Parte2 = this.splitTittle(this.TituloRectangulo1)[1]
                }
  
                if(this.dataWithoutImage[i].Field == "Rectangulo2"){
                  this.urlImagenRectangulo2 = this.urlsImages[i]
                  this.TituloRectangulo2 = this.dataWithoutImage[i].Titulo
                  this.TextoRectangulo2 = this.dataWithoutImage[i].Texto
                  this.ShowImageRectangulo2 = true
                  this.TituloRectangulo2Parte1 = this.splitTittle(this.TituloRectangulo2)[0]
                  this.TituloRectangulo2Parte2 = this.splitTittle(this.TituloRectangulo2)[1]
                }
  
                if(this.dataWithoutImage[i].Field == "Rectangulo3"){
                  this.urlImagenRectangulo3 = this.urlsImages[i]
                  this.TituloRectangulo3 = this.dataWithoutImage[i].Titulo
                  this.TextoRectangulo3 = this.dataWithoutImage[i].Texto
                  this.ShowImageRectangulo3 = true
                  this.TituloRectangulo3Parte1 = this.splitTittle(this.TituloRectangulo3)[0]
                  this.TituloRectangulo3Parte2 = this.splitTittle(this.TituloRectangulo3)[1]
                }
  
                if(this.dataWithoutImage[i].Field == "Rectangulo4"){
                  this.urlImagenRectangulo4 = this.urlsImages[i]
                  this.TituloRectangulo4 = this.dataWithoutImage[i].Titulo
                  this.TextoRectangulo4 = this.dataWithoutImage[i].Texto
                  this.ShowImageRectangulo4 = true
                  this.TituloRectangulo4Parte1 = this.splitTittle(this.TituloRectangulo4)[0]
                  this.TituloRectangulo4Parte2 = this.splitTittle(this.TituloRectangulo4)[1]
                }
  
                if(this.dataWithoutImage[i].Field == "Rectangulo5"){
                  this.urlImagenRectangulo5 = this.urlsImages[i]
                  this.TituloRectangulo5 = this.dataWithoutImage[i].Titulo
                  this.TextoRectangulo5 = this.dataWithoutImage[i].Texto
                  this.ShowImageRectangulo5 = true
                  this.TituloRectangulo5Parte1 = this.splitTittle(this.TituloRectangulo5)[0]
                  this.TituloRectangulo5Parte2 = this.splitTittle(this.TituloRectangulo5)[1]
                }
  
                if(this.dataWithoutImage[i].Field == "Rectangulo6"){
                  this.urlImagenRectangulo6 = this.urlsImages[i]
                  this.TituloRectangulo6 = this.dataWithoutImage[i].Titulo
                  this.TextoRectangulo6 = this.dataWithoutImage[i].Texto
                  this.ShowImageRectangulo6 = true
                  this.TituloRectangulo6Parte1 = this.splitTittle(this.TituloRectangulo6)[0]
                  this.TituloRectangulo6Parte2 = this.splitTittle(this.TituloRectangulo6)[1]
                }
    
    
             }
            }, 1500);

            
      
          },
          (err) => {

          })

      },
      (err) => {

      })


  }

  open(content, element) {


    this.element = element

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      

    }, (reason) => {

     this.getDismissReason(reason)

    });
  }

  private getDismissReason(reason: any): string {

    this.isAlertOnErr = false
    this.isAlertOnSucc = false
    this.fileName = null
    this.dataForm = new FormGroup({
      Unidad: new FormControl(this.rama),
      Field: new FormControl(''),
      Titulo: new FormControl(''),
      Texto: new FormControl('')
    });

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this._file = event.target.files[0]
      this.fileName = this._file.name

    }
  }

  UpdateOrAddData() {

    let data = this.dataForm.value



    data.Unidad = this.rama
    data.Field = this.element



    if (this._file && data.Titulo.length > 0 && data.Texto.length > 0) {

    


      const Data: FormData = new FormData();

      Data.append('Unidad', data.Unidad);
      Data.append('Field', data.Field);
      Data.append('Titulo', data.Titulo);
      Data.append('Texto', data.Texto);
      Data.append('ImageFile', this._file);



      this._unidadesService.AddData(Data, this._idRama).subscribe(
        (res) => {
          
          window.location.reload();
        },
        (err) => {

        })


    } else {
      this.isAlertOnErr = true
      this.isAlertOnSucc = false
      this.messageForm = "Falta LLenar un Campo"
    }

  }

  splitTittle(tittle){

    var Tittle_1 = ""
    var Tittle_2 = "" 
    var Tittle = []

    Tittle = tittle.split(".")

    for(var i = 0; i < Tittle.length; i++){
    
      if (i==0){
        Tittle_1=Tittle[i]
      }else{
        Tittle_2 += Tittle[i]
      }
    }

    Tittle = []

    Tittle.push(Tittle_1)
    Tittle.push(Tittle_2)
   
   return Tittle

  }
 
}

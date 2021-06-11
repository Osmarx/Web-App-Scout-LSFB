import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapsData, MapHtml } from '../mantenimiento/models/maps'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CampsService} from '../mantenimiento/services/camps.service'
import { Camp} from '../mantenimiento/models/maps'

@Component({
  selector: 'app-campamentos',
  templateUrl: './campamentos.component.html',
  styleUrls: ['./campamentos.component.css'],
  providers: [CampsService]
})
export class CampamentosComponent implements OnInit {

  @ViewChild('map') elementMapHtml: MapHtml

  title = 'Campamentos y Eventos';

  lat: Number = 33.0;
  long: Number = 73.0;
  zoom = 7;
  label: string
  isAdminMode: boolean;
  PositionData: MapsData;
  markers: Array<MapsData> = [
    {
      lat: 33.0,
      lng: 73.0,
      label: 'asdasd'
    }
  ];

  public messageForm
  public icon = {
    url: '../../assets/img/maps-and-flags.png',
    scaledSize: { width: 45, height: 45, f: 'px', b: 'px', },
  }

  CampamentoForm = new FormGroup({
    Lugar: new FormControl(''),
    Ano: new FormControl(''),
    Longitud: new FormControl(''),
    Latitud: new FormControl(''),
    Estacion: new FormControl('')
  });
  isAlertOnSucc: boolean
  isAlertOnErr: boolean
  allCamps: Array<Camp> = []
  config: any;

  constructor(
    private modalService: NgbModal,
    private campsService: CampsService
  ) {
    this.config = {
      itemsPerPage: 3,
      currentPage: 1,
      totalItems: 0
    };
  }

  ngOnInit(): void {

    this.campsService.getAllsCamps().subscribe((res)=>{
      
      this.allCamps = res.CampsData

      this.config = {
        itemsPerPage: 3,
        currentPage: 1,
        totalItems: this.allCamps.length
      };
    
     
      
      this.allCamps = this.allCamps.sort((a,b) => {
        if(a.Ano>b.Ano){
          return 1
        }

        if(a.Ano<b.Ano){
          return -1
        }

        /* return 0 */
        
        if(a.Ano==b.Ano){
      
          if(a.Estacion>b.Estacion){
            return 1
          }
  
          if(a.Estacion<b.Estacion){
            return -1
          }

         
        }
        
      })

   



 

    })



    this.markers

    if (localStorage.getItem('isLogin') == "true") {
      this.isAdminMode = true

    } else {
      this.isAdminMode = false
    }

  }

  public onMapReady(map) {

    map.addListener('click', (e) => {



      var Zoom = this.elementMapHtml.zoom

      map.setZoom(Zoom);

      var position = e



      this.lat = e.latLng.lat();
      this.long = e.latLng.lng(),
        this.label = ""




      this.PositionData = {

        lat: this.lat,
        lng: this.long,
        label: 'prueba'

      }

    });
  }

  open(content) {

    this.CampamentoForm = new FormGroup({
      Lugar: new FormControl(''),
      Ano: new FormControl(''),
      Longitud: new FormControl({ value: this.long.toFixed(2), disabled: true }),
      Latitud: new FormControl({ value: this.lat.toFixed(2), disabled: true }),
      Estacion: new FormControl('')
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {


    }, (reason) => {

      this.getDismissReason(reason)

    });
  }

  private getDismissReason(reason: any): string {

    this.isAlertOnErr = false
    this.isAlertOnSucc = false

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  SendDataCampamento() {
    
   

    this.CampamentoForm.value.Latitud = this.lat
    this.CampamentoForm.value.Longitud = this.long

    var Data = this.CampamentoForm.value



    if (!isNaN(Data.Ano) && Data.Lugar && Data.Longitud && Data.Latitud && Data.Ano && Data.Estacion) {

      
      this.isAlertOnErr = false
      this.isAlertOnSucc = true
      this.messageForm = "Subido con éxito"
      
      this.campsService.AddCamps(Data).subscribe((res)=>{
   
        window.location.reload();
      })


    } else {
      this.isAlertOnErr = true
      this.isAlertOnSucc = false
      
      if(isNaN(Data.Ano)){
        this.messageForm = "Ingrese un número en el campo año"
      }else{
        this.messageForm = "Falta ingresar un campo"
      }
      

    }

  }

  deleteCamp(_id){

  
    this.campsService.deleteCamp(_id).subscribe((res)=>{

      window.location.reload();

    })

  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

}

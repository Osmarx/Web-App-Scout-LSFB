
import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FilesService} from '../mantenimiento/services/files.service'
import {FileData} from '../mantenimiento/models/files'
import * as fileSaver from 'file-saver';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-circulares',
  templateUrl: './circulares.component.html',
  styleUrls: ['./circulares.component.css'],
  providers: [FilesService]
})
export class CircularesComponent implements OnInit {

 
  constructor(
    
    private modalService: NgbModal,
    private _filesService: FilesService,
    

    ) {
      this.config = {
        itemsPerPage: 6,
        currentPage: 1,
        totalItems: 0
      };
    }
  


  Uploadpath: string;
  closeResult: string;
  element: HTMLElement;
  _file
  serverMessageSucc: string;
  serverMessageErr: string;
  hiddenAdminButton: boolean;
  FilesReq: Array<FileData>;
  isopenDeleteButtons= false;
  DescriptionForm = new FormGroup({
    Descripcion: new FormControl('')
  })
  config: any

  ngOnInit(): void {

    this._filesService.getFiles().subscribe(
      (response) => {
        
       
        this.FilesReq = response.body.Archivos
     

        this.config = {
          itemsPerPage: 6,
          currentPage: 1,
          totalItems: this.FilesReq.length
        };
        
      },
      (error)=>{
        
      }
    )
    

    if(localStorage.getItem('isLogin')=="true"){
      this.hiddenAdminButton = true
    }else{
      this.hiddenAdminButton = false
    }
  }

  name = 'Angular';
  
  openFile(){
    this.isopenDeleteButtons = false
    this.serverMessageSucc = null
    this.serverMessageErr = null
    document.querySelector('input').click()
  }
  handle(event){
   
    this.Uploadpath = event.target.value
 
    this._file = event.target.files[0]


    this.element = document.getElementById("hidden-button-open-modal") as HTMLElement;
    this.element.click()
    
    
  }

  open(content) {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      
      
      this.closeResult = this.Uploadpath

      const formData: FormData = new FormData();

      

      formData.append('file',this._file);
      formData.append('Descripcion',this.DescriptionForm.value.Descripcion);
      
      this._filesService.UploadFile(formData).subscribe(
        (response) => {
          
          this.serverMessageSucc = 'Archivo Subido al Servidor' 
          window.location.reload();
        },
        (error)=>{
          this.serverMessageErr = 'Error al subir el Archivo, vuelva a intentar' 
        }
      )

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  DownloadFile(File){


    this._filesService.DownloadFiles(File._id).subscribe(
      (response) => {
        
        
        let blob:any = new Blob([response.body], { type: 'charset=utf-8' });

        
       

        const url = window.URL.createObjectURL(blob);

        

         fileSaver.saveAs(blob, File.Nombre); 

      },
      (error)=>{
        
      }
    )

  }

  openDeleteButtons(){
    this.isopenDeleteButtons = true
  }

  deleteFiles(FileData){
    this._filesService.deleteFiles(FileData).subscribe(
      (req)=>{
        
        window.location.reload();
      }
    )

      

    
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }



}

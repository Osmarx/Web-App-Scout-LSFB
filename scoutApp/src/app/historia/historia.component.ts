import { Component, OnInit} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { HistoryService } from '../mantenimiento/services/history.service'
import { HistoryData } from '../mantenimiento/models/history'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-historia',
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.css'],
  providers: [HistoryService]
})
export class HistoriaComponent implements OnInit {


  constructor(
    private modalService: NgbModal,
    private _historyService: HistoryService,
    private sanitizer: DomSanitizer
    

  ) { }

  fileName
  _file
  element: string
  HistoryForm = new FormGroup({
    Titulo: new FormControl(''),
    Texto: new FormControl('')
  });
  isAlertOnErr: boolean
  isAlertOnSucc: boolean
  messageForm
  isInputImageOn: boolean = true
  historyData: Array<HistoryData>
  selectElementforChange: HistoryData

  JumbotronData: HistoryData
  OnlyText1Data: HistoryData
  OnlyText2Data: HistoryData
  OnlyText3Data: HistoryData
  OnlyTextData: HistoryData

  JumbotronUrl;
  JumbotronTitulo;
  JumbotronTexto;

  OnlyText1Titulo;
  OnlyText1Texto;

  OnlyText2Titulo;
  OnlyText2Texto;

  OnlyText3Titulo;
  OnlyText3Texto;

  bgImage;

  hiddenAdminButton: boolean


  ngOnInit(): void {
    this.isAlertOnErr = false
    this.isAlertOnSucc = false

    if(localStorage.getItem('isLogin')=="true"){
      this.hiddenAdminButton = true
    }else{
      this.hiddenAdminButton = false
    }


    this._historyService.getHistoryData().subscribe((res) => {

      this.historyData = res.Data

      for (var i = 0; i < this.historyData.length; i++) {

        if (this.historyData[i].Elemento == 'Jumbotron') {

          this.JumbotronData = this.historyData[i]


          this._historyService.getHistoryImage(this.JumbotronData._id)
            .subscribe((res) => {

              console.log(res)

              let urlImage = window.URL.createObjectURL(res.body)
              let urlSanitizer = this.sanitizer.bypassSecurityTrustUrl(urlImage)

              this.JumbotronUrl = urlSanitizer 
              this.JumbotronTitulo = this.JumbotronData.Titulo
              this.JumbotronTexto = this.JumbotronData.Texto

           
              
            this.bgImage = { 
              
            'background-image': 'url('+this.JumbotronUrl.changingThisBreaksApplicationSecurity+')',

            }

            

             
            
              
            
              
            })

        }

        if (this.historyData[i].Elemento == 'OnlyText1') {
          this.OnlyText1Data = this.historyData[i]

          this.OnlyText1Titulo = this.OnlyText1Data.Titulo
          this.OnlyText1Texto = this.OnlyText1Data.Texto

          console.log(this.OnlyText1Data)

        }

        if (this.historyData[i].Elemento == 'OnlyText2') {
          this.OnlyText2Data = this.historyData[i]

          this.OnlyText2Titulo = this.OnlyText2Data.Titulo
          this.OnlyText2Texto = this.OnlyText2Data.Texto

          console.log(this.OnlyText2Data)

        }

        if (this.historyData[i].Elemento == 'OnlyText3') {
          this.OnlyText3Data = this.historyData[i]

          this.OnlyText3Titulo = this.OnlyText3Data.Titulo
          this.OnlyText3Texto = this.OnlyText3Data.Texto

          console.log(this.OnlyText3Data)

        }
      }


    })
  }

  open(content, element) {

    this.element = element

    if (element == 'OnlyText1' || element == 'OnlyText2' || element == 'OnlyText3') {
      this.isInputImageOn = false
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(result)

    }, (reason) => {

      console.log(`Dismissed ${this.getDismissReason(reason)}`);

    });
  }

  private getDismissReason(reason: any): string {

    this.isInputImageOn = true
    this.HistoryForm = new FormGroup({
      Titulo: new FormControl(''),
      Texto: new FormControl('')
    });
    this.isAlertOnErr = false
    this.isAlertOnSucc = false
    this._file = null

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
      console.log(this._file)
    }
  }

  UpdateOrAddData() {


    var data = this.HistoryForm.value

    console.log(this.element == 'Jumbotron' && this._file && data.Titulo.length > 0 && data.Texto.length > 0)

    if (this.element == 'Jumbotron' && this._file && data.Titulo.length > 0 && data.Texto.length > 0) {


      const Data: FormData = new FormData();

      Data.append('Elemento', this.element)
      Data.append('Titulo', data.Titulo);
      Data.append('Texto', data.Texto);
      Data.append('Imagen', this._file);

      this.isAlertOnErr = false
      this.isAlertOnSucc = true
      this.messageForm = "Subido Con Éxito"

      var Id = this.JumbotronData._id

      this._historyService.AddHistoryData(Id, Data).subscribe((res) => {
        console.log(res)
        window.location.reload();
      })




    } else {

      if ((this.element == 'OnlyText1' || this.element == 'OnlyText2' || this.element == 'OnlyText3') && data.Titulo.length > 0 && data.Texto.length > 0) {



        if (this.element == 'OnlyText1') {
          this.OnlyTextData = this.OnlyText1Data

        }

        if (this.element == 'OnlyText2') {
          this.OnlyTextData = this.OnlyText2Data
        }

        if (this.element == 'OnlyText3') {
          this.OnlyTextData = this.OnlyText3Data
        }

        var Id = this.OnlyTextData._id

        const Data: FormData = new FormData();

        Data.append('Elemento', this.element);
        Data.append('Titulo', data.Titulo);
        Data.append('Texto', data.Texto);
        Data.append('Image', null);

        this._historyService.AddHistoryData(Id, Data).subscribe((res) => {
          console.log(res)
          window.location.reload();

        })

        this.isAlertOnErr = false
        this.isAlertOnSucc = true
        this.messageForm = "Subido Con Éxito"
       


      } else {
        this.isAlertOnSucc = false
        this.isAlertOnErr = true
        this.messageForm = "Falta llenar un campo"
      }

    }


  }


}

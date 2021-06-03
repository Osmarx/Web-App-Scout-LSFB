import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { UnidadesService } from '../mantenimiento/services/unidades.service'
import { Unidad, unidad } from '../mantenimiento/models/unidades'
import { DomSanitizer } from '@angular/platform-browser';

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
  dataToShow: object
  dataWithoutImage: Array<unidad>
  imageFile: Blob
  urlsImages: Array<object>



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
        console.log(this.unidad)
        this._idRama = this.unidad._id

        this._unidadesService.getElementsPage(this._idRama).subscribe(
          (res) => {

            this.dataWithoutImage = res.DataRama

            console.log(this.dataWithoutImage)

            this.urlsImages = []

            for (var i = 0; i < this.dataWithoutImage.length; i++) {
            
              this._unidadesService.getImageElementsperPage(this.dataWithoutImage[i]._id).subscribe(
                (res) => {
                  
                  let urlImage = window.URL.createObjectURL(res.body);
                  
                  this.urlsImages.push(this.sanitizer.bypassSecurityTrustUrl(urlImage))


                },
                (err) => {


                }
              )
            }

            console.log(this.urlsImages)
            console.log(this.dataWithoutImage)


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
      console.log(result)

    }, (reason) => {

      console.log(`Dismissed ${this.getDismissReason(reason)}`);

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

      console.log(data)


      const Data: FormData = new FormData();

      Data.append('Unidad', data.Unidad);
      Data.append('Field', data.Field);
      Data.append('Titulo', data.Titulo);
      Data.append('Texto', data.Texto);
      Data.append('ImageFile', this._file);



      this._unidadesService.AddData(Data, this._idRama).subscribe(
        (res) => {
          console.log(res)
        },
        (err) => {

        })


    } else {
      this.isAlertOnErr = true
      this.isAlertOnSucc = false
      this.messageForm = "Falta LLenar un Campo"
    }

  }

}

import { Component, OnInit,Input} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  
  title = 'scoutApp';
  isShown = false;
  showLogOutButton: boolean;
  DeveloperWindowOff: string;

  closeResult: string;


  constructor(private modalService: NgbModal) { }
  
  @Input() childMessage: string;

  ngOnInit(): void {
    //console.log(localStorage.getItem('isLogin'))
    if(localStorage.getItem('isLogin')=="true"){
      this.showLogOutButton = true
      JSON.parse(localStorage.getItem('Data User'))
    }else{
        this.showLogOutButton = false
        console.log((localStorage.getItem('Data User')))
    }
    
  }

  logOut(){
    this.showLogOutButton = false
    localStorage.setItem('isLogin', String(this.showLogOutButton))
    window.location.reload();
    localStorage.setItem('Data User','Usted no esta logeado')
    localStorage.setItem('Token','')   
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if(result="LogOut"){
        this.logOut()
      }

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
  


}

import { Component, ViewEncapsulation, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TokenService } from './mantenimiento/services/token.service'
import { Token} from './mantenimiento/models/token'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [TokenService]
})


export class AppComponent {
  title = 'scoutApp';


  name = 'Get Current Url Route Demo';
  currentRoute: string;
  rama
  isDeveloperModeOn
  token: Token

  constructor(private router: Router,
    private elementRef: ElementRef,
    private tokenService: TokenService
  ) {

    if (localStorage.getItem('isLogin') == "true") {

      var DataUser = JSON.parse(localStorage.getItem('Data User'))
      this.tokenService.getToken(DataUser).subscribe((res) => {
              this.token = res.body
              localStorage.setItem('Token',this.token.access_token)
      })
    }else{
        localStorage.setItem('Token','')
    }

    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.rama = e.url

        console.log(this.rama)

        if (this.rama == '/melen-lemu') {
          this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = ' #1a2d57';
        }

        if (this.rama == '/pies-sigilosos') {
          this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#e6a61d';
        }


        if (this.rama == '/cielo-austral') {
          this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#2CA8FF';
        }

        if (this.rama == '/aillarehue') {
          this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#30b570';
        }

        if (this.rama == '/amuillan') {
          this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#8557D3';
        }


      }
    });


  }



}








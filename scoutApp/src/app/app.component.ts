import { Component, ViewEncapsulation, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class AppComponent {
  title = 'scoutApp';


  name = 'Get Current Url Route Demo';
  currentRoute: string;
  rama
  isDeveloperModeOn


  constructor(private router: Router, private elementRef: ElementRef) {

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








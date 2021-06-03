import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-cielo-austral',
  templateUrl: './cielo-austral.component.html',
  styleUrls: ['./cielo-austral.component.css']
})
export class CieloAustralComponent implements OnInit {

  constructor() { }
  nombre = "Compañía Cielo Austral"
  ngOnInit(): void {
  }

}

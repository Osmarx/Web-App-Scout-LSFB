import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-campamentos',
  templateUrl: './campamentos.component.html',
  styleUrls: ['./campamentos.component.css']
})
export class CampamentosComponent implements OnInit {


  title = 'Campamentos y Eventos';
  lat = 51.678418;
  lng = 7.809007;
  


  constructor() { }

  ngOnInit(): void {
  }

}

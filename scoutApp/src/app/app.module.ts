import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { MalenLemuComponent } from './malen-lemu/malen-lemu.component';
import { PiesSigilososComponent } from './pies-sigilosos/pies-sigilosos.component';
import { CieloAustralComponent } from './cielo-austral/cielo-austral.component';
import { AillarehueComponent } from './aillarehue/aillarehue.component';
import { AmuillanComponent } from './amuillan/amuillan.component';
import { UnidadesComponent } from './unidades/unidades.component';
import { HistoriaComponent } from './historia/historia.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './mantenimiento/login/login.component';

import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { CircularesComponent } from './circulares/circulares.component';
import { CampamentosComponent } from './campamentos/campamentos.component';

import { AgmCoreModule } from '@agm/core';
import { NoticiaComponent } from './noticia/noticia.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {NgxPaginationModule} from 'ngx-pagination';
import { HeaderComponent } from './header/header.component'





@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MalenLemuComponent,
    PiesSigilososComponent,
    CieloAustralComponent,
    AillarehueComponent,
    AmuillanComponent,
    UnidadesComponent,
    HistoriaComponent,
    FooterComponent,
    LoginComponent,
    CircularesComponent,
    CampamentosComponent,
    NoticiaComponent,
    NavbarComponent,
    HeaderComponent

    
     
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBsefA13zxjmwtshlUCAg3Alty7cZpdbEs'
    }),
    NgbModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

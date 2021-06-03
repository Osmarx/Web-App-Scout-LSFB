import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MalenLemuComponent } from './malen-lemu/malen-lemu.component';
import { PiesSigilososComponent } from './pies-sigilosos/pies-sigilosos.component';
import { CieloAustralComponent} from './cielo-austral/cielo-austral.component';
import { AillarehueComponent } from './aillarehue/aillarehue.component';
import { AmuillanComponent } from './amuillan/amuillan.component';
import { HistoriaComponent } from './historia/historia.component';
import { LoginComponent } from './mantenimiento/login/login.component';
import { CircularesComponent } from './circulares/circulares.component';
import { CampamentosComponent } from './campamentos/campamentos.component';
import { NoticiaComponent } from './noticia/noticia.component';


const routes: Routes = [
  { path: 'campamentos',  component: CampamentosComponent },
  { path: 'circulares',  component: CircularesComponent },
  { path: 'main',  component: MainComponent},
  { path: 'melen-lemu',  component: MalenLemuComponent },
  { path: 'pies-sigilosos',  component: PiesSigilososComponent },
  { path: 'aillarehue',  component: AillarehueComponent },
  { path: 'cielo-austral',  component: CieloAustralComponent },
  { path: 'amuillan',  component: AmuillanComponent },
  { path: 'historia',  component: HistoriaComponent },
  { path: 'login',  component:LoginComponent },
  { path: 'noticia/:id',  component: NoticiaComponent },
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: '**', component: MainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

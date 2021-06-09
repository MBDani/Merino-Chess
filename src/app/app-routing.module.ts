import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalPlayComponent } from './componentes/ajedrez/local-play/local-play.component';
import { OnlineComponent } from './componentes/ajedrez/online/online.component';
import { PlayerVScomputerComponent } from './componentes/ajedrez/player-vs-computer/player-vs-computer.component';
import { EstiloPiezasComponent } from './componentes/estilo-piezas/estilo-piezas.component';
import { HistorialComponent } from './componentes/historial/historial.component';
import { MenuPrincipalComponent } from './componentes/menu-principal/menu-principal.component';
import { RankingComponent } from './componentes/ranking/ranking.component';
import { AuthGuard } from './guardianes/auth.guard';

const routes: Routes = [
  //{path: '', component:MenuPrincipalComponent}, no necesitamos la ruta por defecto ya que queremos que siempre cargue la del menú al principio
  {path: 'menu', component:MenuPrincipalComponent},
  {path: 'player-computer', component:PlayerVScomputerComponent},
  {path: 'local-play', component:LocalPlayComponent},
  {path: 'online/:id', component:OnlineComponent, canActivate:[AuthGuard]},
  {path: 'ranking', component:RankingComponent, canActivate:[AuthGuard]},
  {path: 'historial', component:HistorialComponent, canActivate:[AuthGuard]},
  {path: 'estiloPiezas', component:EstiloPiezasComponent, canActivate:[AuthGuard]},
  {path: '**', redirectTo: 'menu'} //si la ruta está mal nos redirige al menú




];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //este segundo parámetro viene por defecto 'false'. Esto nos permite recargar la página.
  exports: [RouterModule]
})
export class AppRoutingModule { }

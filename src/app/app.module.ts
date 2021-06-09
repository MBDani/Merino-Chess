import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocalPlayComponent } from './componentes/ajedrez/local-play/local-play.component';
import { PlayerVScomputerComponent } from './componentes/ajedrez/player-vs-computer/player-vs-computer.component';
import { OnlineComponent } from './componentes/ajedrez/online/online.component';
import { CabeceroComponent } from './componentes/cabecero/cabecero.component';
import { MenuPrincipalComponent } from './componentes/menu-principal/menu-principal.component';
import { LoginComponent } from './componentes/auth/login/login.component';
import { RegistroComponent } from './componentes/auth/registro/registro.component';

import {FormsModule} from '@angular/forms';


import { environment } from 'src/environments/environment';
import {AngularFireModule} from '@angular/fire'; //el principal de angular
import {AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore'; /* en versiones anteriores en vez de Settings es FirestoreSettingsToken */
import {AngularFireAuthModule} from '@angular/fire/auth'; //para la autentificación
import { AuthService } from './servicios/auth.service';
import { UsuariosService } from './servicios/usuarios.service';
import { PartidasService } from './servicios/partidas.service';
import { RankingComponent } from './componentes/ranking/ranking.component';
import { HistorialComponent } from './componentes/historial/historial.component';
import { EstiloPiezasComponent } from './componentes/estilo-piezas/estilo-piezas.component';
import { PiePaginaComponent } from './componentes/pie-pagina/pie-pagina.component';
import { AuthGuard } from './guardianes/auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    LocalPlayComponent,
    PlayerVScomputerComponent,
    OnlineComponent,
    CabeceroComponent,
    MenuPrincipalComponent,
    LoginComponent,
    RegistroComponent,
    RankingComponent,
    HistorialComponent,
    EstiloPiezasComponent,
    PiePaginaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    FormsModule,

    AngularFireModule.initializeApp(environment.firestore, 'merino-chess'), //inicializamos las variables de ambiente gracias a este import
    AngularFirestoreModule,
    AngularFireAuthModule

  ],
  providers: [
    AuthService,
    UsuariosService,
    PartidasService,

    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

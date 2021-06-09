import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../modelos/usuario.model';
import { AuthService } from '../../servicios/auth.service';
import { UsuariosService } from '../../servicios/usuarios.service';
import { PartidasService } from '../../servicios/partidas.service';
import { Partidas } from '../../modelos/partidas.model';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss']
})
export class MenuPrincipalComponent implements OnInit {

  isLoggedIn: boolean = false;
  id: string = '';

  paginaActual: string = '/menu';

  //Estilo
  estiloWikipedia: string = 'assets/img/chesspieces/wikipedia/{piece}.png';





  constructor(
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private partidasService: PartidasService,
    private router: Router
  ) { }

  


  ngOnInit(): void {

    //Recargamos la página en caso de que sea necesario para que no se bugue
    this.recargarPagina();

    //Comprobamos si esta logueado
    this.comprobarLogin();

    //En caso de que nunca haya entrado en la app le aportamos un estilo a las piezas
    this.comprobarEstilo();

  }

  /**
   * Este método lo usamos para recargar la página siempre que detectemos que la url del local storage cambió.
   * Lo necesitamos para reiniciar el menú y los componentes ya que el online sino no funcionaba correctamente.
   */
  recargarPagina() {
    let url = localStorage.getItem("url");

    if (url != this.paginaActual) {
      window.location.reload();
      localStorage.setItem("url", this.router.url);
    }

  }

  private comprobarLogin() {
    this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
        this.id = auth.uid;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  private comprobarEstilo() {
    let estiloAlmacenado = localStorage.getItem("estilo");
    if (estiloAlmacenado == null) {
      localStorage.setItem("estilo", this.estiloWikipedia);
    }
  }

  usuario: Usuario;

  /**
   * Le pasamos a la ventana del juego con el ordenador.
   */
  jugarOrdenador() {
    this.router.navigate(['player-computer'])
  }

  /**
   * Le pasamos a la ventana del juego local
   */
  localPlay() {
    this.router.navigate(['local-play'])
  }

  /**
   * Obtenemos los datos del usuario
   */
  jugarOnline() {

    let recuperarDatosDocumento: Subscription = new Subscription();
    recuperarDatosDocumento.add(this.usuariosService.recuperarDatosDocumento(this.id).subscribe(
      campo => {
        recuperarDatosDocumento.unsubscribe();
        this.usuario = campo;
        this.comprobacionPartidas();
      }));
  }



  /**
   * Comprobamos que no tenga ninguna partida en la que este esperando al segundo jugador.
   * Si no la tiene creada llamamos al método para jugar online.
   */
  private comprobacionPartidas() {
    let partidaEncontrada: Partidas[] = [];
    let suscripcionPartidas: Subscription = new Subscription();

    //Validamos que no tenga una partida creada en la que este esperando el segundo jugador
    suscripcionPartidas.add(this.partidasService.validarJuegoOnline(this.usuario.id).subscribe(
      partida => {
        suscripcionPartidas.unsubscribe();
        partidaEncontrada = partida;


        //No tiene partidas asignadas en las que este esperando al segundo jugador
        if (partidaEncontrada.length == 0) {
          this.partidasService.online(this.usuario.id, this.usuario.username);

          //Ya tiene creada una partida en la que está esperando a un jugador.
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ya hay una partida en la que esperas al segundo jugador',
          });

        }
      }
    ));
  }
}

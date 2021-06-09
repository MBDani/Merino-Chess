import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartidasService } from '../../servicios/partidas.service';
import { Partidas } from 'src/app/modelos/partidas.model';
import { AuthService } from '../../servicios/auth.service';
import { Subscription } from 'rxjs';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Usuario } from '../../modelos/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {


  usuario: Usuario;

  id_usuario: string;

  partidas: Partidas[] = []; //array de todas las partidas

  contrincantes: string[] = [];
  turnos: string[] = [];
  

  tuTurno: string = "Te toca";
  turnoRival: string = "Esperando al rival"


  contador:number = 0;


  //Tiempo actual
  dt = new Date();

 


  constructor(
    private router: Router,
    private partidasService: PartidasService,
    private authService: AuthService,
    private usuariosService: UsuariosService
  ) { }


  private suscripcionUsuario: Subscription = new Subscription();


  ngOnInit(): void {
    localStorage.setItem("url", this.router.url); //cambiamos la url en la que nos encontramos

    this.obtenerDatosUsuario();

    //Le tenemos que dar tiempo para que pueda cargar el id del usuario
    setTimeout(() => {

      this.obtenerPartidas();
    }, 1000);



  }


  /**
   * Obtenemos los datos del usuario actual
   */
  obtenerDatosUsuario() {
    //Primero obtenemos el ID
    this.authService.getAuth().subscribe(auth => {
      if (auth) {

        this.id_usuario = auth.uid;

        //A continuación, con el id obtenemos todos los datos del usuario
        this.suscripcionUsuario.add(this.usuariosService.recuperarDatosDocumento(this.id_usuario).subscribe(
          campo => {
            this.suscripcionUsuario.unsubscribe();

            this.usuario = campo; //cogemos el usuario actual
          }
        ));
      }
    });
  }


   /**
   * Obtenemos todos los datos de las partidas.
   * Filtramos hasta solo quedarnos con las que ha jugado el usuario actual.
   */
    private obtenerPartidas() {

  //let suscripcion: Subscription = new Subscription();

     
      this.partidasService.historialJugador().subscribe(
        datos => {
          //suscripcion.unsubscribe();
  
          let partidasObtenidas: Partidas[]  = datos;

          //Reseteamos todos los arrays (este método solo lo necesitamos en caso de que no tengamos la suscripción desactivada)
          this.resetearArrays();
  
          for (let i = 0; i < partidasObtenidas.length; i++) {
  
            //Comprobamos si es el jugador 1 (piezas blancas)
            if (partidasObtenidas[i].id_jugador1 == this.id_usuario) {
              console.log("es el jugador 1")
  
              //Guardamos la partida
              this.partidas[this.contador] = partidasObtenidas[i];
  
              //Obtenemos contrincante
              this.contrincantes[this.contador] = partidasObtenidas[i].username_2;
  
              //Vemos si le toca responder a este jugador 
              if (partidasObtenidas[i].turno == "Turno blancas") {
                this.turnos[this.contador] = this.tuTurno;
              } else {
                this.turnos[this.contador] = this.turnoRival;
              }

              this.contador+=1;

              //Comprobamos si es el jugador 2 (piezas negras)
            } else if (partidasObtenidas[i].id_jugador2 == this.id_usuario) {
              console.log("es el jugador 2")
  
              //Guardamos la partida
              this.partidas[this.contador] = partidasObtenidas[i];
  
              //Obtenemos contrincante
              this.contrincantes[this.contador] = partidasObtenidas[i].username_1;

              //Vemos si le toca responder a este jugador
              if (partidasObtenidas[this.contador].turno == "Turno negras") {
                this.turnos[this.contador] = this.tuTurno;
              } else {
                this.turnos[this.contador] = this.turnoRival;
              }
              this.contador+=1;
            }

            
          }
        }
      );
    }

    /**
     * Reseteamos todos los arrays
     */
  private resetearArrays() {
    //Borramos el array de partidas
    let borradorPartidas: Partidas[] = [];
    this.partidas = borradorPartidas;

    //Borramos el array de turnos
    let borradorTurnos: string[] = [];
    this.turnos = borradorTurnos;

    //Borramos el array de contrincantes
    let borradorContrincantes: string[] = [];
    this.contrincantes = borradorContrincantes;

    //Ponemos a cero el contador
    this.contador = 0;
  }

  /**
   * Método para desplazarnos a la partida al pulsar sobre la columna del enlace.
   * @param id 
   */
  irPartida(id: string) {
    let ruta = "online/" + id;
    this.router.navigate([ruta]);
  }

  /**
   * Mensaje de confirmación y reclamo de la partia junto con los puntos correspondientes al llamar al método de actualizar datos.
   */
  reclamarPartida(id: string) {
    //Primero le ponemos un mensaje de confirmación a la hora de reclamar la partida.
    Swal.fire({
      title: '¿Reclamar partida?',
      text: "Ganarás automáticamente la partida y se sumará +1 a tus victorias.",
      icon: 'question',
      showCancelButton: true,
      reverseButtons: true, //para que cancelar salga a la izquierda

      //Botón de cancelar
      cancelButtonText: 'Esperaré por si contesta.',
      cancelButtonColor: '#d33',

      //Botón de confirmar
      confirmButtonColor: '#3085d6',
      confirmButtonText: '¡Sí, reclamar!'

    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarPartida(id);

        Swal.fire(
          '¡Partida reclamada!',
          'Se han añadido tus puntos.',
          'success'
        );

      }
    })


  }

  /**
   * Actualizamos los datos de la partida y de los jugadores
   */
  actualizarPartida(id: string) {
    let suscripcionReclamarPartida: Subscription = new Subscription();
    suscripcionReclamarPartida.add(this.partidasService.recuperarDatosDocumento(id).subscribe(
      campo => {

        suscripcionReclamarPartida.unsubscribe();
        let jugada: Partidas = campo;

        //Actualizamos la partida
        jugada.ganador = this.usuario.username;
        this.partidasService.actualizarJugada(jugada);

        //Actualizamos los datos del jugador actual
        this.usuario.partidasGanadas += 1;
        this.usuario.partidasJugadas += 1;
        this.usuariosService.agregarUsuario(this.usuario);


        //Vemos quien es su contrincante y actualizamos sus datos
        let contrincante: Usuario;

        //El id del jugador 2 es el del contrincante
        if (jugada.id_jugador1 == this.usuario.id) {
          let suscripcionUsuario: Subscription = new Subscription();
          suscripcionUsuario.add(this.usuariosService.recuperarDatosDocumento(jugada.id_jugador2).subscribe(
            campo => {
              suscripcionUsuario.unsubscribe();
              contrincante = campo; //cogemos el jugador actual
              contrincante.partidasJugadas += 1;
              this.usuariosService.agregarUsuario(contrincante);

            }
          ));

          //El id del jugador 1 es el del contrincante
        } else {
          let suscripcionUsuario: Subscription = new Subscription();
          suscripcionUsuario.add(this.usuariosService.recuperarDatosDocumento(jugada.id_jugador1).subscribe(
            campo => {
              suscripcionUsuario.unsubscribe();
              contrincante = campo; //cogemos el jugador actual
              contrincante.partidasJugadas += 1;
              this.usuariosService.agregarUsuario(contrincante);
            }
          ));
        }
      }
    ));
  }

}

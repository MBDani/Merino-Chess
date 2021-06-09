import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Partidas } from 'src/app/modelos/partidas.model';
import { Usuario } from 'src/app/modelos/usuario.model';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { PartidasService } from 'src/app/servicios/partidas.service';
import Swal from 'sweetalert2';



declare var createGameOnlineWhite: any;
declare var createGameOnlineBlack: any;
declare var cargarJugada: any;

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.scss']
})
export class OnlineComponent implements OnInit {

  id_partida: string = '';
  id_usuario: string = '';
  id_tablero: string = '';

  partida: Partidas;
  juegaBlancas: boolean = false;

  cargandoPartida: boolean = true;
  animacionFinal: string = '';
  resultado: string = '';

  jugadorActual: string = '';
  contrincante: string = '';

  movimientoMate: boolean = false;
  //alertaMostrada: boolean = true;





  @ViewChild("posicionTablero", { static: false }) posicionTablero: ElementRef //para coger la posición de las piezas  exampleModal


  constructor(
    private route: ActivatedRoute, //lo usaremos para coger el id de la url
    private router: Router, //para navegar al final de la partida
    private authService: AuthService,
    private partidasService: PartidasService,
    private usuarioService: UsuariosService,
  ) { }

  private suscripcionDatos: Subscription = new Subscription();
  private suscripcionEspera: Subscription = new Subscription();

  private suscripcionUsuarioBlancas: Subscription = new Subscription();
  private suscripcionUsuarioNegras: Subscription = new Subscription();
  private suscripcionFinal: Subscription = new Subscription();


  ngOnInit(): void {

    localStorage.setItem("url", this.router.url); //cambiamos la url en la que nos encontramos

    //Inicializamos métodos
    this.obtenerIDs();
    this.cargarLadoTablero();

  }


  /**
   * Obtenemos el id de la partida y el del jugador actual
   */
  private obtenerIDs() {
    //Cogemos el id de la partida que se encuentra en nuestra url
    this.id_partida = this.route.snapshot.params['id'];

    //Cogemos el id del usuario
    this.authService.getAuth().subscribe(auth => {
      if (auth) {

        this.id_usuario = auth.uid;
      }
    });
  }

  /**
   * Recuperamos los datos y mediante un condicional
   */
  private cargarLadoTablero() {
    this.suscripcionDatos.add(this.partidasService.recuperarDatosDocumento(this.id_partida).subscribe(
      campo => {
        this.suscripcionDatos.unsubscribe();


        this.partida = campo;

        //Para que de tiempo a iniciar el resto de cosas
        setTimeout(() => {
          if (this.id_usuario == this.partida.id_jugador1) { //jugador con las piezas blancas

            //Llamamos al método del lado de las blancas 
            this.pantallaCargaBlancas();

          } else { //jugador con las piezas negras

            //Llamamos al método del lado de las negras
            this.cargamosNegras();
          }
        }, 1000);
      }
    ));
  }

  /**
   * Iniciamos el lado de las negras
   */
  cargamosNegras() {
    this.cargandoPartida = false;
    this.partida.turno = "Turno blancas"; //cuando mueva le dará el turno a las blancas


    //Recogemos el estilo y creamos la partida
    let estilo = localStorage.getItem("estilo");
    new createGameOnlineBlack(estilo);

    this.jugadorActual = this.partida.username_2;
    this.contrincante = this.partida.username_1;

    //cargamos la posición del tablero por si acaso se ha refrescado la página
    this.posicionar(this.partida.fen);
    this.recibirJugada();
  }


  /**
   * Creamos pantalla de carga para esperar al jugador de las negras y cargamos el lado de las blancas
   */
  pantallaCargaBlancas() {

    this.suscripcionEspera.add(this.partidasService.recuperarDatosDocumento(this.partida.id_partida).subscribe(
      campo => {

        let esperandoPartida: Partidas = campo;
        this.juegaBlancas = true;

        if (esperandoPartida.id_jugador2 != "") {
          this.cargandoPartida = false;
          this.suscripcionEspera.unsubscribe();

          this.partida = esperandoPartida;
          this.partida.turno = "Turno negras"; //cuando mueva le dará el turno a las negras

          //Cargamos los nombres
          this.jugadorActual = this.partida.username_1;
          this.contrincante = this.partida.username_2;

          //Recogemos el estilo de las piezas y creamos la partida
          let estilo = localStorage.getItem("estilo");
          new createGameOnlineWhite(estilo);

          //cargamos la posición del tablero por si acaso se ha refrescado la página
          this.posicionar(this.partida.fen);
          this.recibirJugada();


        }
      }
    ));

  }


  /**
   * Recibimos los datos del .js y los cargamos a firebase.
   * Además llamamos al método de recibir jugada para estar pendientes de la siguiente jugada.
   */
  cogerPosicionJS() {

    //Reproducimos sonido
    let audio = new Audio();
    audio.src = "../../assets/audio/moveSoundEffect.mp3"
    audio.load();
    audio.play();

    this.partida.fen = this.posicionTablero.nativeElement.value; //actualizamos el fen

    //Cogemos la fecha actual para actualizarla
    var dt = new Date();
    this.partida.tiempo.seconds = dt.getTime() / 1000;

    //Actualizamos la jugada. Si son las blancas borraran los datos del usuario negro, ya que no sabemos si todavía se ha unido
    this.partidasService.actualizarJugada(this.partida);


    //Llamamos al método con el que nos suscribiremos para esperar la respuesta de la jugada
    this.recibirJugada();

  }


  /**
   * Enviamos a nuestro js el movimiento que hemos recibido de la base de datos
   * Añadimos un sonido al movimiento
   * @param jugada 
   */
  posicionar(jugada: string) {
    new cargarJugada(jugada);

    //Añadimos sonido
    let audio = new Audio();
    audio.src = "../../assets/audio/moveSoundEffect.mp3"
    audio.load();
    audio.play();
  }



  /**
   * Creamos una suscripción para controlar los movimientos
   */
  recibirJugada() {
    this.partidasService.recuperarDatosDocumento(this.partida.id_partida).subscribe(cambios => {
      let jugada: Partidas = cambios;
      if (jugada.fen != this.partida.fen) {
        this.partida = jugada;
        //Una vez recibida la jugada, volvemos a poscionar las piezas
        this.posicionar(this.partida.fen)
      }
      //para que no se haga dos veces el final
      if (this.movimientoMate == false){
        this.comprobarEstadoPartida();
      }
    })
  }

  usuarioModel: Usuario;

  //ganan las negras (usuario 2) = jaque mate a las blancas  
  gananNegras() {

    //cambiamos el estado para que no salga dos veces el final al comprobar el estado de la partida
    this.movimientoMate = true;

    document.getElementById('modalFinal').click();

    if (this.id_usuario == this.partida.id_jugador1) {
      //Animación derrota
      this.resultado = "¡PERDISTE CONTRA " + this.contrincante.toUpperCase() + " !"
      this.animacionFinal = '../../assets/gif/looser.gif';

      //Sonido derrota
      let audio = new Audio("../../assets/audio/looser.mp3");
      audio.load();
      audio.play();

    } else {
      //Animación victoria
      this.resultado = "¡GANASTE A " + this.contrincante.toUpperCase() + " !"
      this.animacionFinal = '../../assets/gif/trofeo.gif';

      //Sonido victoria
      let audio = new Audio("../../assets/audio/winner.mp3");
      audio.load();
      audio.play();
    }

    //Recogemos los datos para comprobar si el ganador sigue vacío.
    this.suscripcionFinal.add(this.partidasService.recuperarDatosDocumento(this.partida.id_partida).subscribe(cambios => {
      this.suscripcionFinal.unsubscribe();


      let jugada: Partidas = cambios;

      //Si el ganador no está asignado (y no existen tablas) ya al jugador 2 quiere decir que hay que actualizar los datos. Esto lo hacemos para que no se actualice varias veces al recargar la página.
      if (jugada.ganador != jugada.username_2 && jugada.tablas == false) {


        //Las negras actualizan la colección partidas con el resultado
        this.partida.ganador = this.partida.username_2;
        this.partidasService.actualizarJugada(this.partida);


        //El jugador 1 (blancas) actualiza sus datos de usuario
        this.suscripcionUsuarioBlancas.add(this.usuarioService.recuperarDatosDocumento(this.partida.id_jugador1).subscribe(
          campo => {
            this.suscripcionUsuarioBlancas.unsubscribe();

            this.usuarioModel = campo; //cogemos el jugador actual

            this.usuarioModel.partidasJugadas += 1;

            //Usamos el método de agregar usuario que en este caso solo nos sobreescribirá los datos
            this.usuarioService.agregarUsuario(this.usuarioModel);

          }
        ));

        //El jugador 2 (negras) actualiza sus datos de usuario
        this.suscripcionUsuarioNegras.add(this.usuarioService.recuperarDatosDocumento(this.partida.id_jugador2).subscribe(
          campo => {
            this.suscripcionUsuarioNegras.unsubscribe();

            this.usuarioModel = campo; //cogemos el jugador actual

            this.usuarioModel.partidasJugadas += 1;
            this.usuarioModel.partidasGanadas += 1;

            //Usamos el método de agregar usuario que en este caso solo nos sobreescribirá los datos
            this.usuarioService.agregarUsuario(this.usuarioModel);

          }
        ));

      }

    }));



  }

  //ganan las blancas (usuario 1) = jaque mate a las negras
  gananBlancas() {

    //cambiamos el estado para que no salga dos veces el final al comprobar el estado de la partida
    console.log("Ganan blancas")
    this.movimientoMate = true;
    document.getElementById('modalFinal').click();

    if (this.id_usuario == this.partida.id_jugador1) {
      //Animación victoria
      this.resultado = "¡GANASTE A " + this.contrincante.toUpperCase() + " !"
      this.animacionFinal = '../../assets/gif/trofeo.gif';

      //Sonido victoria
      let audio = new Audio("../../assets/audio/winner.mp3");
      audio.load();
      audio.play();


    } else {
      //Animación derrota
      this.resultado = "¡PERDISTE CONTRA " + this.contrincante.toUpperCase() + " !"
      this.animacionFinal = '../../assets/gif/looser.gif';

      //Sonido derrota
      let audio2 = new Audio("../../assets/audio/looser.mp3");
      audio2.load();
      audio2.play();
    }

    this.suscripcionFinal.add(this.partidasService.recuperarDatosDocumento(this.partida.id_partida).subscribe(cambios => {
      this.suscripcionFinal.unsubscribe();


      let jugada: Partidas = cambios;

      //Si el ganador no está asignado (y no existen tablas) ya al jugador 1 quiere decir que hay que actualizar los datos. Esto lo hacemos para que no se actualice varias veces al recargar la página.
      if (jugada.ganador != jugada.username_1 && jugada.tablas == false) {

        //Las blancas actualizan la colección partidas con el resultado
        this.partida.ganador = this.partida.username_1;
        this.partidasService.actualizarJugada(this.partida);

        //El jugador 1 (blancas) actualiza sus datos de usuario
        this.suscripcionUsuarioBlancas.add(this.usuarioService.recuperarDatosDocumento(this.partida.id_jugador1).subscribe(
          campo => {
            this.suscripcionUsuarioBlancas.unsubscribe();

            this.usuarioModel = campo; //cogemos el jugador actual

            this.usuarioModel.partidasJugadas += 1;
            this.usuarioModel.partidasGanadas += 1;

            //Usamos el método de agregar usuario que en este caso solo nos sobreescribirá los datos
            this.usuarioService.agregarUsuario(this.usuarioModel);

          }
        ));

        //El jugador 2 (negras) actualiza sus datos de usuario
        this.suscripcionUsuarioNegras.add(this.usuarioService.recuperarDatosDocumento(this.partida.id_jugador2).subscribe(
          campo => {
            this.suscripcionUsuarioNegras.unsubscribe();

            this.usuarioModel = campo; //cogemos el jugador actual

            this.usuarioModel.partidasJugadas += 1;

            //Usamos el método de agregar usuario que en este caso solo nos sobreescribirá los datos
            this.usuarioService.agregarUsuario(this.usuarioModel);
          }
        ));
      }
    }));
  }

  /**
   * Se crean las tablas y se actualiza el resultado para ambos jugadores.
   */
  tablas() {

    //Vamos a cargar la animación para empezar
    document.getElementById('modalFinal').click();

    this.resultado = "¡TABLAS CONTRA " + this.contrincante.toUpperCase() + " !"
    this.animacionFinal = '../../assets/gif/empate.gif';

    //Sonido tablas
    let audio = new Audio("../../assets/audio/aplauso.mp3");
    audio.load();
    audio.play();
    


    this.partidasService.recuperarDatosDocumento(this.partida.id_partida).subscribe(
      campo => {

        let jugada: Partidas = campo;

        if (jugada.tablas == false) {
          //Actualizamos las tablas
          this.partida.tablas = true;
          this.partidasService.actualizarJugada(this.partida);

          //Sumamos uno al campo de tablas de los jugadores

          //Sumamos +1 en tablas al jugador 1
          let suscripcionUsuario1: Subscription = new Subscription();
          suscripcionUsuario1.add(this.usuarioService.recuperarDatosDocumento(this.partida.id_jugador1).subscribe(
            campo => {
              suscripcionUsuario1.unsubscribe();

              this.usuarioModel = campo; //cogemos el jugador actual

              this.usuarioModel.tablas += 1;
              this.usuarioModel.partidasJugadas += 1;


              //Usamos el método de agregar usuario que en este caso solo nos sobreescribirá los datos

              this.usuarioService.agregarUsuario(this.usuarioModel);

            }
          ));

          //Sumamos +1 en tablas al jugador 2
          let suscripcionUsuario2: Subscription = new Subscription();
          suscripcionUsuario2.add(this.usuarioService.recuperarDatosDocumento(this.partida.id_jugador2).subscribe(
            campo => {
              suscripcionUsuario2.unsubscribe();

              this.usuarioModel = campo; //cogemos el jugador actual

              this.usuarioModel.tablas += 1;
              this.usuarioModel.partidasJugadas += 1;


              //Usamos el método de agregar usuario que en este caso solo nos sobreescribirá los datos
              this.usuarioService.agregarUsuario(this.usuarioModel);

            }
          ));

        }
      }
    );

  }

  /**
   * Enviamos tablas al otro jugador.
   */
  enviarTablas() {
    //Cargamos la confirmación
    Swal.fire({
      title: '¿Quieres proponer tablas?',
      text: "Si tu contrincante acepta, se acabará la partida en empate.",
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true, //para que cancelar salga a la izquierda

      //Botón de cancelar
      cancelButtonText: 'Aún no...',
      cancelButtonColor: '#d33',

      //Botón de confirmar
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Ofrecer tablas.'

    }).then((result) => {
      if (result.isConfirmed) {
        let suscripcionEnviarTablas: Subscription = new Subscription();
        suscripcionEnviarTablas.add(this.partidasService.recuperarDatosDocumento(this.partida.id_partida).subscribe(cambios => {
          suscripcionEnviarTablas.unsubscribe();


          let partida: Partidas = cambios;

          //Comprobamos si es el jugador 1
          if (this.id_usuario == partida.id_jugador1) {
            partida.solicitudTablasJugador1 = true;
            //Actualizamos el campo de enviarTablas para que el otro usuario sepa que se le envian tablas
            this.partidasService.actualizarJugada(partida);
          } else {
            partida.solicitudTablasJugador2 = true;
            //Actualizamos el campo de enviarTablas para que el otro usuario sepa que se le envian tablas
            this.partidasService.actualizarJugada(partida);
          }
        }));

      }
    })
  }

  recibirTablas() {
    Swal.fire({
      title: this.contrincante + ' pide tablas',
      text: "Si aceptas, se acabará la partida en empate.",
      icon: 'question',
      showCancelButton: true,
      reverseButtons: true, //para que cancelar salga a la izquierda

      //Botón de cancelar
      cancelButtonText: 'Aún no...',
      cancelButtonColor: '#d33',

      //Botón de confirmar
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar tablas.'

    }).then((result) => {
      if (result.isConfirmed) {
        this.tablas();
      } else {
        //Al rechazar las tablas volvemos a poner en false los campos de solicitud tablas.
        let suscripcionEnviarTablas: Subscription = new Subscription();
        suscripcionEnviarTablas.add(this.partidasService.recuperarDatosDocumento(this.partida.id_partida).subscribe(cambios => {
          suscripcionEnviarTablas.unsubscribe();

          let partida: Partidas = cambios;

          partida.solicitudTablasJugador1 = false;
          partida.solicitudTablasJugador2 = false;
          this.partidasService.actualizarJugada(partida);
        }));
      }

    });
  }

  rendirse() {
    let suscripcion: Subscription = new Subscription();
    suscripcion.add(this.partidasService.recuperarDatosDocumento(this.partida.id_partida).subscribe(cambios => {
      suscripcion.unsubscribe();
      let jugada: Partidas = cambios;
      if (jugada.ganador == '') {

        //Cargamos la confirmación
        Swal.fire({
          title: '¿Quieres rendirte?',
          text: "Perderás automáticamente la partida.",
          icon: 'warning',
          showCancelButton: true,
          reverseButtons: true, //para que cancelar salga a la izquierda

          //Botón de cancelar
          cancelButtonText: '¡Noooooooo!',
          cancelButtonColor: '#d33',

          //Botón de confirmar
          confirmButtonColor: '#3085d6',
          confirmButtonText: '¡Si, rendirse!'

        }).then((result) => {
          if (result.isConfirmed) {

            //Cargamos la rendición
            if (this.juegaBlancas) {
              this.gananNegras();
            } else {
              this.gananBlancas();
            }

          }
        })

      }

    }))
  }

  comprobarEstadoPartida() {

    this.partidasService.recuperarDatosDocumento(this.partida.id_partida).subscribe(cambios => {

      let partida: Partidas = cambios;

      //Comprobamos si existe ganador para mostrar el final y que no haya sido un movimiento mate (porque entonces el final ya se mostró).
      if (partida.ganador != '' && this.movimientoMate == false) {

        //El jugador actual es el que ha ganado
        if (partida.ganador == this.jugadorActual) {
          if (this.juegaBlancas) {
            this.gananBlancas();
          } else {
            this.gananNegras();
          }

          //El contrincante es el que ha ganado
        } else {
          if (this.juegaBlancas) {
            this.gananNegras();
          } else {
            this.gananBlancas();
          }
        }

        //En cualquier caso quitamos los botones de rendirse y tablas
        document.getElementById('buttonRendirse').style.display = "none";
        document.getElementById('buttonTablas').style.display = "none";

        //Si existen tablas
      } else if (partida.tablas == true) {

        this.tablas();

        document.getElementById('buttonRendirse').style.display = "none";
        document.getElementById('buttonTablas').style.display = "none";

        //Comprobamos si el jugador 1 le está enviando tablas al jugador 2
      } else if (partida.solicitudTablasJugador1 == true && this.id_usuario == partida.id_jugador2) {
        this.recibirTablas();
        //Comprobamos si el jugador 2 le está enviando tablas al jugador 1
      } else if (partida.solicitudTablasJugador2 == true && this.id_usuario == partida.id_jugador1) {
        this.recibirTablas();
      }


    })
  }

  volverMenu() {
    this.router.navigate(['menu']);
  }

  /*
  mostrarAlerta(){
    
    this.alertaMostrada = true;
    setTimeout(() => {

      this.alertaMostrada = false;
    }, 1000);
  }
  */


}

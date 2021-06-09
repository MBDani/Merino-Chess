import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { Observable, Subscription} from "rxjs";
import { Partidas } from "../modelos/partidas.model";
import { UsuarioActual } from "../modelos/usuarioActual.model";





@Injectable()
export class PartidasService {

     dt = new Date();

    //Lo usaremos cuando no existan partidas vacías y haya que crear una nueva
    partidaNueva: Partidas = {
        id_partida: '',
        id_jugador1: '',
        username_1: '',
        id_jugador2: '',
        username_2: '',
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', //posición por defecto del ajedrez
        ganador: '',
        turno: 'Turno blancas',
        tiempo: {
            seconds: this.dt.getTime()/1000 //le añadimos automáticamente la hora actual
        },
        tablas: false,
        solicitudTablasJugador1: false,
        solicitudTablasJugador2: false
    }

    //Lo usaremos cuando si existan partidas creadas
    busqueda: Partidas = {
        id_partida: '',
        id_jugador1: '',
        username_1: '',
        id_jugador2: '',
        username_2: '',
        fen: '',
        ganador: '',
        turno: '', //no ponemos de quién es el turno por si acaso
        tiempo: {
            seconds: this.dt.getTime()/1000 //le actualizamos automáticamente la hora actual
        },
        tablas: false,
        solicitudTablasJugador1: false,
        solicitudTablasJugador2: false
    }


    
    usuario: UsuarioActual = {
        username: '',
        id: ''
    }

    constructor(private db: AngularFirestore,
        private router: Router
    ) { }


    online(id_jugador: string, username: string) {
        this.usuario.id = id_jugador;
        this.usuario.username = username;

        this.buscarPartida();
    }

    private subscriptionBusqueda: Subscription = new Subscription();



    //-------------------------------------------BUSCADOR----------------------------------------------------------------------------------------------- 

    /**
     * Realizamos la busqueda para comprobar si hay alguna partida libre para poder unirse.
     */
    buscarPartida() {
        this.subscriptionBusqueda.add(this.db.collection('partidas').valueChanges()
            .subscribe(val => {

                for (let i of val) {
                    this.busqueda = i;
                    if (this.busqueda.id_jugador2 == '' && this.busqueda.id_jugador1 != this.usuario.id) {
                        this.ngOnDestroy(); //destruimos la suscripción a la búsqueda para que no siga buscando, ya que, ya encontramos partida
                        break; 
                    }
                }
                this.resultado(); 
            })
        )//fin suscripcion
    }


    /**
     * Analizamos el resultado de la búsqueda y comprobaremos si se puede unir a una partida ya creada o por el contrario necesita crear una nueva.
     */
    resultado() {
        if (this.busqueda.id_jugador2 == '' && this.busqueda.id_jugador1 != this.usuario.id) {

            //Nuestro objeto de array deberá de actualizarse con los datos del id_jugador2, username2
            this.busqueda.id_jugador2 = this.usuario.id;
            this.busqueda.username_2 = this.usuario.username;
            this.db.collection('partidas').doc(this.busqueda.id_partida).set(this.busqueda);
            this.router.navigate(['/online/' + this.busqueda.id_partida]);
        } else {
            this.generarPartida();
        }
    }




    //------------------------------------------------GENERAR PARTIDA------------------------------------------------------------------------------------

    /**
     * Creamos la nueva partida y le mandamos al usuario al modo online
     */
    generarPartida() {
        this.db.collection('partidas').add(this.partidaNueva)
            .then(datos => {

                //Al crear la partida sabemos que es el jugador 1 y le añadimos sus datos más el id de la partida que es con el que se genera el documento
                this.partidaNueva.id_partida = datos.id;
                this.partidaNueva.id_jugador1 = this.usuario.id;
                this.partidaNueva.username_1 = this.usuario.username;

                this.db.collection('partidas').doc(this.partidaNueva.id_partida).set(this.partidaNueva);
                this.router.navigate(['/online/' + this.partidaNueva.id_partida]);
            })
            .catch(error => {
                console.error("Error adding document: ", error);
            });
    }

    //Para destruir las suscripciones que hemos añadido
    public ngOnDestroy(): void {
        this.subscriptionBusqueda.unsubscribe();
    }


    validarJuegoOnline(id: string){
        return this.db.collection('partidas', ref => ref.limit(1)
        .where('id_jugador1', '==', id)
        .where('id_jugador2', '==', '')
        ).valueChanges();
    }





    //-------------------------------------------------------DENTRO DE LA PARTIDA-------------------------------------------------
    recuperarDatosDocumento(id: string) {
      return this.db.collection('partidas').doc(id).valueChanges();

    }

    actualizarJugada(partida: Partidas) {
        this.db.collection('partidas').doc(partida.id_partida).set(partida);
    }

    


    //-------------------------------- HISTORIAL --------------------------------------------------------

    historialJugador(){
        return this.db.collection('partidas' , ref => ref
        .orderBy('tiempo', 'desc')).valueChanges();
    }

  
      getPartida(urlPartida:string, idUsuario:string): Observable<boolean>{
      let partida:Observable<any>;
       
      partida = this.db.collection('partidas', ref => ref.limit(1)
      .where('id_jugador1', '==', idUsuario)
      ).doc(urlPartida).valueChanges();
        return partida;
    }
    
}

export interface Partidas{
    id_partida?:string; //generado automáticamente y que será de la url de la página

    id_jugador1?:string;
    username_1?:string;

    id_jugador2?:string;
    username_2?:string;

    tiempo?:MyDate;
    
    fen?:string; //id de las posiciones
    ganador?:string; //id del ganador. Con un simple else sabremos el perdedor

    turno?:string; //para saber a quién le toca y el estado de la partida.

    tablas?:boolean;
    solicitudTablasJugador1?:boolean;
    solicitudTablasJugador2?:boolean;

}

//Necesitaremos esta clase para poder utilizar los segundos que nos devuelve firebase
export class MyDate {
    seconds?: number;
  }






  
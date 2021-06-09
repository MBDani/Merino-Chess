import { Component, OnInit } from '@angular/core';


declare var gameMenu: any;

@Component({
  selector: 'app-estilo-piezas',
  templateUrl: './estilo-piezas.component.html',
  styleUrls: ['./estilo-piezas.component.scss']
})
export class EstiloPiezasComponent implements OnInit {

  //Estilos
  estiloAlpha:string = 'assets/img/chesspieces/alpha/{piece}.png';
  estiloChess24:string = 'assets/img/chesspieces/chess24/{piece}.png';
  estiloDilena:string = 'assets/img/chesspieces/dilena/{piece}.png';
  estiloLeipzig:string = 'assets/img/chesspieces/leipzig/{piece}.png';
  estiloMetro:string = 'assets/img/chesspieces/metro/{piece}.png';
  estiloSymbol:string = 'assets/img/chesspieces/symbol/{piece}.png';
  estiloUscf:string = 'assets/img/chesspieces/uscf/{piece}.png';
  estiloWikipedia:string = 'assets/img/chesspieces/wikipedia/{piece}.png';

  botonMarcado:number = 0;

  constructor() { }

  ngOnInit(): void {
    this.inicializarTablero();
  }


  /**
   * Inicializamos el tablero mediante nuestra función del js de menuEstilo.
   * Comprobamos que estilo es el que tiene guardado el usuario.
   */
   inicializarTablero(){
    let estiloAlmacenado = localStorage.getItem("estilo");
    new gameMenu(estiloAlmacenado); //inicializamos el tablero


    //Wikipedia (el estilo por defecto)
      if (estiloAlmacenado == this.estiloWikipedia){ 
        localStorage.setItem("estilo", this.estiloWikipedia);
        this.botonMarcado = 1;

        //USCF
      }else if (estiloAlmacenado == this.estiloUscf){
        localStorage.setItem("estilo", this.estiloUscf);
        this.botonMarcado = 2;

        //Alpha
      }else if (estiloAlmacenado == this.estiloAlpha){
        localStorage.setItem("estilo", this.estiloAlpha);
        this.botonMarcado = 3;

        //Chess24
      } else if (estiloAlmacenado == this.estiloChess24){
        localStorage.setItem("estilo", this.estiloChess24);
        this.botonMarcado = 4;

        //Dilena
      } else if (estiloAlmacenado == this.estiloDilena){
        localStorage.setItem("estilo", this.estiloDilena);
        this.botonMarcado = 5;

        //Leipzig
      } else if (estiloAlmacenado == this.estiloLeipzig){
        localStorage.setItem("estilo", this.estiloLeipzig);
        this.botonMarcado = 6;

        //Metro
      } else if (estiloAlmacenado == this.estiloMetro){
        localStorage.setItem("estilo", this.estiloMetro);
        this.botonMarcado = 7;

        //Symbol
      } else if (estiloAlmacenado == this.estiloSymbol){
        localStorage.setItem("estilo", this.estiloSymbol);
        this.botonMarcado = 8;
      }

    
  }


  
  /**
   * Cambiamos el estilo según el botón que toquemos.
   * @param boton 
   */
   cambiarEstilo( boton:number){
     //Wikipedia
    if (boton == 1){
      new gameMenu(this.estiloWikipedia);
      this.botonMarcado = 1;
      localStorage.setItem("estilo", this.estiloWikipedia);

      //USCF
    }else if (boton == 2){
      new gameMenu(this.estiloUscf);
      this.botonMarcado = 2;
      localStorage.setItem("estilo", this.estiloUscf);

      //Alpha
    }else if (boton == 3){
      new gameMenu(this.estiloAlpha);
      this.botonMarcado = 3;
      localStorage.setItem("estilo", this.estiloAlpha);

      //Chess24
    }else if (boton == 4){
      new gameMenu(this.estiloChess24);
      this.botonMarcado = 4;
      localStorage.setItem("estilo", this.estiloChess24);

      //Dilena
    } else if (boton == 5){
      new gameMenu(this.estiloDilena);
      this.botonMarcado = 5;
      localStorage.setItem("estilo", this.estiloDilena);

      //Leipzig
    } else if (boton == 6){
      new gameMenu(this.estiloLeipzig);
      this.botonMarcado = 6;
      localStorage.setItem("estilo", this.estiloLeipzig);

      //Metro
    } else if (boton == 7){
      new gameMenu(this.estiloMetro);
      this.botonMarcado = 7;
      localStorage.setItem("estilo", this.estiloMetro);

      //Symbol
    } else if (boton == 8){
      new gameMenu(this.estiloSymbol);
      this.botonMarcado = 8;
      localStorage.setItem("estilo", this.estiloSymbol);
    }
  }

}

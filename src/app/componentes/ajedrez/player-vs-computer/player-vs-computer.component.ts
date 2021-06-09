import { Component, OnInit } from '@angular/core';

declare var createGamePlayerComputer: any; //nombre de la función


@Component({
  selector: 'app-player-vs-computer',
  templateUrl: './player-vs-computer.component.html',
  styleUrls: ['./player-vs-computer.component.scss']
})
export class PlayerVScomputerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let estilo = localStorage.getItem("estilo");
    new createGamePlayerComputer(estilo); //llamamos a la función de JavaScript
  }

  

}

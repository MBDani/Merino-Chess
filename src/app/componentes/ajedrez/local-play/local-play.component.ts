import { Component, OnInit } from '@angular/core';

declare var createGameLocalPlay: any;

@Component({
  selector: 'app-local-play',
  templateUrl: './local-play.component.html',
  styleUrls: ['./local-play.component.scss']
})
export class LocalPlayComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let estilo = localStorage.getItem("estilo");
    new createGameLocalPlay(estilo);
  }

}

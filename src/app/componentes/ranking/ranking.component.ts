import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../modelos/usuario.model';
import { UsuariosService } from '../../servicios/usuarios.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  usuarios:Usuario[];
 
  constructor(
    private firestoreService:UsuariosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    localStorage.setItem("url", this.router.url); //cambiamos la url en la que nos encontramos
  this.firestoreService.obtenerUsuarios().subscribe(
      usuarios =>{
        this.usuarios = usuarios;
      }
    );
  }

}

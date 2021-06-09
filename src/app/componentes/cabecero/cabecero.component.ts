import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';

import Swal from 'sweetalert2'
import { Subscription } from 'rxjs';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Usuario } from '../../modelos/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabecero',
  templateUrl: './cabecero.component.html',
  styleUrls: ['./cabecero.component.scss']
})
export class CabeceroComponent implements OnInit {

  isLoggedIn: boolean = false;
  id_usuario:string;

  usuario: Usuario;
  nombre:string = '';

  jugandoOnlie:boolean = false;

  constructor(
    private authService: AuthService,
    private firestoreService: UsuariosService,
    private router: Router
  ) { }

  private suscripcionUsuario: Subscription = new Subscription();

  ngOnInit(): void {

    //Comprobamos si está logueado
    this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
        this.id_usuario = auth.uid;

        //Cargar nombre
        this.cargarNombre();

        let url = localStorage.getItem("url");

        if(url != "/ranking" && url != "/menu" && url != "/historial"){
          this.jugandoOnlie = true;

        }else{
          this.jugandoOnlie = false;
        }


      } else {
        this.isLoggedIn = false;
      }
    })

  }


  /**
   * Llamamos a este método solo si está logueado, para obtener el nombre gracias al id del usuario que hemos obtenido.
   */
  cargarNombre(){
    this.suscripcionUsuario.add(this.firestoreService.recuperarDatosDocumento(this.id_usuario).subscribe(
      campo => {
        

        this.usuario = campo; //cogemos el jugador actual
        this.nombre = this.usuario.username;
      }
    ));
  }

  /**
   * Método de confirmación y cierre de sesión.
   */
  logout(){

    if (!this.jugandoOnlie){
    Swal.fire({
      title: '¿Quieres cerrar la sesión?',
      text: "No podrás jugar online sin loguearte primero.",
      icon: 'question',
      showCancelButton: true, 
      reverseButtons: true, //para que cancelar salga a la izquierda
      
      //Botón de cancelar
      cancelButtonText: '¡Noooooooo!',
      cancelButtonColor: '#d33',

      //Botón de confirmar
      confirmButtonColor: '#3085d6',
      confirmButtonText: '¡Sí, cerrar sesión!'

    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          '¡Sesión Cerrada!',
          'La sesión ha sido cerrada correctamente.',
          'success'
        )

        //Cerramos sesión
        this.authService.logout();
        this.isLoggedIn = false;
        this.nombre = '';

        //Le devolvemos al menú principal para que no siga navegando por la web sin estar loggueado
        setTimeout(() => {
          this.router.navigate(['menu'])
        }, 1000);
      }
    })

  }else{
    Swal.fire({
      icon: 'error',
      title: '¡No puedes cerrar sesión ahora!',
      text: 'Mientras juegas online deberás de permanecer con la sesión iniciada.',

      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Vale'
    })
  }
  }

}

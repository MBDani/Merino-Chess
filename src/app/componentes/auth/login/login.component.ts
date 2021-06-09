import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/modelos/usuario.model';
import { AuthService } from 'src/app/servicios/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  
  usuario:Usuario = {
    email: '',
    password: ''
  }


  mostrarAlerta:boolean = false;
  alerta:string = "¡Error en el formulario! Rellenelo correctamente por favor."

  constructor(
    private router: Router,
    private authService: AuthService
    ) { }


    @ViewChild("usuarioForm") usuarioForm:NgForm; //este nombre lo hemos definido al inicio de nuestro formulario
    @ViewChild('alert', { static: true }) alert: ElementRef; //para las alertas
    @ViewChild ("botonCerrar") botonCerrar:ElementRef //botón de cerrar el modal

    

  ngOnInit(): void {
  }

  

  login({value, valid}: {value:Usuario, valid: boolean}){

    //Comprobamos si el formulario esta bien rellenado
    if (!valid){
      this.mostrarAlerta = true;
    }else{
      this.mostrarAlerta = false;

      this.authService.login(value.email, value.password)
      .then(res => {
        
        //mensaje de logueo con éxito
        Swal.fire(
          '¡Logueado!',
          'Te has logueado con éxito.',
          'success'
        )

        this.usuarioForm.resetForm();
        this.cerrarModal();
      })
      .catch(error => {

        //mensaje de error en el login
        Swal.fire({
          title: '¡Error!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'Reintentar'
        });
      });
   
    }
  }
  
  cerrarModal(){
    this.botonCerrar.nativeElement.click();
  }

}

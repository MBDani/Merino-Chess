import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from 'src/app/modelos/usuario.model';

import { AuthService } from 'src/app/servicios/auth.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

import Swal from 'sweetalert2'


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {


  usuario:Usuario = {
    username: '',
    email: '',
    password: '',
  }

  

  mostrarAlerta:boolean = false;
  alerta:string = "¡Error en el formulario! Rellenelo correctamente por favor."

  constructor(
    private authService: AuthService,
    private fireService: UsuariosService) { }


    @ViewChild("usuarioForm") usuarioForm:NgForm; //este nombre lo hemos definido al inicio de nuestro formulario
    @ViewChild('alert', { static: true }) alert: ElementRef; //para las alertas
    @ViewChild ("botonCerrar") botonCerrar:ElementRef //botón de cerrar el modal

    

  ngOnInit(): void {
  }


  
  registro({value, valid}: {value:Usuario, valid: boolean}){
    if (!valid){
      this.mostrarAlerta = true;
    }else{
      
      this.authService.registroAuth(value.email, value.password)
      .then( res => {
        this.mostrarAlerta = false; //quitamos la alerta si es que alguna vez ha salido
       
       
        //hacer registro firestore
       
        
        this.authService.getAuth().subscribe(auth =>{
            this.usuario.id =  auth.uid; //obtener el id del auth del usuario
            this.usuario.username = value.username;
            this.usuario.email = value.email;
            this.usuario.password= value.password;
            this.usuario.partidasJugadas = 0;
            this.usuario.partidasGanadas = 0;
            this.usuario.tablas = 0;

            this.fireService.agregarUsuario(this.usuario);
           
        })

        //mensaje de registro con éxito
        Swal.fire(
          '¡Registrado!',
          'Te has registrado con éxito.',
          'success'
        )
        
      this.usuarioForm.resetForm();
      this.cerrarModal();
      })
      .catch(error =>{
        //mensaje de error en el registro
        Swal.fire({
          title: '¡Error!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'Reintentar'
        });
      
      })

    } //fin else
    
  }


  cerrarModal(){
    this.botonCerrar.nativeElement.click();
  }




}



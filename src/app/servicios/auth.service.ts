import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {

  constructor(private authService:AngularFireAuth) { }

  login(email:string, password:string){
    return new Promise((resolve, reject) => {
      this.authService.signInWithEmailAndPassword(email, password)
      .then(datos => resolve(datos), 
        error => reject(error) //por si recibimos algún error
      )
    })
  }


  getAuth(){
    return this.authService.authState.pipe(
      map(auth => auth)
    )
  }

  logout(){
    this.authService.signOut();
  }


  registroAuth(email:string, password:string){
    return new Promise((resolve, reject) => {
      this.authService.createUserWithEmailAndPassword(email, password)
      .then(datos => resolve(datos), 
      error => reject(error))
    });
  }
}

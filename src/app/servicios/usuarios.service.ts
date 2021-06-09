import { Injectable } from "@angular/core";
import { AngularFirestore} from "@angular/fire/firestore";
import { Usuario } from "../modelos/usuario.model";


@Injectable()
export class UsuariosService {

    constructor(private db: AngularFirestore) { }


    agregarUsuario(usuario: Usuario) {
        this.db.collection('usuarios').doc(usuario.id).set(usuario);
    }


    recuperarDatosDocumento(id:string) {
            return this.db.collection('usuarios').doc(id).valueChanges();
    }

    obtenerUsuarios(){
         return this.db.collection('usuarios', ref => ref.orderBy('partidasGanadas', 'desc')).valueChanges();

    }
}
import { Component, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

export interface Usuario {
    id : number;
    nombreCompleto : string ;
    documento : {
        tipo: string;
        numero: string;
},
    fecha_Nacimiento : string;
    Genero : string;
    Correo_electronico : string;
    Numero_de_telefono : string ;
    domicilio : {
        Pais_de_domicilio : string;
        Ciudad_de_domicilio : string;
    },
    tratamiento_de_datos :boolean;
}



@Component({
  imports: [FormsModule],
  selector: 'app-registro-usuario',
  standalone: true, // DECLARA QUE UN COMPONENTE ES AUTONOMO
  styleUrl: './registro-usuario.css',
  templateUrl: './registro-usuario.html',
})
export class RegistroUsuario {
 Nombre = signal('');
 Apellido = signal('');
 Tipo_de_documento = signal('CC');
 dni = signal('');
 Fecha_de_nacimiento = signal('');
 Genero = signal('');
 Correo_electronico = signal('');
 Numero_de_telefono = signal('');
 Pais_de_domicilio = signal('');
 Ciudad_de_domicilio = signal('');
 Tratamiento_de_datos = signal(false);

 ultimoUsuario = signal<Usuario | null>(null);

 guardarUsuario() {
    if (!this.Tratamiento_de_datos()) {
        alert('Debe aceptar el tratamiento de datos para continuar.');
    }
const usuarioCreado = {
    id : Date.now(),
    nombreCompleto : `${this.Nombre()} ${this.Apellido()}`,
    documento : {
        tipo: this.Tipo_de_documento(),
        numero: this.dni()
},
    fecha_Nacimiento : this.Fecha_de_nacimiento(),
    Genero : this.Genero(),
    Correo_electronico : this.Correo_electronico(),
    Numero_de_telefono : this.Numero_de_telefono(),
    domicilio : {
        Pais_de_domicilio : this.Pais_de_domicilio(),
        Ciudad_de_domicilio : this.Ciudad_de_domicilio()
    },
    tratamiento_de_datos : this.Tratamiento_de_datos(),
}

//Guardar los datos en el navegador

//localStorage.setItem('crearUsuario',usuarioJSON)estatico
//dinamico
//Guardarlo en una sola linea de codigo
localStorage.setItem(usuarioCreado.id.toString(), JSON.stringify(usuarioCreado));
this.ultimoUsuario.set(usuarioCreado);
  }
}  //Crear una funcion Crear el usuario


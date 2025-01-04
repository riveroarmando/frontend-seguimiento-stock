import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { SecurityService } from '../../../services/security.service';
import { Router } from '@angular/router';
import { UserInterface } from '../../../interfaces/user.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*Angular Material */
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

const MATERIAL_MODULES = [MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule];

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent {

  formNewUser = this._formBuilder.group({
    usuario: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30)
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(20)
    ]],
    nombre_y_apellido: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(20)
    ]],
    rol: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(20)
    ]],
    imagen: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.minLength(10),
      Validators.maxLength(40)
    ]]
  });

constructor(
    private _userService: UserService,
    private _securityService: SecurityService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {
  }

  get usuario(){
    return this.formNewUser.controls['usuario'];
  }

  get password(){
    return this.formNewUser.controls['password'];
  }

  get nombre_y_apellido(){
    return this.formNewUser.controls['nombre_y_apellido'];
  }
  get rol(){
    return this.formNewUser.controls['rol'];
  }

  get imagen(){
    return this.formNewUser.controls['imagen'];
  }

  get email(){
    return this.formNewUser.controls['email'];
  }


  createNewUser() {

    let bodydata: UserInterface = {
      usuario: this.usuario.value!==null? this.usuario.value: '',
      password: this.password.value!==null? this.password.value: '',
      nombre_y_apellido: this.nombre_y_apellido.value!==null? this.nombre_y_apellido.value: '',
      rol: this.rol.value!==null? this.rol.value: '',
      imagen: this.imagen.value!==null? this.imagen.value: '',
      email: this.email.value!==null? this.email.value: ''
    };

    this._userService.newUser(bodydata).subscribe(
      {
        next: (resultado) => {
          //Guardo en el sessionStorage el usuario y el token
          console.log(resultado)
          if (resultado.estado) {
            alert("Usuario creado con exito a las " + resultado.fecha_creacion);
          } else {
            alert("ERROR no se ha podido generar el usuario");
          }

        },
        error: (error) => {
          if (error.status == 403 || error.status == 401) {

            alert("ERROR al crear el usuario!!!");
          }
        },
        complete: () => console.info('Peticion Completada')
      }
    );
  }
}

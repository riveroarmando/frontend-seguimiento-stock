export interface UserInterface {
    usuario:           string;
    password:          string;
    nombre_y_apellido: string;
    rol:               string;
    imagen:            string;
    email:             string;
  }

  export interface UserResponse {
  nombre_y_apellido: string;
  usuario:           string;
  fecha_creacion:    Date;
  estado:            boolean;
  imagen:            string;
  email:             string;
  rol:               string;
}

export interface Rol {
  id:          string;
  nombre_rol:  string;
  descripcion: string;
  nivel:       number;
}

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { User } from "../models/user";
import { UserInterface } from "../interfaces/user.interface";
import { UserResponse } from "../interfaces/user.interface";
import { Global } from "./global";
import { Router } from '@angular/router';
import { SecurityService } from "./security.services";

@Injectable()
export class UserService {
    public url: string;
    private _usuario!: User;
    private httpHeaders = new HttpHeaders().set('content-type', 'application/json');
    
    constructor(
        public _http: HttpClient,
        private _router: Router,
        private _securityService: SecurityService
    ) {
        this.url = Global.url;
    }

    private agregarAuthorizationHeader(){
        var token=this._securityService.token;
        if(token!=null){
            return this.httpHeaders.append('Authorization', 'Bearer ' + token);
        }
        return this.httpHeaders;
    }
    
    guardarUsuario(jwt: string): void {
        var payload = this._securityService.obtenerPayloadToken(jwt);
        if (payload) {
            this._usuario = new User("", "", "", false, "", "", "", "", "");
            this._usuario.nombre_y_apellido = payload.nombre_y_apellido;
            this._usuario.usuario = payload.usuario;
            this._usuario.estado = payload.estado;
            this._usuario.rol = payload.rol;
            this._usuario.imagen = payload.imagen;
            this._usuario.id = payload.id;
            sessionStorage.setItem("usuario", JSON.stringify(this._usuario));
        }
    }
    
    loginUser(loginData: any): Observable<any> {
        let parametros = JSON.stringify(loginData);
        
        return this._http.post(this.url + 'auth/login', parametros, { headers: this.agregarAuthorizationHeader() });
    }

   
    newUser(userData: UserInterface): Observable<UserResponse> {
        let parametros = JSON.stringify(userData);
        
        return this._http.post<UserResponse>(this.url + 'usuarios', parametros, { headers: this.agregarAuthorizationHeader() });
    }

     /**************************************************************************************************************/

    updateColaborador(proyecto: any): Observable<any> {
        let params = JSON.stringify(proyecto);
    
        return this._http.put(this.url + 'editar-colaborador', params, { headers: this.agregarAuthorizationHeader() });
    }

    private isNoAutorizado(e: any): boolean {
        //console.log("Entre en is");
        if (e.status == 400 || e.status == 401 || e.status == 403 || e.status == 500) {
            //alert("Usuario o Password incorrecta");
            this._router.navigateByUrl('/');
            return true;
        }
        return false;
    }

    

    
    getUsers(): Observable<UserResponse[]>{
    
        return this._http.get<UserResponse[]>(this.url+'usuarios', {headers: this.agregarAuthorizationHeader()});
    }

    /*
    getColaborador(id: any): Observable<any>{
        let parametos = JSON.stringify(id);
        let headers = new HttpHeaders().set('content-type', 'application/json');

        return this._http.post(this.url+'colaborador', parametos, {headers: headers});
    }*/

    deleteColaborador(id:any): Observable<any>{
    
        return this._http.delete(this.url+'borrar-colaborador/'+id, {headers: this.agregarAuthorizationHeader()});
    }
}
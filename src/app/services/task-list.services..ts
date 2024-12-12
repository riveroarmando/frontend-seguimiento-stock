import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { User } from "../models/user";
import { Global } from "./global";
import { Router } from '@angular/router';
import { SecurityService } from "./security.services";
import { TaskResult } from "../interfaces/tareas.interfaces";
import { TaskSearch } from "../interfaces/task-search.interfaces";

@Injectable()
export class TaskListService {
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

    /**************************************************************************************************************/
    saveColaborador(project: User): Observable<any> {
        let parametros = JSON.stringify(project);
        
        return this._http.post(this.url + 'alta-colaborador', parametros, { headers: this.agregarAuthorizationHeader() });
    }


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

    

    
    getTasksList(bodydata: TaskSearch): Observable<TaskResult>{

        let find = "tareas?";
        if(bodydata.cliente){
            find = find + "cliente=" + bodydata.cliente + "&";
        }
        if(bodydata.producto){
            find = find + "producto=" + bodydata.producto + "&";
        }
        if(bodydata.fecha_inicio){
            find = find + "fecha_inicio=" + bodydata.fecha_inicio + "&";
        }
        if(bodydata.fecha_fin){
            find = find + "fecha_fin=" + bodydata.fecha_fin + "&";
        }
        if(bodydata.longitud_pagina){
            find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";
        }
        if(bodydata.numero_pagina){
            find = find + "numero_pagina=" + bodydata.numero_pagina;
        }
    
        return this._http.get<TaskResult>(this.url+ find, {headers: this.agregarAuthorizationHeader()});

        /*return this._http.get<TaskResult>(this.url+ "tareas", {
            params: new HttpParams()
            .set('cliente', bodydata.cliente)
            .set('producto', bodydata.producto)
            .set('fecha_inicio', bodydata.fecha_inicio)
            .set('fecha_fin', bodydata.fecha_fin)
            .set('longitud_pagina', bodydata.longitud_pagina)
            .set('numero_pagina', bodydata.numero_pagina),
            headers: this.agregarAuthorizationHeader()
        });*/
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
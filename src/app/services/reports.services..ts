import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { User } from "../models/user";
import { Global } from "./global";
import { Router } from '@angular/router';
import { SecurityService } from "./security.services";
import { TaskResult } from "../interfaces/tareas.interfaces";
import { TaskSearch } from "../interfaces/task-search.interfaces";
import { Client } from "../interfaces/client.interfaces";
import { Product, ProductsSearch } from "../interfaces/product.interface";
import { ProductsResult } from "../interfaces/product.interface";
import { ReportSearch } from "../interfaces/report.interface";
import { ClientReportResult } from "../interfaces/report.interface";
import { ProductReportResult } from "../interfaces/report.interface";

@Injectable()
export class ReportsService {
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
    
    getClients(): Observable<Client[]>{

        return this._http.get<Client[]>(this.url+ 'clientes', {headers: this.agregarAuthorizationHeader()});

    }

    getProducts(cliente: string): Observable<Product[]>{

        //return this._http.get<Product[]>(this.url+ 'productos', {headers: this.agregarAuthorizationHeader()});
        return this._http.get<Product[]>(this.url+ "productos", {
            params: new HttpParams()
            .set('cliente', cliente),
            headers: this.agregarAuthorizationHeader()
        });

    }

    getReportsList(bodydata: ReportSearch): Observable<ClientReportResult>{

        let find = "reportes?";
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
        if(bodydata.tipo){
            find = find + "tipo=" + bodydata.tipo + "&";
        }
        if(bodydata.formato){
            find = find + "formato=" + bodydata.formato + "&";;
        }
        if(bodydata.longitud_pagina){
            find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";;
        }
        if(bodydata.numero_pagina){
            find = find + "numero_pagina=" + bodydata.numero_pagina;
        }
        
        return this._http.get<ClientReportResult>(this.url+ find, {headers: this.agregarAuthorizationHeader()});

    }

    getReportsListFilter(bodydata: ReportSearch): Observable<ClientReportResult>{
        let find = "reportes?";
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
        if(bodydata.tipo){
            find = find + "tipo=" + bodydata.tipo + "&";
        }
        if(bodydata.formato){
            find = find + "formato=" + bodydata.formato + "&";
        }
        if(bodydata.longitud_pagina){
            find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";
        }
        if(bodydata.numero_pagina){
            find = find + "numero_pagina=" + bodydata.numero_pagina;
        }

        
        //console.log(this.url+ find);
        return this._http.get<ClientReportResult>(this.url+ find, {headers: this.agregarAuthorizationHeader()});
    }


    getReportsListProduct(bodydata: ReportSearch): Observable<ProductReportResult>{

        let find = "reportes?";
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
        if(bodydata.tipo){
            find = find + "tipo=" + bodydata.tipo + "&";
        }
        if(bodydata.formato){
            find = find + "formato=" + bodydata.formato + "&";;
        }
        if(bodydata.longitud_pagina){
            find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";;
        }
        if(bodydata.numero_pagina){
            find = find + "numero_pagina=" + bodydata.numero_pagina;
        }
        
        return this._http.get<ProductReportResult>(this.url+ find, {headers: this.agregarAuthorizationHeader()});

    }

    getReportsListFilterProduct(bodydata: ReportSearch): Observable<ProductReportResult>{
        let find = "reportes?";
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
        if(bodydata.tipo){
            find = find + "tipo=" + bodydata.tipo + "&";
        }
        if(bodydata.formato){
            find = find + "formato=" + bodydata.formato + "&";
        }
        if(bodydata.longitud_pagina){
            find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";
        }
        if(bodydata.numero_pagina){
            find = find + "numero_pagina=" + bodydata.numero_pagina;
        }

        
        //console.log(this.url+ find);
        return this._http.get<ProductReportResult>(this.url+ find, {headers: this.agregarAuthorizationHeader()});
    }

    /**************************************************************************************************************/
    
}
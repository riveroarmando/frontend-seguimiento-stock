import { Component, Inject, OnInit } from '@angular/core';

import { DashboardService } from '../services/dashboard.service';

import { BarChartComponent } from './bar-chart/bar-chart.component';
import { UserService } from '../services/user.service';
import { SecurityService } from '../services/security.service';
import { TaskListService } from '../services/task-list.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FileManagerService } from '../services/file-manager.service';
import { Global } from '../services/global';
import { ReportSearch, ResultadoPorCliente } from '../interfaces/report.interface';
import { Cliente } from '../interfaces/client.interface';
import { Producto } from '../interfaces/product.interface';
import { catchError, finalize, tap, throwError } from 'rxjs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

const MATERIAL_MODULES = [MatButtonModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule];

const datosPrueba = {
  mes: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  hojas: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
  imagenes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  color: ["blue", "red", "pink", "yellow", "green", "grey", "orange", "brown", "purple", "black", "indigo", "magenta"]
}

const datosPrueba1 = {
  mes: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  hojas: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240],
  imagenes: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
  color: ["blue", "red", "pink", "yellow", "green", "grey", "orange", "brown", "purple", "black", "indigo", "magenta"]
}

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BarChartComponent, MATERIAL_MODULES],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  public url: string;
  public data: any;
  public data1: any;
  public isLoadingResults: boolean = true;
  //String que levantan las listas de los menu desplegables
  public months: string[] = months;
  public years: string[] = [];
  //Variables para seleccionar listas
  public selectedMonth: string = "";
  public selectedYear: string = "";

  //Fechas
  startDate = new FormControl(new Date(2022, 0, 1));/* Creo con fecha inicial 01/01/2022 */
  endDate = new FormControl(new Date());/* Creo con fecha final la actual */

  //BORRAR
  public _id:string="barchart1";

  formFilter = this._formBuilder.group({
    clienteSeleccionado: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]],
    productoSeleccionado: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30)
    ]]
  });

  constructor(
    private _userService: UserService,
    private _securityService: SecurityService,
    private _dashboardService: DashboardService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _fileManagerService: FileManagerService
  ) {
    this.url = Global.url;
  }

  get clienteSeleccionado() {
    return this.formFilter.controls['clienteSeleccionado'];
  }

  get productoSeleccionado() {
    return this.formFilter.controls['productoSeleccionado'];
  }

  ngOnInit(): void {
    this.loadDataClients();
  }

  loadDataClients() {

    let sDate = this.startDate.value !== null ? this.startDate.value.toISOString() : "";
    let eDate = this.endDate.value !== null ? this.endDate.value.toISOString() : "";

    this.isLoadingResults = true;

    let bodydata: ReportSearch = {
      cliente: "",
      fecha_fin: eDate,
      fecha_inicio: sDate,
      producto: "",
      tipo: "cliente",
      formato: "json",
      longitud_pagina: 100000,
      numero_pagina: 1
    };

    this._dashboardService.getReportsListClient(bodydata)
      .subscribe(
        {
          next: (data) => {
            this.data = datosPrueba;
          },
          error: (error) => {
            if (error.status == 400 || error.status == 403 || error.status == 401) {
              alert("Su sesión ha expirado.");
              //this._seguridadService.logout();
              //this._router.navigateByUrl("/");
            }
          },
          complete: () => console.info('Peticion Completada')
        }
      );

    this._dashboardService.getReportsListClient(bodydata)
      .subscribe(
        {
          next: (data) => {
            this.data1 = datosPrueba1;
          },
          error: (error) => {
            if (error.status == 400 || error.status == 403 || error.status == 401) {
              alert("Su sesión ha expirado.");
              //this._seguridadService.logout();
              //this._router.navigateByUrl("/");
            }
          },
          complete: () => console.info('Peticion Completada')
        }
      );
  }

  onChangeMonth(){

  }

  cambiar(){
    this.data1 = datosPrueba;
  }

}

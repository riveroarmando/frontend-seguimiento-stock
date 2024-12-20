
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { merge, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


import { SecurityService } from '../services/security.services';
import { UserService } from '../services/user.services';
import { ReportsService } from '../services/reports.services.';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Global } from '../services/global';
import { RouterModule } from '@angular/router';
/*Para que funcione httpclient */
import { HttpClientModule } from '@angular/common/http';

import { TaskSearch } from '../interfaces/task-search.interfaces';
import { Tarea } from '../interfaces/tareas.interfaces';
import { Client } from '../interfaces/client.interfaces';
import { Product } from '../interfaces/product.interface';

/*Angular Material */
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';

import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { catchError, finalize, tap, throwError } from 'rxjs';

import { ReportsByProductsComponent } from "../reports-by-products/reports-by-products.component";
import { ReportsByClientsComponent } from "../reports-by-clients/reports-by-clients.component";

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HttpClientModule, MatTabsModule, MatDatepickerModule, MatSelectModule, MatTableModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule, ReportsByProductsComponent, ReportsByClientsComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  providers: [UserService, SecurityService, ReportsService, provideNativeDateAdapter()]
})
export class ReportsComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['cliente', 'producto', 'nombre_tarea', 'cantidad', 'unidad', 'fecha_creacion'];
  public url: string;
  public data: Tarea[] = [];
  public pageNumber: number = 0;
  public totalRecords: number = 0;
  public pageLength: number = 25;
  public numberOfPages: number = 0;
  public resultsLength = 0;
  //Clients
  public isLoadingResultsClients: boolean = true;
  public isRateLimitReachedClients = false;

  //String que levantan las listas de los menu desplegables
  public clientes: Client[] = [];
  public productos: Product[] = [];
  //Variables para seleccionar listas
  public selectedClient: string = "";
  public selectedProduct: string = "";
  //Fechas
  startDate = new FormControl(new Date());
  endDate = new FormControl(new Date());
  
  datoSeleccionado: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


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
    private _reportsService: ReportsService,
    private _router: Router,
    private _formBuilder: FormBuilder
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
    //this.loadClients();
  }

  /*********************************TABLA*********************************************/

  loadClients() {
    this._reportsService.getClients()
      .pipe(
        tap(data => {
          this.clientes = data;

          this.selectedClient = 'Todos';
          this.selectedProduct = 'Todos';
        }),
        catchError(err => {
          console.log("Error cargando los datos de Clientes ", err);
          this._securityService.logout();
          this._router.navigateByUrl("/");
          return throwError(err);
        }),
        finalize(() => {this.isLoadingResultsClients = false})
      )
      .subscribe();
  }

  loadTaskList() {

    this.isLoadingResultsClients = true;
    
    let bodydata: TaskSearch = {
      cliente: "",
      fecha_fin: "",
      fecha_inicio: "",
      producto: "",
      longitud_pagina: this.paginator?.pageSize ?? 25,
      numero_pagina: this.paginator?.pageIndex ?? 1
    };

    this._reportsService.getTasksList(bodydata)
      .pipe(
        tap(data => {
          this.data = data.tareas;
          this.pageNumber = data.numero_pagina;
          this.totalRecords = data.total_registros;
          this.pageLength = data.longitud_pagina;
          this.numberOfPages = data.cantidad_paginas;
        }),
        catchError(err => {
          console.log("Error cargando los datos de Tareas ", err);
          this._securityService.logout();
          this._router.navigateByUrl("/");
          return throwError(err);
        }),
        finalize(() => this.isLoadingResultsClients = false)
      )
      .subscribe();
  };

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    
  }

  findTasks() {

    console.log(this.startDate.value?.toISOString());
    console.log(this.endDate.value?.toISOString());
    
    let sDate = this.startDate.value!==null?this.startDate.value.toISOString(): "";
    let eDate = this.endDate.value!==null?this.endDate.value.toISOString(): "";

    this.isLoadingResultsClients = true;

    let bodydata: TaskSearch = {
      cliente: this.selectedClient === "Todos" ? "" : this.selectedClient,
      fecha_fin: eDate,
      fecha_inicio: sDate,
      producto: this.selectedProduct === "Todos" ? "" : this.selectedProduct,
      longitud_pagina: this.paginator?.pageSize ?? 25,
      numero_pagina: 1
    };

    this._reportsService.getTasksListFilter(bodydata)
      .pipe(
        tap(data => {
          this.data = data.tareas;
          this.pageNumber = data.numero_pagina;
          this.totalRecords = data.total_registros;
          this.pageLength = this.paginator?.pageSize;
          this.numberOfPages = data.cantidad_paginas;
        }),
        catchError(err => {
          console.log("Error cargando los datos de Tareas ", err);
          alert("Error cargando los datos de Tareas ");
          return throwError(err);
        }),
        finalize(() => this.isLoadingResultsClients = false)
      )
      .subscribe();
  }

  onChangeClient() {
    this._reportsService.getProducts(this.selectedClient)
      .pipe(
        tap(product => {
          this.productos = product;
          this.selectedProduct = 'Todos';
        }),
        catchError(err => {
          console.log("Error cargando los datos de productos ", err);
          alert("Error cargando los datos de productos ");
          return throwError(err);
        }),
        finalize(() => {

          this.isLoadingResultsClients = false;
        })
      )
      .subscribe();
  }
  
  verifyStartDate(){

    let startDate = this.startDate.value!==null?this.startDate.value: new Date();
    let endDate = this.endDate.value!==null?this.endDate.value: new Date();
    if(startDate>endDate){
      alert("No puede seleccionar una fecha inicial superior a la final");
      this.startDate.setValue(this.endDate.value);
    }
  }

  verifyEndDate(){

    let startDate = this.startDate.value!==null?this.startDate.value: new Date();
    let endDate = this.endDate.value!==null?this.endDate.value: new Date();
    if(startDate>endDate){
      alert("No puede seleccionar una fecha final inferior a la inicial");
      this.endDate.setValue(this.startDate.value);
    }
  }
  

}



/*****************************FIN TABLA*********************************************/


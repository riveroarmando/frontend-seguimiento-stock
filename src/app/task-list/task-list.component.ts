import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { merge, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


import { SecurityService } from '../services/security.services';
import { UserService } from '../services/user.services';
import { TaskListService } from '../services/task-list.services.';
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

import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { catchError, finalize, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MatDatepickerModule, MatSelectModule, MatTableModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  providers: [UserService, SecurityService, TaskListService, provideNativeDateAdapter()]
})
export class TaskListComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['cliente', 'producto', 'nombre_tarea', 'cantidad', 'unidad', 'fecha_creacion'];
  public url: string;
  public data: Tarea[] = [];
  public pageNumber: number = 0;
  public totalRecords: number = 0;
  public pageLength: number = 25;
  public numberOfPages: number = 0;
  public isLoadingResults: boolean = true;
  public resultsLength = 0;
  public isRateLimitReached = false;

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
    private _taskListService: TaskListService,
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
    this.loadClients();
  }

  /*********************************TABLA*********************************************/

  /*applyFilter(event: Event) {
    //const filterValue = (event.target as HTMLInputElement).value;
    //this.dataSource.filter = filterValue.trim().toLowerCase();

    //if (this.dataSource.paginator) {
    //  this.dataSource.paginator.firstPage();
    //}
  }*/

  loadClients() {
    this._taskListService.getClients()
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
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
  }

  loadTaskList() {

    this.isLoadingResults = true;

    let bodydata: TaskSearch = {
      cliente: "",
      fecha_fin: "",
      fecha_inicio: "",
      producto: "",
      longitud_pagina: this.paginator?.pageSize ?? 25,
      numero_pagina: this.paginator?.pageIndex ?? 1
    };

    this._taskListService.getTasksList(bodydata)
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
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
  };

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          let bodydata: TaskSearch = {
            cliente: this.selectedClient === "Todos" ? "" : this.selectedClient,
            fecha_fin: "",
            fecha_inicio: "",
            producto: this.selectedProduct === "Todos" ? "" : this.selectedProduct,
            longitud_pagina: this.paginator?.pageSize,
            numero_pagina: this.paginator?.pageIndex + 1
          };
          return this._taskListService.getTasksList(bodydata)
            .pipe(
              catchError(() => observableOf(null))
            );
        }),
        map(data => {
          this.pageNumber = data?.numero_pagina ?? 1;
          this.totalRecords = data?.total_registros ?? 0;
          this.pageLength = this.paginator?.pageSize;
          this.numberOfPages = data?.cantidad_paginas ?? 0;
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.total_registros;
          return data.tareas;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  findTasks() {

    console.log(this.startDate.value?.toISOString());
    console.log(this.endDate.value?.toISOString());
    
    let sDate = this.startDate.value!==null?this.startDate.value.toISOString(): "";
    let eDate = this.endDate.value!==null?this.endDate.value.toISOString(): "";

    this.isLoadingResults = true;

    let bodydata: TaskSearch = {
      cliente: this.selectedClient === "Todos" ? "" : this.selectedClient,
      fecha_fin: eDate,
      fecha_inicio: sDate,
      producto: this.selectedProduct === "Todos" ? "" : this.selectedProduct,
      longitud_pagina: this.paginator?.pageSize ?? 25,
      numero_pagina: 1
    };

    this._taskListService.getTasksListFilter(bodydata)
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
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
  }

  onChangeClient() {
    this._taskListService.getProducts(this.selectedClient)
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

          this.isLoadingResults = false;
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


import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { merge, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { SecurityService } from '../../../services/security.services';
import { UserService } from '../../../services/user.services';
import { ReportsService } from '../../../services/reports.services.';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { Global } from '../../../services/global';
import { RouterModule } from '@angular/router';
/*Para que funcione httpclient */
import { HttpClientModule } from '@angular/common/http';

import { TaskSearch } from '../../../interfaces/task-search.interfaces';
import { Tarea } from '../../../interfaces/tareas.interfaces';
import { Client } from '../../../interfaces/client.interfaces';
import { ClientResult } from '../../../interfaces/client.interfaces';
import { Product } from '../../../interfaces/product.interface';
import { ProductsResult } from '../../../interfaces/product.interface';
import { ProductsSearch } from '../../../interfaces/product.interface';


/*Angular Material */
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { TaskListService } from '../../../services/task-list.services.';
import { UserResponse } from '../../../interfaces/user.interface';

const MATERIAL_MODULES = [MatDatepickerModule, MatSelectModule, MatTableModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule];


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MATERIAL_MODULES],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  providers: [UserService, TaskListService, SecurityService, ReportsService, provideNativeDateAdapter()]
})
export class ListComponent implements OnInit, AfterViewInit {
public displayedColumns: string[] = ['nombre_y_apellido', 'usuario', 'fecha_creacion', 'estado', 'imagen', 'email', 'rol'];
  public url: string;
  public data: UserResponse[] = [];
  public pageNumber: number = 0;
  public totalRecords: number = 0;
  public pageLength: number = 17;
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
  }

  /*********************************TABLA*********************************************/

  loadTaskList() {

    this.isLoadingResults = true;

    this._userService.getUsers()
      .pipe(
        tap(data => {
          this.data = data;
          this.pageNumber = 1;
          this.totalRecords = data.length;
          this.pageLength = 17;
          this.numberOfPages = 1;
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
          return this._userService.getUsers()
            .pipe(
              catchError(() => observableOf(null))
            );
        }),
        map(data => {
          this.pageNumber = 1;
          this.totalRecords = 10;
          this.pageLength = this.paginator?.pageSize;
          this.numberOfPages = 1;
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = 10;
          return data;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  

}

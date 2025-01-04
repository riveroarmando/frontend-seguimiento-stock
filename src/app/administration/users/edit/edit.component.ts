import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { merge, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { SecurityService } from '../../../services/security.service';
import { UserService } from '../../../services/user.service';
import { ReportsService } from '../../../services/reports.service';
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
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button'

import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { catchError, finalize, tap, throwError } from 'rxjs';
import { TaskListService } from '../../../services/task-list.service';
import { UserInterface } from '../../../interfaces/user.interface';
import { UserResponse } from '../../../interfaces/user.interface';

const MATERIAL_MODULES = [MatButtonModule, MatDatepickerModule, MatSelectModule, MatTableModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule];


@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MATERIAL_MODULES],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  providers: [UserService, TaskListService, SecurityService, ReportsService, provideNativeDateAdapter()]
})
export class EditComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['nombre_y_apellido', 'usuario'];
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
    nombre_y_apellido: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]],
    usuario: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(30)
    ]]
  });

  formEditUser = this._formBuilder.group({
    usuario: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30)
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20)
    ]],
    nombre_y_apellido: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20)
    ]],
    rol: ['', [
      Validators.required,
      Validators.minLength(5),
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
      Validators.minLength(5),
      Validators.maxLength(40)
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


  get nombreYApellidoSeleccionado() {
    return this.formFilter.controls['nombre_y_apellido'];
  }

  get usuarioSeleccionado() {
    return this.formFilter.controls['usuario'];
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
          this.totalRecords = 10;
          this.pageLength = 10;
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

  findUser() {

    console.log(this.startDate.value?.toISOString());
    console.log(this.endDate.value?.toISOString());

    let sDate = this.startDate.value !== null ? this.startDate.value.toISOString() : "";
    let eDate = this.endDate.value !== null ? this.endDate.value.toISOString() : "";

    this.isLoadingResults = true;

    this._userService.getUsers()
      .pipe(
        tap(data => {
          this.data = data;
          this.pageNumber = 1;
          this.totalRecords = 10;
          this.pageLength = this.paginator?.pageSize;
          this.numberOfPages = 1;
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

  get usuario() {
    return this.formEditUser.controls['usuario'];
  }

  get password() {
    return this.formEditUser.controls['password'];
  }

  get nombre_y_apellido() {
    return this.formEditUser.controls['nombre_y_apellido'];
  }
  get rol() {
    return this.formEditUser.controls['rol'];
  }

  get imagen() {
    return this.formEditUser.controls['imagen'];
  }

  get email() {
    return this.formEditUser.controls['email'];
  }


  UpdateUser() {

    let bodydata: UserInterface = {
      usuario: this.usuario.value !== null ? this.usuario.value : '',
      password: this.password.value !== null ? this.password.value : '',
      nombre_y_apellido: this.nombre_y_apellido.value !== null ? this.nombre_y_apellido.value : '',
      rol: this.rol.value !== null ? this.rol.value : '',
      imagen: this.imagen.value !== null ? this.imagen.value : '',
      email: this.email.value !== null ? this.email.value : ''
    };

    console.log(bodydata);
    /*
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
    );*/
  }

  clickedRow(row: UserResponse) {
    //console.log(row);
    this.formEditUser.controls.nombre_y_apellido.setValue(row.nombre_y_apellido);
    this.formEditUser.controls.usuario.setValue(row.usuario);
    this.formEditUser.controls.email.setValue(row.email);
    this.formEditUser.controls.imagen.setValue(row.imagen);
    this.formEditUser.controls.rol.setValue(row.rol);
  }
}

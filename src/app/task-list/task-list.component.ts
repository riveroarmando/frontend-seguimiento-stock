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

/*Angular Material */
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormBuilder } from '@angular/forms';
import { catchError, finalize, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  providers: [UserService, SecurityService, TaskListService]
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private _userService: UserService,
    private _securityService: SecurityService,
    private _taskListService: TaskListService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.url = Global.url;
  }

  ngOnInit(): void {
    //this.cargarTaskList();
  }

  /*********************************TABLA*********************************************/

  /*applyFilter(event: Event) {
    //const filterValue = (event.target as HTMLInputElement).value;
    //this.dataSource.filter = filterValue.trim().toLowerCase();

    //if (this.dataSource.paginator) {
    //  this.dataSource.paginator.firstPage();
    //}
  }*/

  cargarTaskList() {

    this.isLoadingResults = true;

    let bodydata: TaskSearch = {
      cliente: "amex",
      fecha_fin: "",
      fecha_inicio: "",
      producto: "",
      longitud_pagina: this.paginator?.pageSize ?? 50,
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
          alert("Error cargando los datos de Tareas ");
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
            cliente: "imp-tecoespe",
            fecha_fin: "",
            fecha_inicio: "",
            producto: "",
            longitud_pagina: this.paginator?.pageSize,
            numero_pagina: this.paginator?.pageIndex+1
          };
          return this._taskListService.getTasksList(bodydata)
            .pipe(
              catchError(() => observableOf(null))
            );
        }),
        map(data => {
          this.pageNumber = data?.numero_pagina??1;
          this.totalRecords = data?.total_registros??0;
          this.pageLength = this.paginator?.pageSize;
          this.numberOfPages = data?.cantidad_paginas??0;
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
}



/*****************************FIN TABLA*********************************************/


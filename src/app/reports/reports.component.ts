
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HttpClientModule, MatTabsModule, MatDatepickerModule, MatSelectModule, MatTableModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  providers: [UserService, SecurityService, ReportsService, provideNativeDateAdapter()]
})
export class ReportsComponent {

}




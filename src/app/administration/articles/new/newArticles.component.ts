import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { SecurityService } from '../../../services/security.service';
import { VariablesService } from '../../../services/variables.service';
import { ArticlesService } from '../../../services/articles.service';
import { SuppliersService } from '../../../services/suppliers.service';
import { Router } from '@angular/router';
import { SupplierSearch, Proveedores } from '../../../interfaces/suppliers.interface';
import { Articulo, NewArticle } from '../../../interfaces/article.interface';
import { UnidadArticulo } from '../../../interfaces/variables.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { Global } from '../../../services/global';

/*Angular Material */
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Imagen } from '../../../interfaces/client.interface';

const MATERIAL_MODULES = [MatInputModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatButtonModule];


@Component({
  selector: 'app-newArticles',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './newArticles.component.html',
  styleUrl: './newArticles.component.scss'
})
export class NewArticlesComponent implements OnInit {

  //Variables para seleccionar listas
  public selectedProveedor: string = "";
  public selectedUnidad: string = "";

  //String que levantan las listas de los menu desplegables
  public suppliers: Proveedores[] = [];
  public unidades: UnidadArticulo[] = [];

  public isLoadingResults: boolean = true;

  formNewArticle = this._formBuilder.group({
    codigo: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50)
    ]],
    descripcion: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60)
    ]],
    unidad: ['', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50)
    ]],
    proveedores: ['', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(150)
    ]],
    cantidad: [0, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20)
    ]]
  });



  constructor(
    private _articlesService: ArticlesService,
    private _securityService: SecurityService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _suppliersService: SuppliersService,
    private _variablesService: VariablesService
  ) {
    
  }

  get codigo() {
    return this.formNewArticle.controls['codigo'];
  }

  get descripcion() {
    return this.formNewArticle.controls['descripcion'];
  }

  get unidad() {
    return this.formNewArticle.controls['unidad'];
  }
  get proveedores() {
    return this.formNewArticle.controls['proveedores'];
  }

  get cantidad() {
    return this.formNewArticle.controls['cantidad'];
  }

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadUnidades();
  }

  loadSuppliers() {

    let bodydata: SupplierSearch = {
      termino: "",
      longitud_pagina: 10000,
      numero_pagina: 1,
    };

    this._suppliersService.getSuppliers(bodydata)
      .pipe(
        tap(data => {
          this.suppliers = data.proveedores;

        }),
        catchError(err => {
          console.log("Error cargando los Proveedores ", err);
          this._securityService.logout();
          this._router.navigateByUrl("/");
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
  }

  loadUnidades() {

    this._variablesService.getUnidadArticulos()
      .pipe(
        tap(data => {
          this.unidades = data;

        }),
        catchError(err => {
          console.log("Error cargando las Unidades de proveedores ", err);
          this._securityService.logout();
          this._router.navigateByUrl("/");
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
  }

  createNewArticle() {
    let bodydata: NewArticle = {
      codigo: this.codigo.value !== null ? this.codigo.value : '',
      descripcion: this.descripcion.value !== null ? this.descripcion.value : '',
      unidad: this.unidad.value !== null ? this.unidad.value : '',
      cantidad: this.cantidad.value !== null ? this.cantidad.value : 0,
      proveedores: [...this.selectedProveedor],
    };

    this._articlesService.newArticle(bodydata).subscribe(
      {
        next: (resultado) => {
            alert("Articulo creado con exito a las " + new Date());
            this.formNewArticle.reset();
        },
        error: (error) => {
          console.log(error);
          if (error.status == 403 || error.status == 401 || error.status == 500) {

            alert("ERROR al crear el articulo!!!");
          }
        },
        complete: () => console.info('Peticion Completada')
      }
    );
  }
}

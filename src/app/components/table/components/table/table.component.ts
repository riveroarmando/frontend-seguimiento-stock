import { Component, EventEmitter, Input, Output, AfterViewInit, ViewChild, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from '../../models/table-column';
import { TableConfig } from '../../models/table-config';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit, OnInit, DoCheck, OnDestroy {
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<Array<any>> = new MatTableDataSource();
  selection = new SelectionModel<any>(true, []);
  tableColumns: TableColumn[] = [];
  tableConfig: TableConfig | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  checkBoxHabilitados: boolean = true;
  checkBoxHabilitadosEliminarTareas: boolean=false;
  isOperSelected: boolean = false;

  ngOnInit(): void {

  }

  ngDoCheck(): void {

  }

  ngOnDestroy(): void {
  }


  @Input() set data(data: Array<any>) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  @Input() set columns(columns: TableColumn[]) {
    this.tableColumns = columns;
    this.displayedColumns = this.tableColumns.map(col => col.def);
  }

  @Input() set config(config: TableConfig) {
    this.setConfig(config);
  }

  @Input() set habilitarCheckbox(disabled: boolean) {
    this.checkBoxHabilitados = !disabled;
  }

  @Input() set habilitarCheckboxEliminarTareas(disabled: boolean) {
    this.checkBoxHabilitadosEliminarTareas = disabled;
  }

  @Output() select: EventEmitter<any> = new EventEmitter();

  isDisabled(row?: any): boolean {
    /*Para Controlar la que desabilite el checkbox cuando el operador esta asignado */
    //Convierto el dato recibido a Objeto y de esta manera poder utilizar las propiedades de este
    const objRow = new Object(row);
    //Recojo el objeto buscando su propiedades levantando key y value
    for (const [key, value] of Object.entries(objRow)) {
      //Si la key es OPERADOR reviso si tiene valor, si lo tiene devuelvo siempre true porque no debe habilitar el checkbox
      if (key === "OPERADOR") {
        if (value !== "" && !this.checkBoxHabilitadosEliminarTareas) {
          //console.log(key, value);
          return true;
        }
      }
    }
    /********************************************************************************/
    return this.checkBoxHabilitados;
  }

  onSelect() {
    this.select.emit(this.selection.selected);
  }

  setConfig(config: TableConfig) {
    this.tableConfig = config;

    if (this.tableConfig.isSelectable) {
      this.displayedColumns.unshift("select");
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    //console.log("toggleallrows ",this.isAllSelected());
    this.isOperSelected = false;
    if (this.isAllSelected()) {
      this.selection.clear();
      this.onSelect();
      //console.log("Entre en isallselected");
      return;
    }

    //console.log("Peticion para seleccionar todas", this.dataSource.data);
    //console.log(this.dataSource.data.length)
    for (var i = 0; i < this.dataSource.data.length; i++) {
      //Convierto el dato recibido a Objeto y de esta manera poder utilizar las propiedades de este
      var objRow = new Object(this.dataSource.data[i]);
      //const objNew = new MatTableDataSource(data);
      //Recojo el objeto buscando su propiedades levantando key y value
      for (const [key, value] of Object.entries(objRow)) {
        //Si la key es OPERADOR reviso si tiene valor, si lo tiene devuelvo siempre true porque no debe habilitar el checkbox
        if (key === "OPERADOR") {
          if (value === "" && !this.checkBoxHabilitadosEliminarTareas) {
            this.selection.toggle(this.dataSource.data[i]);
            this.isOperSelected = true;
            this.onSelect();
          }
        }
      }
      /********************************************************************************/
    }

    if (!this.isOperSelected) {
      this.selection.select(...this.dataSource.data);
      this.onSelect();
    }

  }

  isOperatorFree(row: any): boolean {
    //selection.isSelected(row)
    //Convierto el dato recibido a Objeto y de esta manera poder utilizar las propiedades de este
    const objRow = new Object(row);
    //Recojo el objeto buscando su propiedades levantando key y value
    for (const [key, value] of Object.entries(objRow)) {
      //Si la key es OPERADOR reviso si tiene valor, si lo tiene devuelvo siempre true porque no debe habilitar el checkbox
      if (key === "OPERADOR") {
        if (value !== "" && !this.checkBoxHabilitadosEliminarTareas) {
          return false;
        }
      }
    }
    /********************************************************************************/
    return this.selection.isSelected(row)
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {

    //Reviso si el la linea de encabezado, si es encabezado ingreso
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    //Convierto el dato recibido a Objeto y de esta manera poder utilizar las propiedades de este
    const objRow = new Object(row);
    //Recojo el objeto buscando su propiedades levantando key y value
    for (const [key, value] of Object.entries(objRow)) {
      //Si la key es OPERADOR reviso si tiene valor, si lo tiene devuelvo siempre true porque no debe habilitar el checkbox
      if (key === "OPERADOR") {
        if (value !== "") {
          //Si esta asiganado a un operador desabilito la seleccion
          return `${this.selection.isSelected(row) ? 'select' : 'deselect'} row ${row.position + 1}`;
        }
      }
    }
    /********************************************************************************/
    //Si no esta asignado a un operador habilito la seleccion
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

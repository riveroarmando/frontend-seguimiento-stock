import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableColumn } from '../models/table-column';


@Pipe({
  name: 'columnValue'
})
export class ColumnValuePipe implements PipeTransform {

  transform(row: any, column: TableColumn): unknown {
    var displayValue = row[column.datakey];
    
    if (displayValue === undefined) {
      const arrayKeys = column.datakey.split('.');
       displayValue = row[arrayKeys[0]][arrayKeys[1]];
    }
    
    switch (column.dataType) {
      case 'date':
        if (column.formatt !== undefined) {
          displayValue = new DatePipe('en').transform(
            displayValue,
            column.formatt
          );
        }
        break;
      case 'object':
        const arrayKeys = column.datakey.split('.');
        let currentValue: any;

        arrayKeys.forEach((key: any )  => {
          if (currentValue === undefined) {
            currentValue = row[key];
            return;
          }
          currentValue = currentValue[key];
        });

        displayValue = currentValue;
        break;

      default:
        break;
    }

    return displayValue;
  }

}



import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Mstc } from 'src/app/model/mstc';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.scss'],
})
export class MatTableComponent implements AfterViewInit, OnChanges {
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @Input() tableData: Mstc[];
  //@Input() displayGroup: boolean;

  displayedColumns: Array<keyof Mstc> = [
    'NAME',
    'YEAR_MONTH',
    'GROUP_CODE',
    'INDEX_NUM',
    'ITEM_DESC',
    'STACK_NUM',
    'CASE_PACK',
    'QTY_OPENING_CASES',
    'QTY_OPENING_UNITS',
    'QTY_RECEIVED_CASES',
    'QTY_RECEIVED_UNITS',
    'QTY_SOLD_CASES',
    'QTY_SOLD_UNITS',
    'QTY_OTHER_ISS_CASES',
    'QTY_OTHER_ISS_UNITS',
    'QTY_STOCKED_CASES',
    'QTY_STOCKED_UNITS',
    'QTY_DENIED_CASES',
    'QTY_DENIED_UNITS',
  ];

  displayNames: { [key: string]: string } = {
    NAME: 'Name',
    YEAR_MONTH: 'year Month',
    GROUP_CODE: 'Group Code',
    INDEX_NUM: 'Index Number',
    ITEM_DESC: 'Item Desc',
    STACK_NUM: 'Stack No.',
    CASE_PACK: 'Case Pack',
    QTY_OPENING_CASES: 'Opening Cases',
    QTY_OPENING_UNITS: 'Opening Units',
    QTY_RECEIVED_CASES: 'Received Cases',
    QTY_RECEIVED_UNITS: 'Received Units',
    QTY_SOLD_CASES: 'Sold Cases',
    QTY_SOLD_UNITS: 'Sold Units',
    QTY_OTHER_ISS_CASES: 'Other Issue Cases',
    QTY_OTHER_ISS_UNITS: 'Other Issue Units',
    QTY_STOCKED_CASES: 'Stocked Cases (closed)',
    QTY_STOCKED_UNITS: 'Stocked Units (closed)',
    QTY_DENIED_CASES: 'Denied Cases',
    QTY_DENIED_UNITS: 'Denied Units',
  };

  totalParams: Array<keyof Mstc> = [
    'QTY_OPENING_CASES',
    'QTY_OPENING_UNITS',
    'QTY_RECEIVED_CASES',
    'QTY_RECEIVED_UNITS',
    'QTY_SOLD_CASES',
    'QTY_SOLD_UNITS',
    'QTY_OTHER_ISS_CASES',
    'QTY_OTHER_ISS_UNITS',
    'QTY_STOCKED_CASES',
    'QTY_STOCKED_UNITS',
    'QTY_DENIED_CASES',
    'QTY_DENIED_UNITS',
  ];

  dataSource: MatTableDataSource<Mstc>;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.tableData) {
      this.setDatasource(this.tableData);
    }
    // if (changes && changes.displayGroup.currentValue) {
    //   if(changes.displayGroup.currentValue){

    //   } else{

    //   }
    // }
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.setFilterPredictate();
    }
  }

  setDatasource(tableData: Mstc[]) {
    this.dataSource = new MatTableDataSource<Mstc>(tableData);
  }

  setFilterPredictate() {
    this.dataSource.filterPredicate = (data: Mstc, filter: string): boolean => {
      const filterArray = filter.split('||');
      const columnName = filterArray[0];
      const filterKey = filterArray[1];
      if (data[columnName as keyof Mstc]) {
        return data[columnName as keyof Mstc]
          .toString()
          .toLowerCase()
          .includes(filterKey);
      } else {
        return false;
      }
    };
  }

  getTotal(param: keyof Mstc): number {
    if (this.totalParams.indexOf(param) === -1) {
      return null;
    }

    let data: Mstc[];
    if (this.dataSource && this.dataSource.filteredData) {
      data = this.dataSource.filteredData;
    } else if (this.dataSource && this.dataSource.data) {
      data = this.dataSource.data;
    }
    if (data) {
      return data
        .map((t: Mstc) => t[param] as number)
        .reduce((acc, value) => acc + value, 0);
    }
    return null;
  }

  applyFilter(event: Event, column: string) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim().toLowerCase();
    filterValue = column + '||' + filterValue;
    this.dataSource.filter = filterValue;
  }
}

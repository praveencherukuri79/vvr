import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
//import { ISearchFilter } from 'src/app/interface/searchFilter';
import { Mstc } from 'src/app/model/mstc';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';
//import { jsPDF } from 'jspdf';
import jsPDF, { jsPDFOptions } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatPaginator } from '@angular/material/paginator';
import { SpinnerService } from '@app/service/spinner.service';
//import { HeaderFooterService } from '@app/service/header-footer/header-footer.service';
import { CurrencyPipe } from '@angular/common';
import { utils as xlsxUtils, writeFileXLSX, writeFile } from 'xlsx';
import { DownLoadType } from '@app/model/downlaod';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
//import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.scss']
})
export class MatTableComponent implements AfterViewInit, OnChanges, OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  //@ViewChildren('matInputSearch') matInputSearch: QueryList<MatInput>;

  @Input() tableData: Mstc[];
  //@Input() displayGroup: boolean;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild('indexInput', { static: true }) indexInput: ElementRef<HTMLInputElement>;
  @ViewChild('nameInput', { static: true }) nameInput: ElementRef<HTMLInputElement>;

  allIndexList: Array<string> = [];
  allNameList: Array<string> = [];

  SelectedIndexes: Array<string> = [];
  SelectedNames: Array<string> = [];

  filterForm: FormGroup;

  filteredIndex: Observable<string[]>;
  filteredName: Observable<string[]>;

  displayedColumns: Array<keyof Mstc> = [
    'NAME',
    'YEAR_MONTH',
    'GROUP_CODE',
    'INDEX_NUM',
    'ITEM_DESC',
    //'STACK_NUM',
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
    'RATE',
    'TOTAL_AMOUNT'
  ];

  // printColumns: Array<keyof Mstc> = [
  //   'NAME',
  //   'INDEX_NUM',
  //   'ITEM_DESC',
  //   'CASE_PACK',
  //   'QTY_OPENING_CASES',
  //   'QTY_OPENING_UNITS',
  //   'QTY_RECEIVED_CASES',
  //   'QTY_RECEIVED_UNITS',
  //   'QTY_SOLD_CASES',
  //   'QTY_SOLD_UNITS'
  // ];

  printColumnHeaders: Array<{ [key: string]: keyof Mstc }> = [
    { Name: 'NAME' },
    { 'Year Month': 'YEAR_MONTH' },
    { 'Group Code': 'GROUP_CODE' },
    { 'Index Number': 'INDEX_NUM' },
    { 'Item Desc': 'ITEM_DESC' },
    { 'Case Pack': 'CASE_PACK' },
    { 'Opening Cases': 'QTY_OPENING_CASES' },
    { 'Opening Units': 'QTY_OPENING_UNITS' },
    { 'Received Cases': 'QTY_RECEIVED_CASES' },
    { 'Received Units': 'QTY_RECEIVED_UNITS' },
    { 'Sold Cases': 'QTY_SOLD_CASES' },
    { 'Sold Units': 'QTY_SOLD_UNITS' },
    { 'Other Issue Cases': 'QTY_OTHER_ISS_CASES' },
    { 'Other Issue Units': 'QTY_OTHER_ISS_UNITS' },
    { 'Stocked Cases (closed)': 'QTY_STOCKED_CASES' },
    { 'Stocked Units (closed)': 'QTY_STOCKED_UNITS' },
    { 'Denied Cases': 'QTY_DENIED_CASES' },
    { 'Denied Units': 'QTY_DENIED_UNITS' },
    { Rate: 'RATE' },
    { 'Total Amount': 'TOTAL_AMOUNT' }
  ];

  displayNames: { [key: string]: string } = {
    NAME: 'Name',
    YEAR_MONTH: 'Year Month',
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
    RATE: 'Rate',
    TOTAL_AMOUNT: 'Total Amount'
  };

  nonDefaultColumns = ['NAME', 'YEAR_MONTH', 'GROUP_CODE', 'ITEM_DESC'];

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
    'TOTAL_AMOUNT'
  ];

  currencyFields = ['RATE', 'TOTAL_AMOUNT'];

  @Input()
  headerFooterData: Array<{ [key: string]: string }>;

  @Input()
  indexRateData: Array<{ INDEX_NUM: number; rate: number }>;

  dataSource: MatTableDataSource<Mstc> = new MatTableDataSource<Mstc>();

  invoiceHeader: string;
  invoiceFooter: string;

  inputForm: FormGroup;
  //invoiceTest = "To,\nThe manager,\nsiyaram ltd,\nhyd-12345\n\ndear sir,\n\nSUb: jddjn jjjjj euhdeuhe edeedne njenedjuejn nxjednxeujnhuuejdneude.\n".split("\n");

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private spinnerService: SpinnerService,
    private changeDetection: ChangeDetectorRef,
    private currencyPipe: CurrencyPipe //private headerFooterService: HeaderFooterService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.tableData) {
      this.initFilterData();
    }
  }

  ngOnInit(): void {
    console.log('mat on in it', Date.now());

    this.filterForm = this.formBuilder.group({
      indexCtrl: [null],
      nameCtrl: [null]
    });

    this.filteredIndex = this.filterForm.get('indexCtrl').valueChanges.pipe(
      startWith(null),
      map((index: string | null) =>
        index
          ? this.searchFilter(index, this.allIndexList, this.SelectedIndexes)
          : this.allIndexList.slice().filter((item) => this.SelectedIndexes.indexOf(item) == -1)
      )
    );

    this.filteredName = this.filterForm.get('nameCtrl').valueChanges.pipe(
      startWith(null),
      map((index: string | null) =>
        index
          ? this.searchFilter(index, this.allNameList, this.SelectedNames)
          : this.allNameList.slice().filter((item) => this.SelectedNames.indexOf(item) == -1)
      )
    );
  }

  searchFilter(value: string, list: string[], selectedList: string[]): string[] {
    const filterValue = value.toLowerCase();
    return list.filter((item) => item.toLowerCase().includes(filterValue) && selectedList.indexOf(item) == -1);
  }

  remove(item: string, filterType: string): void {
    if (filterType == 'index') {
      const index = this.SelectedIndexes.indexOf(item);
      if (index >= 0) {
        this.SelectedIndexes.splice(index, 1);
      }
    } else if (filterType == 'name') {
      const index = this.SelectedNames.indexOf(item);
      if (index >= 0) {
        this.SelectedNames.splice(index, 1);
      }
    }
    this.onSelectFilter();
  }

  selected(event: MatAutocompleteSelectedEvent, filterType: string): void {
    const value = event.option.viewValue;
    if (filterType == 'index') {
      if (this.SelectedIndexes.indexOf(value) === -1) {
        this.SelectedIndexes.push(value);
      }
      this.indexInput.nativeElement.value = '';
      this.filterForm.get('indexCtrl').setValue(null);
    } else if (filterType == 'name') {
      if (this.SelectedNames.indexOf(value) === -1) {
        this.SelectedNames.push(value);
      }
      this.nameInput.nativeElement.value = '';
      this.filterForm.get('nameCtrl').setValue(null);
    }

    this.onSelectFilter();
  }

  onSelectFilter() {
    const filterObj = { index: this.SelectedIndexes, name: this.SelectedNames };
    this.dataSource.filter = JSON.stringify(filterObj);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setFilterPredictate() {
    this.dataSource.filterPredicate = (data: Mstc, filter: string): boolean => {
      const filterObj: { index: string[]; name: string[] } = JSON.parse(filter);
      let returnVal = false;

      if (!filterObj.index.length && !filterObj.name.length) {
        // both empty return true
        returnVal = true;
      } else if (filterObj.index.length && filterObj.name.length) {
        // both exist filter with OR
        if (filterObj.index.indexOf(data['INDEX_NUM'].toString()) !== -1 || filterObj.name.indexOf(data['NAME']) !== -1) {
          returnVal = true;
        }
      } else {
        if (filterObj.index.length && filterObj.index.indexOf(data['INDEX_NUM'].toString()) !== -1) {
          returnVal = true;
        }
        if (filterObj.name.length && filterObj.name.indexOf(data['NAME']) !== -1) {
          returnVal = true;
        }
      }
      return returnVal;
    };
  }

  initFilterData() {
    this.allIndexList = this.tableData.map((item) => item['INDEX_NUM'].toString()).filter(this.onlyUnique);
    this.allNameList = this.tableData.map((item) => item['NAME']).filter(this.onlyUnique);
  }

  onlyUnique(value: string, index: number, self: Array<any>): boolean {
    return self.indexOf(value) === index;
  }

  ngAfterViewInit(): void {
    console.log('mat after view', Date.now());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setFilterPredictate();
    this.setDatasource(this.tableData);
    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();
    this.spinnerService.spin$.next(false);
  }

  setDatasource(tableData: Mstc[], reset: boolean = false) {
    if (reset) {
      this.dataSource = new MatTableDataSource<Mstc>(tableData);
    } else {
      this.dataSource.data = tableData;
    }
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
      return data.map((t: Mstc) => t[param] as number).reduce((acc, value) => acc + value, 0);
    }
    return null;
  }

  trackBy(index: number, item: Mstc) {
    return item._id;
  }

  getDefaultCompany(): string {
    let companyName: string;
    if (this.dataSource.filteredData && this.dataSource.filteredData.length) {
      companyName = this.dataSource.filteredData[0].NAME;
    }

    return companyName;
  }

  getXlsxTotObj(selectedColumns) {
    let totArr = {};
    selectedColumns.forEach((col, index) => {
      let val = null;
      if (this.totalParams.indexOf(col) === -1) {
        val = null;
      } else {
        val = this.getTotal(col);
      }
      if (index == 0 && this.totalParams.indexOf(col) === -1) {
        val = 'Total';
      }
      //totArr[col] = val;
      totArr[this.displayNames[col]] = val;
    });
    return totArr;
  }

  savePdfModal() {
    const dialogRef = this.dialog.open(InvoiceDialogComponent, {
      height: '85vh',
      width: '60vw',
      data: {
        displayNames: this.displayNames,
        displayedColumns: this.displayedColumns,
        nonDefaultColumns: this.nonDefaultColumns,
        headerFooterData: this.headerFooterData,
        defaultCompanyName: this.getDefaultCompany()
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        console.log('form data => ', result);
        this.invoiceHeader = result.header ? result.header : null;
        this.invoiceFooter = result.footer ? result.footer : null;
        setTimeout(() => {
          //window.print();
          if (result.downLoadType == DownLoadType.print || result.downLoadType == DownLoadType.pdf) {
            this.savePdf(result.downLoadType, result.selectedColumns, result.invoiceName);
          } else if (result.downLoadType == DownLoadType.csv || result.downLoadType == DownLoadType.excel) {
            this.saveXlsx(result.downLoadType, result.selectedColumns, result.invoiceName);
          }
        }, 200);
      }
    });
  }

  saveXlsx(downLoadType: DownLoadType, selectedColumns: Array<keyof Mstc>, invoiceName: string = 'Invoice') {
    const data = this.dataSource.filteredData.map((obj) =>
      // Object.fromEntries(selectedColumns.map((header) => [header, obj[header]]))
      Object.fromEntries(selectedColumns.map((header) => [this.displayNames[header], obj[header]]))
    );
    const totRow = this.getXlsxTotObj(selectedColumns);
    data.push(totRow);

    //disp names
    const selectedDisplayNames = [];
    selectedColumns.forEach((item) => {
      selectedDisplayNames.push(this.displayNames[item]);
    });

    // empty sheet
    const worksheet = xlsxUtils.json_to_sheet([]);

    const header: Array<string[]> = this.invoiceHeader.split('\n').map((item) => [item]);
    const footer: Array<string[]> = this.invoiceFooter.split('\n').map((item) => [item]);

    // header
    xlsxUtils.sheet_add_aoa(worksheet, header, { origin: `A2` });

    // table
    xlsxUtils.sheet_add_json(worksheet, data, { header: selectedDisplayNames, origin: `A${header.length + 4}` });

    //footer
    xlsxUtils.sheet_add_aoa(worksheet, [[''], ['']], { origin: -1 });
    xlsxUtils.sheet_add_aoa(worksheet, footer, { origin: -1 });

    const workbook = xlsxUtils.book_new();
    xlsxUtils.book_append_sheet(workbook, worksheet, 'Invoice');

    if (downLoadType == DownLoadType.excel) {
      writeFileXLSX(workbook, `${invoiceName}.xlsx`);
    } else if (downLoadType == DownLoadType.csv) {
      writeFile(workbook, `${invoiceName}.csv`);
    }
  }

  savePdf(downLoadType: DownLoadType, selectedColumns: Array<keyof Mstc>, invoiceName: string = 'Invoice') {
    let orientation: jsPDFOptions['orientation'] = 'portrait';
    const fillColor = '#1b7056';
    const currentDate = new Date().toLocaleDateString();
    const selectedColumnHeaders = [];
    let includeNonDefault: boolean;

    for (let col of selectedColumns) {
      if (this.nonDefaultColumns.indexOf(col) !== -1) {
        includeNonDefault = true;
        orientation = 'landscape';
        break;
      }
    }

    if (selectedColumns.length > 14) {
      orientation = 'landscape';
    }

    this.printColumnHeaders.forEach((item: { [key: string]: keyof Mstc }) => {
      const key = Object.keys(item)[0];
      if (selectedColumns.indexOf(item[key]) !== -1) {
        selectedColumnHeaders.push(item);
      }
    });
    //let orientation = jsPDFOptions.orientation

    let doc = new jsPDF(orientation);

    const head = [];
    const columnNames = [];
    selectedColumnHeaders.forEach((item) => {
      let headerName = Object.keys(item)[0];
      headerName = headerName.replaceAll(' ', '\n');
      head.push(headerName);
      columnNames.push(Object.values(item)[0]);
    });

    let data = [];
    //const displayedColumns = ['NAme', 'approved', 'utilised', 'available', 'asd', 'sadadasada', 'asdas'];

    this.dataSource.filteredData.forEach((obj) => {
      let arr = [];
      columnNames.forEach((col) => {
        arr.push(obj[col]);
        // if (this.currencyFields.indexOf(col) !== -1) {
        //   arr.push(this.currencyPipe.transform(obj[col], 'INR'));
        // } else {
        //   arr.push(obj[col]);
        // }
      });
      data.push(arr);
    });

    let totArr = [];
    columnNames.forEach((col, index) => {
      let val = null;
      if (this.totalParams.indexOf(col) === -1) {
        val = null;
      } else {
        val = this.getTotal(col);
        // if (this.currencyFields.indexOf(col) !== -1) {
        //   val = this.currencyPipe.transform(this.getTotal(col), 'INR');
        // } else {
        //   val = this.getTotal(col);
        // }
      }
      //
      if (index == 0 && this.totalParams.indexOf(col) === -1) {
        val = 'Total';
      }
      totArr.push(val);
    });

    /// start page
    autoTable(doc, {
      body: [
        [
          {
            content: '',
            styles: {
              halign: 'right',
              minCellWidth: 10,
              minCellHeight: 10,
              cellWidth: 20
              //fontSize: 20,
              //textColor: '#ffffff'
            }
          }
        ]
      ],
      theme: 'plain',
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 0 && data.row.index === 0) {
          var base64Img = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABYJJREFUWEfFV2lMVFcYPffNe7Mxw4AoRkEH69ZUU4ot0iq4QEQk0bqgiK1Ng8alVmNbtVtIf9RYNbapNtYNTGutC7Y1qEjdUFxI3aPVWHHBKbgVgdkHZnm3efcxwyCi1NDM+/fe/ZbznXu+795H0M7nhQ11BpFDJiUkFRATCEgcgIgmdzMFvQNwFwmlpZyI/bdnd7K0JzR5llHMxpp+PMd9TChyQIjmWfZsnVIXJdjuFcUVd2d1qXiaT5sAYgupRmEzf0koFgBUaFfiVkbEQwnW+PQRedVTiOtJMZ4IIHb9P30VCn43IRjwfIlbelGKqz6fd0L1nOgbj8drBcC4oWYQFIoDBOjcEcn9MSjwCD7faNPsLheC47YAwCrn+fKOTh4Mwuf1DglmIgCA7bml/mxH0d4We2w7DJGJfk0EABgL6lcRSj/qSNrbBEHI16YZkYukdQZAajWB4688v9r/K2zi8YjegVKLMgDG/NoCApL7pDB6JcGongJK7njg8tJWJioFkNlLiWNVHtQ3tl5vkwXQzaaZUTOIPOHo/a5hCs2EPkqU3HHDZBUDftn9lVieHIZvLrjQ4AXK73lwtdYXWB8WI+DHDB02Xm7AV2flVpeqSojmkRCtQJSag1ukqLSIKKv2wOwHSamLE0k3ErepLgcE21J7CChI1+H8Qy+y9tkCCeLCORydbMBBkxupPZR46BQxrNACsalYpQK4/m4kdlxvxKcnnUjsymPpUC1sbop9lW7UOEVEazlk9VWhZziHRWUOHDB55PgU04gxv34TAZ0pve95U4+BUTzit5pZAOmJ1XE4kW3Ah2UOZMQJSDcqkf6rFTfMMgs8ASpyI7HqnIuB/2mMDvl/NmLlORfWpoZhSHcBGb9ZWOW/TwxHZw2HxG1mxiYFySfG/NpzBORVKVhekga5A9XI3G3FtTo5QUoMjy0Zelb1KKOAvCQtZhy0o7RKrqK3gcPhLAOyi234bLAGPfQckrZbEK3hcGqqAUf+9mDmITuzXT0iDON6K1msKpsICnqexOXXPQIQJRnkDlAh73UtC3bmgZc5fZKowdDuPMYW2RgD69J0WHjMgaJbbrb+zksqzItXY8gOCy5Nj8Btiw/jimwYHSdgfZoOK8+6sO5yAzgCHJ4UDjVPkLLTAp9McK0EQMqkkN6m9FNiRUoYphbbcPqBl9F7PNuAby+4UFjhDrAhbcfumzKAonF6xsbqiw0oGKVDUjceidssmBuvxvxX1JheYoPJJuKDQWq2fbMO2VF+Xy4OgK8FgMn9lFiZEoaJe2y4WOOF9P5evJrtuUcEY2LrGD3eL3WguNKN5Bge343UYUShBRY3hcDJmqm0iticrsOIWAGDt5tRPD4cN80ilpxw4K69ucP8AAJbkNNfhWXJWqT90iyaxccdKKuWEQ+PFfDDaB3eLrExwe0dH478Kw3YeV1mI/g5M80Ah4di5C4rFr+mwdT+SgwvtMLuaTEraluI0K+BN3ZYmGAu1Xix7EzzMT4mTsD3aTqMLbJi7stq1orzjzpaJe+q5fBHjgF7b7mx4JgDfSI4HJpkwNLTThRcaQzYMxEGt+HCQRosSFDjrk3EyXsefH7KGeh3WSMqrEjRosrmQ0W9iHmldjQ2z6RA4MxeAtam6lok3D8hHDqBYOSugADlNvQPIslb2m+J5p//asSeJpUHlzeprxJvvahiApRs/MPocQqWJ2vRJ0KBOUfseOSSKZcYW5KowRflTmy51sSCNIj8o7jd971WhLfvQyc1wZEsAzQ8mIgPm9zyKJbcn3YYtS98+6x6GTgkdxdw0OTBA6dPPowk15Afx4yFUF5IJAAhv5IxEKG8lPplFNJruR9ESH9MAiBC+WsW3NUh+zl9fLT8X7/n/wLnuamd9FWpPgAAAABJRU5ErkJggg==`;
          doc.addImage(base64Img, data.cell.x, data.cell.y, 10, 10);
        }
      }
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'VVR',
            styles: {
              halign: 'right',
              fontSize: 14
              //textColor: '#ffffff'
            }
          }
        ],
        [
          {
            content: 'Invoice',
            styles: {
              halign: 'right',
              fontSize: 14
              //textColor: '#ffffff'
            }
          }
        ],
        [
          {
            content: `Date - ${currentDate}`,
            styles: {
              halign: 'right',
              fontSize: 14
              //textColor: '#ffffff'
            }
          }
        ]
      ],
      theme: 'plain',
      didDrawPage: (data) => {
        doc.line(14, data.cursor.y + 2, data.cursor.x, data.cursor.y + 2);
      }
    });

    if (this.invoiceHeader) {
      autoTable(doc, {
        body: [
          [
            {
              content: this.invoiceHeader,
              styles: {
                halign: 'left',
                fontSize: 14
              }
            }
          ]
        ],
        theme: 'plain'
      });
    }

    autoTable(doc, {
      //columnStyles: { europe: { halign: 'center' } }, // European countries centered
      head: [head],
      body: data,
      foot: [totArr],
      tableWidth: 'auto',
      showFoot: 'lastPage',
      headStyles: {
        overflow: 'linebreak',
        cellWidth: 'auto',
        minCellWidth: 10,
        fillColor: fillColor,
        cellPadding: {
          top: 10,
          right: 4,
          bottom: 10,
          left: 4,
          horizontal: 0,
          vertical: 0
        }
      },
      footStyles: {
        fillColor: fillColor
      },
      styles: {
        overflow: 'linebreak'
      },
      theme: 'striped',
      columns: selectedColumnHeaders
    });

    if (this.invoiceFooter) {
      autoTable(doc, {
        body: [
          [
            {
              content: this.invoiceFooter,
              styles: {
                halign: 'left',
                fontSize: 14
              }
            }
          ]
        ],
        theme: 'plain'
      });
    }

    if (downLoadType == DownLoadType.print) {
      doc.autoPrint();
      doc.output('dataurlnewwindow');
    } else if (downLoadType == DownLoadType.pdf) {
      doc.save(invoiceName);
    }
  }
}

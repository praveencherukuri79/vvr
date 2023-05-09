import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MstcService } from '@app/service/mstc-service/mstc.service';
import { NotifierService } from '@app/service/notification-service/notification.service';
import { SpinnerService } from '@app/service/spinner.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-manage-file',
  templateUrl: './manage-file.component.html',
  styleUrls: ['./manage-file.component.scss']
})
export class ManageFileComponent {
  displayedColumns: Array<string> = ['name', 'delete'];
  displayNames: { [key: string]: string } = {
    name: 'Report Name',
    delete: 'Delete'
  };

  allNameList: Array<string> = [];
  reportList: Array<string>;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private spinnerService: SpinnerService,
    private mstcService: MstcService,
    private notifierService: NotifierService,
    private changeDetection: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getReportList();
  }

  getReportList() {
    this.spinnerService.spin$.next(true);
    this.mstcService.getMstcReportList().subscribe({
      next: (res) => {
        this.spinnerService.spin$.next(false);
        this.reportList = res;
        this.initFilterData(this.reportList);
        this.setDatasource(this.reportList);
        console.log('reports => ', res);
      },
      error: (e) => {
        this.spinnerService.spin$.next(false);
        this.notifierService.showNotification(`Error occured while retirving reports data`, 'close', 'error', 3000);
      }
    });
  }

  deleteFileConfirmation(file: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      //height: '35vh',
      //width: '60vw',
      data: {
        heading: 'File Delete Confirmation',
        content: `You are about to delete the file "${file.reportName}" from database. Please confirm.`,
        continueLabel: 'Delete',
        closeLabel: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteFile(file);
      }
    });
  }

  deleteFile(file: any) {
    this.spinnerService.spin$.next(true);
    this.mstcService.deleteFile(file).subscribe({
      next: (data: any) => {
        //this.spinnerService.spin$.next(false);
        this.notifierService.showNotification(`File Deletion is success for ${file.reportName}`, 'close', 'success');
        console.log(`deleted file => `, data);
        this.getReportList();
      },
      error: (e) => {
        this.spinnerService.spin$.next(false);
        console.log('Error in delete user ', e);
        this.notifierService.showNotification(`Error in Delete File ${file.reportName} , ${e.error.message}`, 'close', 'error');
      }
    });
  }

  trackBy(index: number, item: any) {
    return item._id;
  }

  ngAfterViewInit(): void {
    console.log('mat after view', Date.now());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setFilterPredictate();
    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();
  }

  filterEmitter(data) {
    this.onSelectFilter(data);
  }

  // filterEmitter(data, filterType: string) {
  //   if (filterType == 'email') {
  //     this.SelectedEmails = data;
  //   } else if (filterType == 'name') {
  //     this.SelectedNames = data;
  //   }

  //   this.onSelectFilter();
  // }

  onSelectFilter(filterValue) {
    //this.dataSource.filter = filterValue.trim().toLowerCase();
    //const filterObj = { email: this.SelectedEmails, name: this.SelectedNames };
    this.dataSource.filter = JSON.stringify(filterValue);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setDatasource(tableData: any[], reset: boolean = false) {
    if (reset) {
      this.dataSource = new MatTableDataSource<any>(tableData);
    } else {
      this.dataSource.data = tableData;
    }
  }

  initFilterData(tableData) {
    this.allNameList = tableData.map((item) => item['reportName']).filter(this.onlyUnique);
  }

  onlyUnique(value: string, index: number, self: Array<any>): boolean {
    return self.indexOf(value) === index;
  }

  setFilterPredictate() {
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const filterObj: string[] = JSON.parse(filter);
      let returnVal = false;
      if (!filterObj.length) {
        returnVal = true;
      } else if (filterObj.length && filterObj.indexOf(data['reportName']) !== -1) {
        returnVal = true;
      }
      return returnVal;
    };
  }
}

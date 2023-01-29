import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/service/auth-service/auth.service';
import { NotifierService } from '@app/service/notification-service/notification.service';
import { SpinnerService } from '@app/service/spinner.service';
import { map, Observable, startWith } from 'rxjs';

interface User {
  name?: string;
  email?: string;
  approve?: boolean;
  delete?: boolean;
  _id?: string;
}

@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.scss']
})
export class UserPortalComponent implements OnInit {
  allusers: User[];

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: Array<string> = ['name', 'email', 'approve', 'delete'];

  displayNames: { [key: string]: string } = {
    name: 'Name',
    email: 'Email',
    approve: 'Admin Approval',
    delete: 'Delete'
  };

  //Filter
  @ViewChild('emailInput', { static: true }) emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('nameInput', { static: true }) nameInput: ElementRef<HTMLInputElement>;

  allEmailList: Array<string> = [];
  allNameList: Array<string> = [];

  SelectedEmails: Array<string> = [];
  SelectedNames: Array<string> = [];

  // filterForm: FormGroup;

  // filteredEmail: Observable<string[]>;
  // filteredName: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notifierService: NotifierService,
    private spinnerService: SpinnerService,
    private changeDetection: ChangeDetectorRef
  ) {}

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes && changes.allusers && changes.allusers.currentValue) {
  //     this.initFilterData(this.allusers);
  //   }
  // }

  ngOnInit() {
    this.getAllUsers();

    //   this.filterForm = this.formBuilder.group({
    //     emailCtrl: [null],
    //     nameCtrl: [null]
    //   });

    //   this.filteredEmail = this.filterForm.get('emailCtrl').valueChanges.pipe(
    //     startWith(null),
    //     map((email: string | null) =>
    //       email
    //         ? this.searchFilter(email, this.allEmailList, this.SelectedEmails)
    //         : this.allEmailList.slice().filter((item) => this.SelectedEmails.indexOf(item) == -1)
    //     )
    //   );

    //   this.filteredName = this.filterForm.get('nameCtrl').valueChanges.pipe(
    //     startWith(null),
    //     map((name: string | null) =>
    //       name
    //         ? this.searchFilter(name, this.allNameList, this.SelectedNames)
    //         : this.allNameList.slice().filter((item) => this.SelectedNames.indexOf(item) == -1)
    //     )
    //   );
  }

  ngAfterViewInit(): void {
    console.log('mat after view', Date.now());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setFilterPredictate();
    //this.setDatasource(this.allusers);
    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();
    //this.spinnerService.spin$.next(false);
  }

  // searchFilter(value: string, list: string[], selectedList: string[]): string[] {
  //   const filterValue = value.toLowerCase();
  //   return list.filter((item) => item.toLowerCase().includes(filterValue) && selectedList.indexOf(item) == -1);
  // }

  // remove(item: string, filterType: string): void {
  //   if (filterType == 'email') {
  //     const index = this.SelectedEmails.indexOf(item);
  //     if (index >= 0) {
  //       this.SelectedEmails.splice(index, 1);
  //     }
  //     this.emailInput.nativeElement.value = '';
  //     this.filterForm.get('emailCtrl').setValue(null);
  //   } else if (filterType == 'name') {
  //     const index = this.SelectedNames.indexOf(item);
  //     if (index >= 0) {
  //       this.SelectedNames.splice(index, 1);
  //     }
  //     this.nameInput.nativeElement.value = '';
  //     this.filterForm.get('nameCtrl').setValue(null);
  //   }
  //   this.onSelectFilter();
  // }

  // selected(event: MatAutocompleteSelectedEvent, filterType: string): void {
  //   const value = event.option.viewValue;
  //   if (filterType == 'email') {
  //     if (this.SelectedEmails.indexOf(value) === -1) {
  //       this.SelectedEmails.push(value);
  //     }
  //     this.emailInput.nativeElement.value = '';
  //     this.filterForm.get('emailCtrl').setValue(null);
  //   } else if (filterType == 'name') {
  //     if (this.SelectedNames.indexOf(value) === -1) {
  //       this.SelectedNames.push(value);
  //     }
  //     this.nameInput.nativeElement.value = '';
  //     this.filterForm.get('nameCtrl').setValue(null);
  //   }

  //   this.onSelectFilter();
  // }

  filterEmitter(data, filterType: string) {
    if (filterType == 'email') {
      this.SelectedEmails = data;
    } else if (filterType == 'name') {
      this.SelectedNames = data;
    }

    this.onSelectFilter();
  }

  onSelectFilter() {
    const filterObj = { email: this.SelectedEmails, name: this.SelectedNames };
    this.dataSource.filter = JSON.stringify(filterObj);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setDatasource(tableData: User[], reset: boolean = false) {
    if (reset) {
      this.dataSource = new MatTableDataSource<User>(tableData);
    } else {
      this.dataSource.data = tableData;
    }
  }

  setFilterPredictate() {
    this.dataSource.filterPredicate = (data: User, filter: string): boolean => {
      const filterObj: { email: string[]; name: string[] } = JSON.parse(filter);
      let returnVal = false;

      if (!filterObj.email.length && !filterObj.name.length) {
        // both empty return true
        returnVal = true;
      } else if (filterObj.email.length && filterObj.name.length) {
        // both exist filter with OR
        if (filterObj.email.indexOf(data['email']) !== -1 || filterObj.name.indexOf(data['name']) !== -1) {
          returnVal = true;
        }
      } else {
        if (filterObj.email.length && filterObj.email.indexOf(data['email']) !== -1) {
          returnVal = true;
        }
        if (filterObj.name.length && filterObj.name.indexOf(data['name']) !== -1) {
          returnVal = true;
        }
      }
      return returnVal;
    };
  }

  getAllUsers() {
    this.spinnerService.spin$.next(true);
    this.authService.getAllUsers().subscribe({
      next: (data: any) => {
        this.spinnerService.spin$.next(false);
        this.allusers = data;
        this.initFilterData(this.allusers);
        this.setDatasource(this.allusers);
        //this.resetFilters();
        console.log(`all users`, data);
      },
      error: (e) => {
        this.spinnerService.spin$.next(false);
        console.log('Error in get all users', e);
        this.notifierService.showNotification(`Error in get all users, ${e.error.message}`, 'close', 'error');
      }
    });
  }

  approveUser(user: User) {
    this.spinnerService.spin$.next(true);
    this.authService.approveUser(user).subscribe({
      next: (data: any) => {
        //this.spinnerService.spin$.next(false);
        this.notifierService.showNotification(`User Approval is success for , ${user.email}`, 'close', 'success');
        console.log(`approved user => `, data);
        this.getAllUsers();
      },
      error: (e) => {
        this.spinnerService.spin$.next(false);
        console.log('Error in approve User ', e);
        this.notifierService.showNotification(`Error in Approve user ${user.email} , ${e.error.message}`, 'close', 'error');
      }
    });
  }

  unApproveUser(user: User) {
    this.spinnerService.spin$.next(true);
    this.authService.unApproveUser(user).subscribe({
      next: (data: any) => {
        //this.spinnerService.spin$.next(false);
        this.notifierService.showNotification(`User un-approval is success for , ${user.email}`, 'close', 'success');
        console.log(`un-approved user => `, data);
        this.getAllUsers();
      },
      error: (e) => {
        this.spinnerService.spin$.next(false);
        console.log('Error in un-approve User ', e);
        this.notifierService.showNotification(`Error in un-approve user ${user.email} , ${e.error.message}`, 'close', 'error');
      }
    });
  }
  
  deleteUser(user: User) {
    this.spinnerService.spin$.next(true);
    this.authService.deleteUser(user).subscribe({
      next: (data: any) => {
        //this.spinnerService.spin$.next(false);
        this.notifierService.showNotification(`User Deletion is success for , ${user.email}`, 'close', 'success');
        console.log(`deleted user => `, data);
        this.getAllUsers();
      },
      error: (e) => {
        this.spinnerService.spin$.next(false);
        console.log('Error in delete user ', e);
        this.notifierService.showNotification(`Error in Delete user ${user.email} , ${e.error.message}`, 'close', 'error');
      }
    });
  }

  initFilterData(tableData) {
    this.allEmailList = tableData.map((item) => item['email']).filter(this.onlyUnique);
    this.allNameList = tableData.map((item) => item['name']).filter(this.onlyUnique);
  }

  onlyUnique(value: string, index: number, self: Array<any>): boolean {
    return self.indexOf(value) === index;
  }

  // resetFilters() {
  //   //this.formDirective.resetForm();
  //   this.filterForm.patchValue({
  //     emailCtrl: null,
  //     nameCtrl: null
  //   });
  // }

  trackBy(index: number, item: User) {
    return item._id;
  }
}

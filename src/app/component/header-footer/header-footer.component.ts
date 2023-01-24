import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { HeaderFooterService } from '@app/service/header-footer/header-footer.service';
import { NotifierService } from '@app/service/notification-service/notification.service';
import { SpinnerService } from '@app/service/spinner.service';
import { getFieldErrorMessage } from '@app/utils/utilities';
import { map, Observable, startWith } from 'rxjs';
import { Custom_Validation_Messages } from './validation-messages';

@Component({
  selector: 'app-header-footer',
  templateUrl: './header-footer.component.html',
  styleUrls: ['./header-footer.component.scss']
})
export class HeaderFooterComponent implements OnInit {

  @ViewChild('formDirective') private formDirective: NgForm;
  
  headerFooterForm: FormGroup;
  headerFooterData: Array<{[key: string]: string}>;
  filteredOptions: Observable<Array<{[key: string]: string}>>;

  constructor(private formBuilder: FormBuilder, 
    private headerFooterService: HeaderFooterService,
    private notifierService: NotifierService,
    private spinnerService: SpinnerService
    ) {}

  ngOnInit(): void {
    this.getHeaderFooterData();

    this.headerFooterForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      header: ['', Validators.compose([Validators.required])],
      footer: ['', Validators.compose([Validators.required])]
    });
  }

  resetInput(){
    //this.formDirective.resetForm();
    this.headerFooterForm.patchValue({
      name: '',
      header: '',
      footer: '',
    });
  }

  get formData() {
    return this.headerFooterForm.controls;
  }

  initFilter(){
    this.filteredOptions = this.headerFooterForm.get('name').valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filetVal = typeof value === 'string' ? value : value?.name;
        return this.filterAutoComplete(filetVal || '')
      })
    );
  }

  filterAutoComplete(value: string): Array<{ [key: string]: string }> {
    const filterValue = value ? value.toLowerCase(): '';
    return this.headerFooterData.filter((option) => option.name.toLowerCase().includes(filterValue));
  }

  onCompanySelected(company) {
    this.headerFooterForm.patchValue({
      name: company.name,
      header: company.header,
      footer: company.footer
    });
  }

  getHeaderFooterData() {
    this.spinnerService.spin$.next(true);
    this.headerFooterService.getHeaderFooterData().subscribe({
      next: (res) => {
        this.spinnerService.spin$.next(false);
        this.headerFooterData = res;
        this.initFilter();
        console.log('getHeaderFooterData => ', res);
      },
      error: (e) => {
        this.spinnerService.spin$.next(false);
        console.log('getHeaderFooterData Error => ', e);
      }
    });
  }

  // resetForm() {
  //   this.headerFooterForm.reset();
  //   Object.keys(this.headerFooterForm.controls).forEach((key) => {
  //     const control = this.headerFooterForm.controls[key];
  //     control.setErrors(null);
  //     this.headerFooterForm.updateValueAndValidity();
  //     //control.markAsPristine();
  //     //control.markAsUntouched();
  //   });
  // }

  submit() {
    if (this.headerFooterForm.valid) {
      const name = this.formData.name.value;
      const header = this.formData.header.value;
      const footer = this.formData.footer.value;
      this.spinnerService.spin$.next(true);
      this.headerFooterService.saveHeaderFooterData({ name, header, footer }).subscribe({
        next: (res) => {
          //this.spinnerService.spin$.next(false);
          this.formDirective.resetForm();
          //this.resetForm();
          this.getHeaderFooterData();
          this.notifierService.showNotification(`Data saved for successfully for - ${name}`, 'close', 'success', 3000);
          console.log('saveHeaderFooterData => ', res);
        },
        error: (e) => {
          this.spinnerService.spin$.next(false);
          this.notifierService.showNotification(`Error occured while saving data for - ${name}`, 'close', 'error', 3000);
          console.log('saveHeaderFooterData Error => ', e);
        }
      });
    }
  }

  getErrorMessage(controlName): string {
    return getFieldErrorMessage(this.headerFooterForm, controlName, Custom_Validation_Messages);
  }
}

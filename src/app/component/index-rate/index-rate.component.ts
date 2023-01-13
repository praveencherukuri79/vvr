import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { IndexRateService } from '@app/service/index-rate/index-rate.service';
import { NotifierService } from '@app/service/notification-service/notification.service';
import { SpinnerService } from '@app/service/spinner.service';
import { getFieldErrorMessage } from '@app/utils/utilities';
import { map, Observable, startWith } from 'rxjs';
import { Custom_Validation_Messages } from './validation-messages';
// import {rateOverride} from './rate';

@Component({
  selector: 'app-index-rate',
  templateUrl: './index-rate.component.html',
  styleUrls: ['./index-rate.component.scss']
})
export class IndexRateComponent {
  @ViewChild('formDirective') private formDirective: NgForm;

  indexRateForm: FormGroup;
  indexRateData: Array<{ INDEX_NUM: number, rate: number }>;
  filteredOptions: Observable<Array<{ INDEX_NUM: number, rate: number }>>;

  constructor(
    private formBuilder: FormBuilder,
    private indexRateService: IndexRateService,
    private notifierService: NotifierService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.getIndexRateData();

    this.indexRateForm = this.formBuilder.group({
      index: [null, Validators.compose([Validators.required])],
      rate: [null, Validators.compose([Validators.required])]
    });
  }

  initFilter(){
    this.filteredOptions = this.indexRateForm.get('index').valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filetVal = typeof value === 'number' ? value : value?.INDEX_NUM;
        return this.filterAutoComplete(filetVal || '')
      })
    );
  }

  filterAutoComplete(value: string): Array<{ INDEX_NUM: number, rate: number }> {
    const filterValue = value ? value.toString().toLowerCase(): '';
    return this.indexRateData.filter((option) => option.INDEX_NUM.toString().toLowerCase().includes(filterValue));
  }

  resetInput(){
    //this.formDirective.resetForm();
    this.indexRateForm.patchValue({
      index: null,
      rate: null
    });
  }


  get formData() {
    return this.indexRateForm.controls;
  }

  onIndexSelected(obj) {
    this.indexRateForm.patchValue({
      index: obj.INDEX_NUM,
      rate: obj.rate
    });
  }

  getIndexRateData() {
    this.spinnerService.spin$.next(true);
    this.indexRateService.geRates().subscribe({
      next: (res) => {
        this.spinnerService.spin$.next(false);
        this.indexRateData = res;
        this.initFilter();
        console.log('indexRateData => ', res);
      },
      error: (e) => {
        this.spinnerService.spin$.next(false);
        this.notifierService.showNotification(`Error occured while retirving index rate data`, 'close', 'error', 3000);
        console.log('indexRateData Error => ', e);
      }
    });
  }

  submit() {
    if (this.indexRateForm.valid) {
      const index = this.formData.index.value;
      const rate = this.formData.rate.value;
      this.spinnerService.spin$.next(true);
      this.indexRateService.saveRate({ INDEX_NUM: index, rate: rate }).subscribe({
        next: (res) => {
          this.spinnerService.spin$.next(false);
          this.formDirective.resetForm();
          //this.resetForm();
          this.getIndexRateData();
          this.notifierService.showNotification(`Data saved for successfully for - ${index}`, 'close', 'success', 3000);
          console.log('saveHeaderFooterData => ', res);
        },
        error: (e) => {
          this.spinnerService.spin$.next(false);
          this.notifierService.showNotification(`Error occured while saving data for - ${index}`, 'close', 'error', 3000);
          console.log('saveHeaderFooterData Error => ', e);
        }
      });
    }
  }

  // submitOverride() {
  //     this.spinnerService.spin$.next(true);
  //     this.indexRateService.saveRatesOverride(rateOverride).subscribe({
  //       next: (res) => {
  //         this.spinnerService.spin$.next(false);
  //         this.getIndexRateData();
  //         this.notifierService.showNotification(`Data saved for successfully for override`, 'close', 'success', 3000);
  //         console.log('saveHeaderFooterData => ', res);
  //       },
  //       error: (e) => {
  //         this.spinnerService.spin$.next(false);
  //         this.notifierService.showNotification(`Error occured while saving data for override`, 'close', 'error', 3000);
  //         console.log('saveHeaderFooterData Error => ', e);
  //       }
  //     });
  // }

  getErrorMessage(controlName): string {
    return getFieldErrorMessage(this.indexRateForm, controlName, Custom_Validation_Messages);
  }
}

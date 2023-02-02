import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMstc } from '@app/interface/mstc';
import { MstcService } from '@app/service/mstc-service/mstc.service';
import { NotifierService } from '@app/service/notification-service/notification.service';
import { SpinnerService } from '@app/service/spinner.service';
import { getFieldErrorMessage, sliceIntoChunks } from '@app/utils/utilities';
import { concatMap, delay, from } from 'rxjs';
import { read as xlsxread, utils as xlsxUtils, WorkBook } from 'xlsx';
import { Custom_Validation_Messages } from './validation-messages';

@Component({
  selector: 'app-file-save',
  templateUrl: './file-save.component.html',
  styleUrls: ['./file-save.component.scss']
})
export class FileSaveComponent {
  @ViewChild('fileSave')
  fileSave: ElementRef;

  files: FileList;
  excelFile: File;
  fileUploadForm: FormGroup;

  constructor(
    private spinnerService: SpinnerService,
    private mstcService: MstcService,
    private formBuilder: FormBuilder,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      fileName: ['', Validators.compose([Validators.required])]
    });
  }

  onClick(event: Event) {
    if (this.fileUploadForm.invalid) {
      return;
    }
    if (this.fileSave) {
      if (this.fileSave.nativeElement && this.fileSave.nativeElement.value) {
        this.fileSave.nativeElement.value = null;
      }
      this.fileSave.nativeElement.click();
    }
  }

  onFileChange(event: Event) {
    this.spinnerService.spin$.next(true);
    setTimeout(() => {
      this.parseFileData(event);
    }, 100);
  }

  parseFileData(event: Event) {
    try {
      const target: HTMLInputElement = event.target as HTMLInputElement;
      this.files = target.files as FileList;
      this.excelFile = this.files[0];

      let workBook: WorkBook;
      let jsonData: { [key: string]: any } = {};
      const reader: FileReader = new FileReader();

      reader.onload = (event1) => {
        const data = reader.result;
        workBook = xlsxread(data, { type: 'binary' });

        workBook.SheetNames.forEach((sheetName: string) => {
          jsonData[sheetName.trim()] = xlsxUtils.sheet_to_json(workBook.Sheets[sheetName]);
        });
        console.log('jsonData => ', jsonData);

        const mstc: Array<IMstc> = jsonData['MSTC'];

        //save to DB
        let fileName = this.formData.fileName.value;

        //this.mstcService.saveMstc({ reportName: fileName, reportData: mstc });
        //const mstcArray:Array<IMstc> = sliceIntoChunks(mstc, 500);

        from(sliceIntoChunks(mstc, 500))
          .pipe(
            concatMap((el, index) =>
              this.mstcService.saveMstc({ reportName: fileName, reportData: el, isFirstBatch: index === 0 }).pipe(delay(100))
            )
          )
          .subscribe({
            next: (data) => {
              // this.spinnerService.spin$.next(false);
              // this.notifierService.showNotification(`"${data.reportName}" File is saved succesfully`, 'close', 'success');
              // console.log('mongo saved data => ', data);
            },
            error: (error) => {
              this.spinnerService.spin$.next(false);
              this.notifierService.showNotification(`Error in saving file`, 'close', 'error');
              console.log('mongo error in saving data => ', error);
            },
            complete: () => {
              this.spinnerService.spin$.next(false);
              this.notifierService.showNotification(`File is saved succesfully`, 'close', 'success');
              console.log('mongo saved data => ', data);
            }
          });

        // this.mstcService.saveMstc({ reportName: fileName, reportData: mstc }).subscribe({
        //   next: (data) => {
        //     this.spinnerService.spin$.next(false);
        //     this.notifierService.showNotification(`"${data.reportName}" File is saved succesfully`, 'close', 'success');
        //     console.log('mongo saved data => ', data);
        //   },
        //   error: (error) =>{
        //     this.spinnerService.spin$.next(false);
        //     this.notifierService.showNotification(`Error in saving file`, 'close', 'error');
        //     console.log('mongo error in saving data => ', error);
        //   }
        // });
      };
      reader.readAsBinaryString(this.excelFile);
    } catch (e) {
      console.log('error reading file => ', e);
      this.files = undefined;
      this.excelFile = undefined;
      this.spinnerService.spin$.next(false);
    }
  }

  getMstc() {
    this.mstcService.getMstc('NOV-2022').subscribe({
      next: (data) => {
        console.log('mongo get data => ', data);
        //this.mstcService.getMstc('NOV-2022');
      }
    });
  }

  get formData() {
    return this.fileUploadForm.controls;
  }

  getErrorMessage(controlName): string {
    return getFieldErrorMessage(this.fileUploadForm, controlName, Custom_Validation_Messages);
  }
}

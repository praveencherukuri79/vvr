import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mstc } from '@app/model/mstc';

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  styleUrls: ['./invoice-dialog.component.scss']
})
export class InvoiceDialogComponent implements OnInit {
  invoiceForm: FormGroup;
  displayedColumns: Array<keyof Mstc>;
  displayNames: { [key: string]: string };
  printColumns = [];
  nonDefaultColumns: Array<keyof Mstc>;
  headerFooterData: Array<{ [key: string]: string }>;
  defaultCompanyName: string;
  //selectedCompany: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<InvoiceDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.displayedColumns = data.displayedColumns;
    this.displayNames = data.displayNames;
    this.nonDefaultColumns = data.nonDefaultColumns;
    this.defaultCompanyName = data.defaultCompanyName;
    this.headerFooterData = data.headerFooterData;

    this.displayedColumns.forEach((column) => {
      this.printColumns.push({
        columnName: column,
        checked: this.nonDefaultColumns.indexOf(column) === -1,
        displayName: this.displayNames[column]
      });
    });
  }

  ngOnInit(): void {
    this.invoiceForm = this.formBuilder.group({
      header: '',
      footer: '',
      companyName: ''
    });

    let defaultOption: { [key: string]: string };
    if(this.defaultCompanyName){
      for(let item of this.headerFooterData){
        if(item.name === this.defaultCompanyName){
          defaultOption = item;
          break;
        }
      }
    }
    if(defaultOption){
      //this.selectedCompany = defaultOption;
      //this.invoiceForm.get('companyName').setValue(defaultOption);
      this.onSelectCompany(defaultOption);
    }
  }

  onSelectCompany(headerFooterOption: { [key: string]: string }) {
   // const headerFooterOption = this.headerFooterData.find(item=> item._id === id);
    if(headerFooterOption){
      //this.selectedCompany = headerFooterOption._id;
      this.invoiceForm.patchValue({
        companyName: headerFooterOption,
        header: headerFooterOption.header,
        footer: headerFooterOption.footer
      });
    }else{
      this.invoiceForm.patchValue({
        header: null,
        footer: null
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }

  submit(isPrint: boolean = false): void {
    const selectedColumns: Array<keyof Mstc> = this.printColumns.filter((col) => col.checked).map((item) => item.columnName);
    const forData: { [key: string]: any } = {
      header: this.invoiceForm.get('header').value,
      footer: this.invoiceForm.get('footer').value,
      selectedColumns: selectedColumns,
      isPrint: isPrint
    };

    this.dialogRef.close(forData);
  }
}

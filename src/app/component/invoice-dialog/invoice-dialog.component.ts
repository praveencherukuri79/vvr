import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  styleUrls: ['./invoice-dialog.component.scss']
})
export class InvoiceDialogComponent implements OnInit {

  invoiceForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<InvoiceDialogComponent>,
    private formBuilder: FormBuilder){

  }

  ngOnInit(): void {
    this.invoiceForm = this.formBuilder.group({
      header: '',
      footer: ''
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    const forData: {[key: string]: string} = {
      header: this.invoiceForm.get('header').value,
      footer: this.invoiceForm.get('footer').value
    }
    
    this.dialogRef.close(forData);
  }
}

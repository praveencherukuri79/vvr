import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ngx_quill_config } from './ngx-quill-config';
//import { MatQuill } from '../mat-quill/mat-quill';

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  styleUrls: ['./invoice-dialog.component.scss']
})
export class InvoiceDialogComponent implements OnInit {
  invoiceForm: FormGroup;
  headerHtml: any = '<p>Testing</p>';
  footerHtml: any = '<p>Testing</p>';
  ngx_quill_config = ngx_quill_config;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<InvoiceDialogComponent>,
    private formBuilder: FormBuilder
  ) {}

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
    const forData: { [key: string]: string } = {
      // header: this.invoiceForm.get('header').value,
      // footer: this.invoiceForm.get('footer').value

      header: this.headerHtml,
      footer: this.footerHtml
    };

    this.dialogRef.close(forData);
  }

  logChange(data, method) {
    //console.log(this.editor);
    console.log(data.html, this.headerHtml);
  }
}

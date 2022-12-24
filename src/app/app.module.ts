import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppSpinnerComponent } from './component/app-spinner/app-spinner.component';
import { MatTableComponent } from './component/mat-table/mat-table.component';
import { InvoiceDialogComponent } from './component/invoice-dialog/invoice-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent, AppSpinnerComponent, MatTableComponent, InvoiceDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ],
  providers: [],
  entryComponents:[InvoiceDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

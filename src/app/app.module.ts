import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppSpinnerComponent } from './component/app-spinner/app-spinner.component';
import { MatTableComponent } from './component/mat-table/mat-table.component';
import { InvoiceDialogComponent } from './component/invoice-dialog/invoice-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './component/log-in/login.component';
import { SignupComponent } from './component/sign-up/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadComponent } from './component/file-upload/file-upload.component';
import { DialogComponent } from './component/dialog/dialog.component';
import { AdminComponent } from './component/admin/admin.component';
import { authInterceptorProviders } from './service/auth-interceptor/auth.interceptor';
import { AdminErrorComponent } from './component/admin-error-dialog/admin-error.component';
import { CustomSnackbarComponent } from './component/custom-snackbar/custom-snackbar.component';
import { FileSaveComponent } from './component/file-save/file-save.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { HeaderFooterComponent } from './component/header-footer/header-footer.component';
import { IndexRateComponent } from './component/index-rate/index-rate.component';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { UserPortalComponent } from './component/user-portal/user-portal.component';

@NgModule({
  declarations: [
    AppComponent,
    AppSpinnerComponent,
    MatTableComponent,
    InvoiceDialogComponent,
    LoginComponent,
    SignupComponent,
    FileUploadComponent,
    DialogComponent,
    AdminComponent,
    AdminErrorComponent,
    CustomSnackbarComponent,
    FileSaveComponent,
    DashboardComponent,
    HeaderFooterComponent,
    IndexRateComponent,
    UserPortalComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ],
  providers: [authInterceptorProviders, CurrencyPipe, DecimalPipe],
  entryComponents: [InvoiceDialogComponent, DialogComponent, AdminErrorComponent, CustomSnackbarComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}

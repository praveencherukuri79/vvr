import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './component/admin/admin.component';
import { FileUploadComponent } from './component/file-upload/file-upload.component';
import { LoginComponent } from './component/log-in/login.component';
import { SignupComponent } from './component/sign-up/signup.component';
import { Role } from './model/roles';
import { AuthGuardService } from './service/auth-guard/auth-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'dashboard',
    component: FileUploadComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [ AuthGuardService ],
    data: { roles: [Role.Admin] }
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

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
    component: LoginComponent,
    canActivate: [ AuthGuardService ],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [ AuthGuardService ],
  },
  {
    path: 'dashboard',
    component: FileUploadComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [ AuthGuardService ],
    data: { roles: [Role.Admin] }
  },
  {
    path: '',
    redirectTo: '/login',
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

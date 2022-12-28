import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, NavigationExtras, Router, RouterStateSnapshot } from '@angular/router';
import { AdminErrorComponent } from '@app/component/admin-error-dialog/admin-error.component';
import { trimUrl } from '@app/utils/utilities';
import { AuthService } from '../auth-service/auth.service';
import { TokenStorageService } from '../token-service/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private tokenService: TokenStorageService, private router: Router, private dialog: MatDialog) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.tokenService.isUserLoggedIn() && this.tokenService.getUser()) {
      const currentUser = this.tokenService.getUser();
      if (currentUser && route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
        // insuffisient privillages
        //this.router.navigate(['login']);
        //window.alert(`insuffisient privillages for accessing roles => ${route.data.roles}`);
        this.openErrorDialog(false, true);
        return false;
      } else {
        return true;
      }
    }
      // user not logged in
      // const returnUrl = trimUrl(state.url);
      // const navigationExtras: NavigationExtras = {state: {adminError: (returnUrl === 'admin')}};
      // this.router.navigate(['login'], navigationExtras);
      this.openErrorDialog(true, false);
      return false;
  }

  openErrorDialog(showLoginError: boolean, showRoleError: boolean){
    const dialogRef = this.dialog.open(AdminErrorComponent, {
      height: '30vh',
      width: '30vw',
      data: {
        showLoginError,
        showRoleError
      }
    });
    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    //   if (result) {
    //     console.log('form data => ', result);
    //     this.invoiceHeader = result.header ? result.header.split('\n') : null;
    //     this.invoiceFooter = result.footer ? result.footer.split('\n') : null;
    //     setTimeout(() => {
    //       window.print();
    //     }, 200);
    //   }
    // });
  }
}

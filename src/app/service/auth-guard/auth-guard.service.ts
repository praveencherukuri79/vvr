import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationExtras, Router, RouterStateSnapshot } from '@angular/router';
import { trimUrl } from '@app/utils/utilities';
import { NotifierService } from '../notification-service/notification.service';
import { TokenStorageService } from '../token-service/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private tokenService: TokenStorageService, private router: Router, private notifierService: NotifierService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.tokenService.isUserLoggedIn() && this.tokenService.getUser()) {
      if (['dashboard'].includes(trimUrl(state.url))) {
        return true;
      } else if (['login', 'signup'].includes(trimUrl(state.url))) {
        //this.notifierService.showNotification(`Please logout to continue... !!`, 'close', 'warning', 6000);
        this.router.navigate(['dashboard']);
        return false;
      } else if (['admin'].includes(trimUrl(state.url))) {
        const currentUser = this.tokenService.getUser();
        if (currentUser && route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
          this.notifierService.showNotification(
            `Insuffisient privillages for accessing admin page, Please login with Admin credentials.`,
            'close',
            'warning',
            8000
          );
          return false;
        } else {
          return true;
        }
      }
    } else {
      if (['dashboard'].includes(trimUrl(state.url))) {
        this.notifierService.showNotification(`Please login to continue... !!`, 'close', 'warning', 6000);
        return false;
      } else if (['login', 'signup'].includes(trimUrl(state.url))) {
        return true;
      } else if (['admin'].includes(trimUrl(state.url))) {
        this.notifierService.showNotification(`Please login as Admin to continue to Admin page.`, 'close', 'warning', 8000);
        return false;
      }
    }
    return false;
  }
}

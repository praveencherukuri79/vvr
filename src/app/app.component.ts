import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { read as xlsxread, utils as xlsxUtils, WorkBook } from 'xlsx';
import { IMstc } from './interface/mstc';
import { INavData } from './interface/navData';
import { Mstc } from './model/mstc';
import { AuthService } from './service/auth-service/auth.service';
import { SpinnerService } from './service/spinner.service';
import { TokenStorageService } from './service/token-service/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navData: Array<INavData> = [
    {
      name: 'dashboard',
      url: 'dashboard',
      fontIcon: 'dashboard',
      displayText: 'Dashboard',
      display: true
    },
    {
      name: 'login',
      url: 'login',
      fontIcon: 'login',
      displayText: 'Login',
      display: true
    },
    {
      name: 'signup',
      url: 'signup',
      fontIcon: 'person_add',
      displayText: 'Signup',
      display: true
    },
    {
      name: 'logout',
      url: 'logout',
      fontIcon: 'logout',
      displayText: 'Logout',
      display: true
    },
    {
      name: 'admin',
      url: 'admin',
      fontIcon: 'admin_panel_settings',
      displayText: 'Admin',
      display: true
    }
  ];

  loggedinUser: any;

  constructor(private router: Router, private authService: AuthService, private tokenStorageService: TokenStorageService) {}

  navigateTo(path: string) {
    if (path !== 'logout') {
      this.router.navigate([path]);
    } else {
      this.authService.logOut().subscribe({
        next: () => {
          this.tokenStorageService.logOut();
          this.router.navigate(['login']);
        }
      });
    }
  }

  ngOnInit(): void {
    this.tokenStorageService.loginStatus.subscribe({
      next: (status: boolean) => {

        this.loggedinUser = status ? this.tokenStorageService.getUser() : null;
        
        this.navData.forEach((nav: INavData) => {
          switch (nav.name) {
            case 'login':
              nav.display = !status;
              break;
            case 'signup':
              nav.display = !status;
              break;
            case 'logout':
              nav.display = status;
              break;
          }
        });
      }
    });
  }
}

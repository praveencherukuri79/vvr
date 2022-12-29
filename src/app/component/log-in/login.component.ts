import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TokenStorageService } from '@app/service/token-service/token-storage.service';
import { AuthService } from '@app/service/auth-service/auth.service';
import { Custom_Validation_Messages } from './validation-messages';
import { getFieldErrorMessage } from '@app/utils/utilities';
import { filter, map } from 'rxjs';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  @Input() isDialog: boolean;
  @Output() enableCloseButton: EventEmitter<any> = new EventEmitter();
  @Output() returnData: EventEmitter<any> = new EventEmitter();
  @Output() signUpEvent: EventEmitter<any> = new EventEmitter();
  loginError: string;
  loginSuccess: boolean;
  userData: any;
  showPassword:boolean = false;
  // showAdminError: boolean;
  // adminError: string;

  password = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{3,}$';
  emailPattern = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
  //emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //     this.router.navigate(['/']);
    // }
    // const navigation = this.router.getCurrentNavigation();
    // const state = navigation && navigation.extras && (navigation.extras.state as { adminError: boolean });
    // if (state && state.adminError) {
    //   this.showAdminError = true;
    //   this.adminError = 'Please login as Admin to continue to Admin page.';
    // }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      password: ['', Validators.compose([Validators.required])]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // if(this.returnUrl == 'admin'){
    //   this.showAdminError = true;
    //   this.adminError = 'Please login as Admin to continue to Admin page.';
    // }
    //const navigation = this.router.getCurrentNavigation();
    //const navigation = this.router.getCurrentNavigation();
    // const routerState = this.router.events.pipe(
    //   filter(e => e instanceof NavigationStart),
    //   map(() => {
    //     const currentState = this.router.getCurrentNavigation();
    //     return currentState.extras.state;
    //   })
    // );
    //const state = navigation && navigation.extras && navigation.extras.state as {adminError: boolean};
    // if(routerState && routerState.adminError){
    //   this.showAdminError = true;
    //   this.adminError = 'Please login as Admin to continue to Admin page.';
    // }
  }

  get formData() {
    return this.loginForm.controls;
  }

  signUp() {
    if (this.isDialog) {
      this.signUpEvent.emit();
    } else {
      this.router.navigate(['signup']);
    }
  }

  onSubmit() {
    this.submitted = true;
    this.loginError = '';
    this.loginSuccess = false;
    if (this.loginForm.invalid) {
      return;
    }
    let email = this.formData.email.value;
    let password = this.formData.password.value;
    let postData = { user: { email, password } };
    this.loading = true;
    this.authService.logIn(postData).subscribe(
      (data: any) => {
        this.loading = false;
        this.loginSuccess = true;
        this.userData = data.user;
        console.log('login sucsess', data);
        this.tokenStorageService.saveAuth(data);
        if (this.isDialog) {
          this.enableCloseButton.emit(true);
          this.returnData.emit({ isSucess: true, data });
        } else {
          // navigate logic
          //this.router.navigate([this.returnUrl]);
        }
      },
      (e) => {
        if (this.isDialog) {
          this.enableCloseButton.emit(false);
          this.returnData.emit({ isSucess: false, e });
        } else {
          // error logic
        }
        console.log('login failed', e);
        this.loginError = e.error.message;
        this.loading = false;
      }
    );
  }

  testLogIn() {
    this.authService.logInStatus().subscribe((data) => {
      console.log('log in test:', data);
    });
  }

  getErrorMessage(controlName): string {
    return getFieldErrorMessage(this.loginForm, controlName, Custom_Validation_Messages);
  }
}

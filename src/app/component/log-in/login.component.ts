import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TokenStorageService } from '@app/service/token-service/token-storage.service';
import { AuthService } from '@app/service/auth-service/auth.service';
import { Custom_Validation_Messages } from './validation-messages';
import { getFieldErrorMessage } from '@app/utils/utilities';
import { NotifierService } from '@app/service/notification-service/notification.service';
import { SpinnerService } from '@app/service/spinner.service';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  @Input() isDialog: boolean;
  @Output() enableCloseButton: EventEmitter<any> = new EventEmitter();
  @Output() returnData: EventEmitter<any> = new EventEmitter();
  @Output() signUpEvent: EventEmitter<any> = new EventEmitter();

  showPassword: boolean = false;
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
    private tokenStorageService: TokenStorageService,
    private notifierService: NotifierService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      password: ['', Validators.compose([Validators.required])]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
    if (this.loginForm.invalid) {
      return;
    }
    let email = this.formData.email.value;
    let password = this.formData.password.value;
    let postData = { user: { email, password } };
    this.spinnerService.spin$.next(true);
    this.authService.logIn(postData).subscribe({
      next: (data: any) => {
        this.spinnerService.spin$.next(false);
        console.log(`Login sucsess, welcome ${data.user.name}`, data);
        this.notifierService.showNotification(`Login sucsess, welcome ${data.user.name}`, 'close', 'success');
        this.tokenStorageService.saveAuth(data);
        if (this.isDialog) {
          this.enableCloseButton.emit(true);
          this.returnData.emit({ isSucess: true, data });
        } else {
        }
        this.router.navigate(['dashboard']);
      },
      error: (e) => {
        this.spinnerService.spin$.next(false);
        if (this.isDialog) {
          this.enableCloseButton.emit(false);
          this.returnData.emit({ isSucess: false, e });
        } else {
          // error logic
        }
        console.log('login failed', e);
        this.notifierService.showNotification(`Login failed, ${e.error.message}`, 'close', 'error');
      }
    });
  }

  forgotPassword(){
    this.router.navigate(['resetPassword']);
  }

  getErrorMessage(controlName): string {
    return getFieldErrorMessage(this.loginForm, controlName, Custom_Validation_Messages);
  }
}

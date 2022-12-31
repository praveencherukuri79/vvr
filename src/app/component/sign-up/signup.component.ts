import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TokenStorageService } from '@app/service/token-service/token-storage.service';
import { AuthService } from '@app/service/auth-service/auth.service';
import { Custom_Validation_Messages } from './validation-messages';
import { getFieldErrorMessage } from '@app/utils/utilities';
import { NotifierService } from '@app/service/notification-service/notification.service';
import { SpinnerService } from '@app/service/spinner.service';

@Component({
  selector: 'signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitted = false;
  returnUrl: string;
  @Input() isDialog: boolean;
  @Output() returnData: EventEmitter<any> = new EventEmitter();
  @Output() loginEvent: EventEmitter<any> = new EventEmitter();
  showPassword:boolean = false;

  passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$';
  emailPattern = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private notifierService: NotifierService,
    private spinnerService: SpinnerService
  ) {
  }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern(this.passwordPattern)])]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get formData() {
    return this.signupForm.controls;
  }

  logIn() {
    if (this.isDialog) {
      this.loginEvent.emit();
    } else {
      this.router.navigate(['login']);
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    let name = this.formData.name.value;
    let email = this.formData.email.value;
    let password = this.formData.password.value;
    let postData = { user: { name, email, password } };
    this.spinnerService.spin$.next(true);
    this.authService.signUp(postData).subscribe({
      next: (data: any) => {
        this.spinnerService.spin$.next(false);
        console.log('sign up sucsess', data);
        this.notifierService.showNotification(`Signup sucsess, welcome ${data.user.name}, Please login`, 'close', 'success');
        //this.tokenStorageService.saveAuth(data);
        this.router.navigate(['login']);
        if (this.isDialog) {
          this.returnData.emit({ isSucess: true, data });
        } else {
        }
      },
      error: (e) => {
        this.spinnerService.spin$.next(false);
        console.log('signup failed', e);
        this.notifierService.showNotification(`Signup failed, ${e.error.message}`, 'close', 'error');
        if (this.isDialog) {
          this.returnData.emit({ isSucess: false, e });
        } else {
          // error logic
        }
      }
    });
  }

  getErrorMessage(controlName): string {
    return getFieldErrorMessage(this.signupForm, controlName, Custom_Validation_Messages);
  }
}

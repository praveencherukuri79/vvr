import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TokenStorageService } from '@app/service/token-service/token-storage.service';
import { AuthService } from '@app/service/auth-service/auth.service';
import { Custom_Validation_Messages } from './validation-messages';
import { getFieldErrorMessage } from '@app/utils/utilities';

@Component({
  selector: 'signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  @Input() isDialog: boolean;
  @Output() returnData: EventEmitter<any> = new EventEmitter();
  @Output() loginEvent: EventEmitter<any> = new EventEmitter();
  signupError: string;
  signupSuccess: boolean;
  userData: any;
  showPassword:boolean = false;

  passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$';
  emailPattern = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';

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
    this.signupError = '';
    this.signupSuccess = false;
    let name = this.formData.name.value;
    let email = this.formData.email.value;
    let password = this.formData.password.value;
    let postData = { user: { name, email, password } };
    this.loading = true;
    this.authService.signUp(postData).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.signupSuccess = true;
        this.userData = data.user;
        console.log('sign up sucsess', data);
        this.tokenStorageService.saveAuth(data);
        if (this.isDialog) {
          this.returnData.emit({ isSucess: true, data });
          //this.loginEvent.emit({ isSucess: true, data });
        } else {
          // navigate logic
          //this.router.navigate([this.returnUrl]);
        }
      },
      error: (e) => {
        console.log('signup failed', e);
        this.loading = false;
        this.signupError = e.error.message;
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TokenStorageService } from '@app/service/token-service/token-storage.service';
import { AuthService } from '@app/service/auth-service/auth.service';
import { Custom_Validation_Messages } from './validation-messages';
import { getFieldErrorMessage } from '@app/utils/utilities';
import { NotifierService } from '@app/service/notification-service/notification.service';
import { SpinnerService } from '@app/service/spinner.service';
import { TwilioService } from '@app/service/twilio/twilio.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  smsPhone: string;
  message: string;

  phone: string;
  email: string;
  code: string;
  channel: 'email'|'sms'|'password' = 'email';

  token: string;

  resetPasswordForm: FormGroup;
  resetEmailForm: FormGroup;
  resetPhoneForm: FormGroup;

  passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$';
  emailPattern = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
  numberPattern = '^[0-9]*$';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  countryCodes = [
    { displayName: 'India', code: '+91' },
    { displayName: 'USA', code: '+1' }
  ];

  formValidators = {
    email: [Validators.required, Validators.pattern(this.emailPattern)],
    countryCode: [Validators.required],
    phone: [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(this.numberPattern)],
    otp: [Validators.required, Validators.pattern(this.numberPattern)],
    password: [Validators.required, Validators.minLength(3), Validators.pattern(this.passwordPattern)],
    //confirmPassword: [Validators.required, Validators.minLength(3), Validators.pattern(this.passwordPattern)]
  };

  // displayConfig = {
  //   email: false,
  //   countryCode: false,
  //   phone: false,
  //   password: false,
  //   confirmPassword: false
  // };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private notifierService: NotifierService,
    private spinnerService: SpinnerService,
    private twilioService: TwilioService
  ) {}

  ngOnInit() {
    this.resetEmailForm = this.formBuilder.group({
      email: ['', Validators.compose(this.formValidators.email)]
    });

    this.resetPhoneForm = this.formBuilder.group({
      countryCode: ['', Validators.compose(this.formValidators.countryCode)],
      phone: ['', Validators.compose(this.formValidators.phone)]
    });

    this.resetPasswordForm = this.formBuilder.group({
      otp: ['', Validators.compose(this.formValidators.otp)],
      password: ['', Validators.compose(this.formValidators.password)]
      //confirmPassword: ['', Validators.compose(this.formValidators.confirmPassword)]
    });

    //this.resetPasswordForm.get('phone').setValidators([]);
    this.selecteChannel(this.channel);
  }

  get formControls() {
    return this.resetPasswordForm.controls;
  }

  // resetValidators(controlName: string, add: boolean) {
  //   if (add) {
  //     //this.displayConfig[controlName] = true;
  //     this.resetPasswordForm.controls[controlName].setValidators(this.formValidators[controlName]);
  //   } else {
  //     //this.displayConfig[controlName] = false;
  //     this.resetPasswordForm.controls[controlName].clearValidators();
  //   }
  // }

  selecteChannel(channel) {
    if (channel) {
      this.channel = channel;
      // if (channel == 'sms') {
      //   this.resetValidators('countryCode', true);
      //   this.resetValidators('phone', true);

      //   this.resetValidators('email', false);

      //   this.resetValidators('password', false);
      //   this.resetValidators('confirmPassword', false);
      // } else if (channel == 'email') {
      //   this.resetValidators('countryCode', false);
      //   this.resetValidators('phone', false);

      //   this.resetValidators('email', true);

      //   this.resetValidators('password', false);
      //   this.resetValidators('confirmPassword', false);
      // }
    }
  }

  // sendMessage(phone, message){
  //   this.spinnerService.spin$.next(true);
  //   this.twilioService.sendMessage({phone: phone, message: message}).subscribe({
  //     next: (data: any) => {
  //       this.spinnerService.spin$.next(false);
  //       console.log('send message success', data);
  //       //this.token = data.token;
  //       this.notifierService.showNotification(`Message sent !!!`, 'close', 'success');
  //     },
  //     error: (e) => {
  //       this.spinnerService.spin$.next(false);
  //       console.log('send message failed', e);
  //       this.notifierService.showNotification(`send message is failed, ${e.error.message}`, 'close', 'error');
  //     }
  //   });
  // }

  sendOtp(payload) {
    this.spinnerService.spin$.next(true);
    this.twilioService.sendOtp(payload).subscribe({
      next: (data: any) => {
        this.spinnerService.spin$.next(false);
        console.log('send Otp success', data);
        this.token = data.token;
        this.channel = 'password';
        this.notifierService.showNotification(`Otp sent !!!, please enter otp and continue`, 'close', 'success');
      },
      error: (e) => {
        this.spinnerService.spin$.next(false);
        console.log('send otp failed', e);
        this.notifierService.showNotification(`send otp is failed, ${e.error.message}`, 'close', 'error');
      }
    });
  }

  verifyOtp(code: string) {
    this.spinnerService.spin$.next(true);
    this.twilioService.verifyOtp({ token: this.token, code: code }).subscribe({
      next: (data: any) => {
        this.spinnerService.spin$.next(false);
        console.log('otp verification is success', data);
        this.notifierService.showNotification(`Otp verified !!!`, 'close', 'success');
      },
      error: (e) => {
        this.spinnerService.spin$.next(false);
        console.log('verify otp failed', e);
        this.notifierService.showNotification(`otp verify is failed, ${e.error.message}`, 'close', 'error');
      }
    });
  }

  changePassword(payload) {
    this.spinnerService.spin$.next(true);
    this.authService.changePassword(payload).subscribe({
      next: (data: any) => {
        this.spinnerService.spin$.next(false);
        console.log('change password is success', data);
        this.notifierService.showNotification(`Password Changed!!!`, 'close', 'success');
        this.router.navigate(['login']);
      },
      error: (e) => {
        this.spinnerService.spin$.next(false);
        console.log('change password is failed', e);
        this.notifierService.showNotification(`change password is failed, ${e.error.message}`, 'close', 'error');
      }
    });
  }

  onEmailSubmit() {
    if (this.resetEmailForm.valid) {
      this.sendOtp({ email: this.resetEmailForm.controls['email'].value, channel: this.channel });
    }
  }

  onPhoneSubmit() {
    if (this.resetPhoneForm.valid) {
      const phone = this.resetPhoneForm.controls['countryCode'].value.code + this.resetPhoneForm.controls['phone'].value;
      this.sendOtp({ phone: phone, channel: this.channel });
    }
  }

  onPasswordSubmit() {
    if (this.resetPasswordForm.valid) {
      this.changePassword({ token: this.token, code: this.resetPasswordForm.controls['otp'].value, password: this.resetPasswordForm.controls['password'].value});
    }
  }

  getErrorMessage(form: FormGroup,controlName: string): string {
    return getFieldErrorMessage(form, controlName, Custom_Validation_Messages);
  }
}

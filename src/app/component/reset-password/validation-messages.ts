export const Custom_Validation_Messages = {
  email: [
    { type: 'required', message: 'Email is required' },
    { type: 'pattern', message: 'Enter a valid email' }
  ],
  phone: [
    { type: 'required', message: 'Phone number is required' },
    { type: 'minlength', message: 'Invalid Phone number' },
    { type: 'maxlength', message: 'Invalid Phone number' },
    {
      type: 'pattern',
      message: 'Invalid Phone number'
    }
  ],
  countryCode: [
    { type: 'required', message: 'Country Code is required' },
  ],
  otp:[
    { type: 'required', message: 'OTP is required' },
    {
      type: 'pattern',
      message: 'Invalid OTP'
    }
  ],
  password: [
    { type: 'required', message: 'Password is required' },
    { type: 'minlength', message: 'Password must be at least 5 characters long' },
    {
      type: 'pattern',
      message: 'Your password must contain at least one uppercase, one lowercase, and one number and special Character in [#?!@$%^&*-]'
    }
  ],
  confirmPassword: [
    { type: 'required', message: 'Password is required' },
    { type: 'minlength', message: 'Password must be at least 5 characters long' },
    {
      type: 'pattern',
      message: 'Your password must contain at least one uppercase, one lowercase, and one number and special Character in [#?!@$%^&*-]'
    }
  ]
};

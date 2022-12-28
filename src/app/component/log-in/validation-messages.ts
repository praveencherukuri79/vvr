export const Custom_Validation_Messages: { [key: string]: Array<any> } = {
  email: [
    { type: 'required', message: 'Email is required' },
    { type: 'pattern', message: 'Enter a valid email' }
  ],
  password: [
    { type: 'required', message: 'Password is required' },
    { type: 'minlength', message: 'Password must be at least 3 characters long' }
  ]
};

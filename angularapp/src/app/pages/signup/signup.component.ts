import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  branch: string='';
  baseUrl: string='';

  registrationForm: FormGroup;

  // user = { name: '', email: '', password: '' };
  signupType!: string;
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    const start = window.location.href.indexOf('-') + 1;
  const end = window.location.href.indexOf('.project');
  this.branch = window.location.href.substring(start, end);
  this.baseUrl = `https://8080-${this.branch}.project.examly.io`;


    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      signupType: ['', Validators.required]
      // Add more fields as needed
    });}


    passwordValidator(control: AbstractControl): ValidationErrors | null {
      const value: string = control.value;
    
      // Validate the password using regular expressions
      const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()])[0-9a-zA-Z!@#$%^&*()]{8,}$/;
      const valid = regex.test(value);
    
      // Return an error if the password is not valid
      return valid ? null : { invalidPassword: true };
    }


  onSubmit() {

    if (this.registrationForm.invalid) {
      // Form is invalid, display error messages to the user
      return;
    }

    // Get the email value from the registrationForm
    const email = this.registrationForm.get('email')?.value;

    // Construct the URL with the email as a query parameter
    const emailUrl = `${this.baseUrl}/api/check-email/${email}`;

    // Check if the email already exists
    this.http.get<boolean>(emailUrl).subscribe(
      (emailExists => {
        if (emailExists) {
          // Email already exists
          console.log('Email already exists');
        } else {
          // Email does not exist, proceed with signup
          // console.log('Signup Successful');

          // Get the signupType value from the registrationForm
          const signupType = this.registrationForm.get('signupType')?.value;

          // Construct the URL with the signuptype as a query parameter
          const signupTypeUrl = `${this.baseUrl}/api/signup/${signupType}`;

          this.http.post<any>(signupTypeUrl, this.registrationForm.value).subscribe(response => {
            console.log('Signup Successful');
            console.log(response);
            this.router.navigate(['/signin']);
          });
        }
      }),
      (error: HttpErrorResponse) => {
        
        // console.error('Error checking email', error);
        // return of(null);
      // Handle error response from the backend
      if (error.status === 400 && error.error && error.error.errors) {
        // Validation error occurred
        console.log('Validation errors:', error.error.errors);
        // Display the validation errors to the user
      } else {
        // Other error occurred
        console.error('Registration failed:', error.message);
      }


      }
    )


  }
}

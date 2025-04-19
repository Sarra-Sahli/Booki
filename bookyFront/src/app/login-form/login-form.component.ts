import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  
  loginForm: FormGroup;
  rememberMe: boolean = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form submitted', {
        ...this.loginForm.value,
        rememberMe: this.rememberMe
      });
      // Add your authentication logic here
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }
  

}

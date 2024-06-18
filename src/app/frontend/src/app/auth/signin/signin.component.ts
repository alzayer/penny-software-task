import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  signinError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(event?: KeyboardEvent): void {
    if (event) {
      event.preventDefault(); // Prevent default form submission if validation fails
    }
  
    if (!this.email || !this.password) {
      this.signinError = 'Please enter both email and password.';
      return;
    }
  
    this.signinError = null; // Clear any previous error message
  
    this.authService.login(this.email, this.password)
      .subscribe({
        next: response => {
          // console.log('Token:', response.token);
          this.authService.setToken(response.token); // Save token in local storage
          this.router.navigateByUrl('/home');
        },
        error: error => {
          console.error('Login error:', error);
          this.signinError = 'Invalid email or password.';
        }
      });
  }
  
}
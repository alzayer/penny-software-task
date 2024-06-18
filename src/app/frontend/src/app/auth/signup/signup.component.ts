import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  signupError: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  onSubmit(): void {

    if (!this.email || !this.password || !this.username) {
      this.signupError = 'Please enter both email and password.';
      return;
    }

    this.authService.signup(this.username ,this.email, this.password)
      .subscribe({
        next: response => {
          // console.log('Token:', response.token);
          this.authService.setToken(response.token);
          this.signupError = null;
          this.router.navigateByUrl('/home');
        },
        error: error => {
          console.error('Login error:', error);
          this.signupError = 'Invalid email or password.';
        }
      });
  }
}
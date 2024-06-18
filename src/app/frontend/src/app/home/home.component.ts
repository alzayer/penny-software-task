import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { isTokenExpired } from '../auth/auth-utils';
import { AuthService } from '../services/auth.service';
import { UserService } from './user.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    MatIconModule
  ],
  animations: [
    // Define the animation
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2000ms', style({ opacity: 1 }))
      ])
    ])
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  users: any[] = [];
  token: string | null = null;
  showWelcomeMessage = true;
  currentUserName: string = '';
  private intervalId: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.fetchUsers();
      this.token = this.authService.getToken();
      // console.log('Token:', this.token);

      // Fetch the current user's name
      if (this.token) {
        this.getCurrentUserName(this.token);
      }

      // Set up token expiration check
      this.checkTokenExpiration();
      this.intervalId = setInterval(() => {
        this.checkTokenExpiration();
      }, 60000); // 60000ms = 1 minute
      
    } else {
      // Redirect to signin page if not logged in
      this.router.navigate(['/signin']);
    }
  }

  ngOnDestroy(): void {
    // Clear the interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.users = data;
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }

  private checkTokenExpiration(): void {
    if (this.token && isTokenExpired(this.token)) {
      this.logout();
    }
  }

  private getCurrentUserName(token: string): void {
    this.userService.decodeToken(token).subscribe({
      next: (response: any) => {
        const userId = response.id;

        // Fetch the user's name
        this.userService.getUserNameById(userId).subscribe({
          next: (response: any) => {
            this.currentUserName = response.name;
          },
          error: (error: any) => {
            console.error('Error fetching user name:', error);
          }
        });
      },
      error: (error: any) => {
        console.error('Error decoding token:', error);
      }
    });
  }

  redirectToEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }
}

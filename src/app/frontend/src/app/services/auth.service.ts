import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private localStorageKey = 'authToken';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    const loginDto = { email, password };
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, loginDto);
  }

  signup(name: string, email: string, password: string): Observable<{ token: string }> {
    const signupData = { name, email, password };
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/signup`, signupData);
  }

  logout(): void {
    localStorage.removeItem(this.localStorageKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.localStorageKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.localStorageKey, token);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

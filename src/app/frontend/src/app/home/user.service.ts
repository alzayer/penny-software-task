import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllUsers(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/users`, { headers });
  }
  
  getUserNameById(id: string): Observable<{ name: string }> {
    return this.http.get<{ name: string }>(`${this.apiUrl}/user/${id}/name`);
  }

  decodeToken(token: string): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.apiUrl}/decode-token`, { token });
  }
}

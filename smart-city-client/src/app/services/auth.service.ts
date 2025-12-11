import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface User {
  username: string;
  roles: string[];
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'smart_city_auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Predefined users matching Spring Security configuration
  private readonly validUsers = [
    { username: 'admin', password: 'admin123', roles: ['ADMIN', 'USER'] },
    { username: 'user', password: 'user123', roles: ['USER'] }
  ];

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const auth = JSON.parse(stored);
        this.currentUserSubject.next(auth.user);
      } catch {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    // Validate against predefined users (matching Spring Security config)
    const user = this.validUsers.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      const authUser: User = {
        username: user.username,
        roles: user.roles
      };

      // Store auth data with base64 encoded credentials for API calls
      const credentials = btoa(`${username}:${password}`);
      const authData = {
        user: authUser,
        credentials: credentials
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
      this.currentUserSubject.next(authUser);

      return of({ success: true, user: authUser });
    }

    return of({ success: false, message: 'Invalid username or password' });
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAuthCredentials(): string | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const auth = JSON.parse(stored);
        return auth.credentials;
      } catch {
        return null;
      }
    }
    return null;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }
}

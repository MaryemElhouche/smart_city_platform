import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <!-- Animated Background -->
      <div class="background-animation">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
          <div class="shape shape-5"></div>
        </div>
      </div>

      <div class="login-wrapper">
        <!-- Left Side - Branding -->
        <div class="branding-side">
          <div class="branding-content">
            <div class="logo-container">
              <div class="logo-icon">
                <i class="fas fa-city"></i>
              </div>
              <h1>Smart City</h1>
              <p class="tagline">Platform</p>
            </div>
            
            <div class="features-list">
              <div class="feature-item">
                <div class="feature-icon">
                  <i class="fas fa-bus"></i>
                </div>
                <div class="feature-text">
                  <h4>Mobility Management</h4>
                  <p>Track vehicles, routes & schedules</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <i class="fas fa-ambulance"></i>
                </div>
                <div class="feature-text">
                  <h4>Emergency Response</h4>
                  <p>Real-time incident management</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <i class="fas fa-wind"></i>
                </div>
                <div class="feature-text">
                  <h4>Air Quality Monitoring</h4>
                  <p>Environmental data & alerts</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="feature-text">
                  <h4>Data Analytics</h4>
                  <p>Insights & visualization</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="form-side">
          <div class="login-form-container">
            <div class="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to access your dashboard</p>
            </div>

            @if (errorMessage) {
              <div class="error-alert">
                <i class="fas fa-exclamation-circle"></i>
                {{ errorMessage }}
              </div>
            }

            <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
              <div class="form-group">
                <label for="username">
                  <i class="fas fa-user"></i>
                  Username
                </label>
                <div class="input-wrapper">
                  <input 
                    type="text" 
                    id="username" 
                    name="username"
                    [(ngModel)]="username" 
                    required
                    placeholder="Enter your username"
                    [class.invalid]="usernameError"
                    (focus)="clearErrors()"
                  >
                  <span class="input-icon">
                    <i class="fas fa-user"></i>
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label for="password">
                  <i class="fas fa-lock"></i>
                  Password
                </label>
                <div class="input-wrapper">
                  <input 
                    [type]="showPassword ? 'text' : 'password'" 
                    id="password" 
                    name="password"
                    [(ngModel)]="password" 
                    required
                    placeholder="Enter your password"
                    [class.invalid]="passwordError"
                    (focus)="clearErrors()"
                  >
                  <span class="input-icon">
                    <i class="fas fa-lock"></i>
                  </span>
                  <button 
                    type="button" 
                    class="toggle-password"
                    (click)="togglePassword()"
                  >
                    <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="form-options">
                <label class="remember-me">
                  <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
                  <span class="checkmark"></span>
                  Remember me
                </label>
              </div>

              <button 
                type="submit" 
                class="login-btn"
                [disabled]="isLoading"
              >
                @if (isLoading) {
                  <span class="spinner"></span>
                  Signing in...
                } @else {
                  <i class="fas fa-sign-in-alt"></i>
                  Sign In
                }
              </button>
            </form>

            <div class="demo-credentials">
              <p><i class="fas fa-info-circle"></i> Demo Credentials</p>
              <div class="credentials-grid">
                <button class="credential-btn" (click)="fillCredentials('admin', 'admin123')">
                  <i class="fas fa-user-shield"></i>
                  <span>Admin</span>
                </button>
                <button class="credential-btn" (click)="fillCredentials('user', 'user123')">
                  <i class="fas fa-user"></i>
                  <span>User</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    /* Animated Background */
    .background-animation {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .floating-shapes {
      position: absolute;
      inset: 0;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 20s infinite ease-in-out;
    }

    .shape-1 { width: 400px; height: 400px; top: -200px; left: -100px; animation-delay: 0s; }
    .shape-2 { width: 300px; height: 300px; top: 50%; right: -150px; animation-delay: -5s; }
    .shape-3 { width: 200px; height: 200px; bottom: -100px; left: 30%; animation-delay: -10s; }
    .shape-4 { width: 150px; height: 150px; top: 20%; left: 50%; animation-delay: -15s; }
    .shape-5 { width: 250px; height: 250px; bottom: 10%; right: 20%; animation-delay: -7s; }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-20px) rotate(5deg); }
      50% { transform: translateY(0) rotate(0deg); }
      75% { transform: translateY(20px) rotate(-5deg); }
    }

    .login-wrapper {
      display: flex;
      max-width: 1000px;
      width: 100%;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
      z-index: 1;
    }

    /* Branding Side */
    .branding-side {
      flex: 1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 48px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .branding-side::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .branding-content {
      position: relative;
      z-index: 1;
    }

    .logo-container {
      text-align: center;
      margin-bottom: 48px;
    }

    .logo-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 36px;
      backdrop-filter: blur(10px);
    }

    .logo-container h1 {
      font-size: 32px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .tagline {
      font-size: 18px;
      opacity: 0.9;
      margin: 4px 0 0;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      transition: transform 0.3s, background 0.3s;
    }

    .feature-item:hover {
      transform: translateX(8px);
      background: rgba(255, 255, 255, 0.15);
    }

    .feature-icon {
      width: 44px;
      height: 44px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .feature-text h4 {
      font-size: 15px;
      font-weight: 600;
      margin: 0 0 4px;
    }

    .feature-text p {
      font-size: 13px;
      opacity: 0.8;
      margin: 0;
    }

    /* Form Side */
    .form-side {
      flex: 1;
      padding: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
    }

    .login-form-container {
      width: 100%;
      max-width: 360px;
    }

    .form-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .form-header h2 {
      font-size: 28px;
      font-weight: 700;
      color: var(--gray-800);
      margin: 0 0 8px;
    }

    .form-header p {
      color: var(--gray-500);
      margin: 0;
    }

    .error-alert {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 10px;
      color: #dc2626;
      font-size: 14px;
      margin-bottom: 24px;
      animation: shake 0.5s ease;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-700);
      margin-bottom: 8px;
    }

    .form-group label i {
      color: var(--gray-400);
      font-size: 12px;
    }

    .input-wrapper {
      position: relative;
    }

    .input-wrapper input {
      width: 100%;
      padding: 14px 16px 14px 44px;
      border: 2px solid var(--gray-200);
      border-radius: 10px;
      font-size: 15px;
      transition: all 0.3s;
      background: var(--gray-50);
    }

    .input-wrapper input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .input-wrapper input.invalid {
      border-color: #dc2626;
    }

    .input-wrapper .input-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--gray-400);
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--gray-400);
      padding: 4px;
      cursor: pointer;
    }

    .toggle-password:hover {
      color: var(--gray-600);
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--gray-600);
      cursor: pointer;
    }

    .remember-me input {
      display: none;
    }

    .checkmark {
      width: 18px;
      height: 18px;
      border: 2px solid var(--gray-300);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .remember-me input:checked + .checkmark {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
    }

    .remember-me input:checked + .checkmark::after {
      content: '\\f00c';
      font-family: 'Font Awesome 6 Free';
      font-weight: 900;
      font-size: 10px;
      color: white;
    }

    .login-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .demo-credentials {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--gray-200);
    }

    .demo-credentials > p {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--gray-500);
      margin-bottom: 12px;
    }

    .credentials-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .credential-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 14px;
      background: var(--gray-50);
      border: 2px solid var(--gray-200);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .credential-btn:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }

    .credential-btn i {
      font-size: 20px;
      color: #667eea;
    }

    .credential-btn span {
      font-size: 13px;
      font-weight: 500;
      color: var(--gray-700);
    }

    /* Responsive */
    @media (max-width: 900px) {
      .login-wrapper {
        flex-direction: column;
        max-width: 480px;
      }

      .branding-side {
        padding: 32px;
      }

      .features-list {
        display: none;
      }

      .logo-container {
        margin-bottom: 0;
      }

      .form-side {
        padding: 32px;
      }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  usernameError = false;
  passwordError = false;
  returnUrl = '/mobility/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/mobility/dashboard']);
    }

    // Get return URL from query params
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/mobility/dashboard';
    });
  }

  onSubmit(): void {
    this.clearErrors();

    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      this.usernameError = !this.username;
      this.passwordError = !this.password;
      return;
    }

    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.errorMessage = response.message || 'Login failed';
          this.usernameError = true;
          this.passwordError = true;
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred. Please try again.';
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  clearErrors(): void {
    this.errorMessage = '';
    this.usernameError = false;
    this.passwordError = false;
  }

  fillCredentials(username: string, password: string): void {
    this.username = username;
    this.password = password;
    this.clearErrors();
  }
}

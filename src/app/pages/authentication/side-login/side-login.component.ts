import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
  styleUrl: './side-login.component.scss',
})
export class AppSideLoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.syncUser(response.user);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error al iniciar sesión';
        }
      });
    }
  }

  loginWithGoogle(): void {
    try {
      debugger;
    this.authService.signInWithGoogle().subscribe({
      next: (response) => {
        this.syncUser(response.user);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al iniciar sesión con Google';
      }
    });
    } catch (error) {
      console.error(`Failde login with Gmail ${error}`)
    }
    
  }

  private syncUser(user: any) {
    try {
      debugger;
      this.authService.syncUserWithBackend(user).subscribe({
        error: (error) => console.error('Error sincronizando usuario:', error)
      });
    } catch (error) {
      console.error(`Failed syncUser ${error}`)
    }
  }

  loginWithFacebook(): void {
    // Implementación futura de Facebook
    console.log('Facebook login clicked');
  }
}
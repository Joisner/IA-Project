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
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-register.component.html',
  styleUrl: './side-register.component.scss'
})
export class AppSideRegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, { 
      validators: this.passwordMatchValidator // Aquí debe estar la referencia al validador
    });
  }

  ngOnInit(): void { }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;

      this.authService.register(email, password).subscribe({
        next: (result) => {
          console.log('Usuario registrado:', result.user);

          // Sincronizar con el backend
          const userPayload = {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
          };

          this.authService.syncUserWithBackend(userPayload).subscribe({
            next: () => console.log('Usuario sincronizado con el backend'),
            error: (error) => console.error('Error al sincronizar usuario:', error),
          });

          // Navegar al dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error durante el registro:', error.message);
        },
      });
    } else {
      console.error('Formulario inválido');
    }
  }

  registerWithGoogle(): void {
    debugger;
    this.authService.signInWithGoogle().subscribe({
      next: (response) => {
        this.syncUser(response.user);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al iniciar sesión con Google';
        console.error('Error al iniciar sesión con Google:', error);
      }
    });
  }

  private syncUser(user: any): void {
    try {
      debugger;
      this.authService.syncUserWithBackend(user).subscribe({
        error: (error) => console.error('Error sincronizando usuario:', error)
      });
    } catch (error) {
      console.error(`Failed syncUser ${error}`)
    }
  }

  registerWithFacebook(): void {
    console.log('Facebook registration clicked');
  }
}
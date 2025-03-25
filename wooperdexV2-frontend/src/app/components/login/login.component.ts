import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../../firebase-auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  
  loginForm!: FormGroup;
  errorMessage: string = '';

  private fb = inject(FormBuilder);
  private authService = inject(FirebaseAuthService);
  private router= inject(Router);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    try {
      await this.authService.signInWithEmailandPassword(email, password);
      this.router.navigate(['/homepage']);
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = error.message;
    }
  }

  async onSignUp(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    try {
      await this.authService.signUpWithEmailandPassword(email, password);
      this.router.navigate(['/homepage']);
    } catch (error: any) {
      console.error('Sign-Up error:', error);
      this.errorMessage = error.message;
    }
  }

  async onGoogleSignIn(): Promise<void> {
    try {
      const user = await this.authService.signInWithGoogle();
      if (user) {
        this.router.navigate(['/teams']);
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      this.errorMessage = error.message;
    }
  }
}



import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../../firebase-auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private authService = inject(FirebaseAuthService);
  private router = inject(Router);

  errorMessage: string = '';

  async onGoogleSignIn(): Promise<void> {
    try {
      const user = await this.authService.signInWithGoogle();
      if (user) {
        this.router.navigate(['/teams']);
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      this.errorMessage =
        error.message || 'Failed to sign in with Google. Please try again.';
    }
  }
}

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private _auth = inject(AuthService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  error = '';
  readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    pnr: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  login(): void {
    if (this.loginForm.invalid) {
      this.error = 'Rellena todos los campos.';
      return;
    }

    this.error = '';
    const { email, pnr } = this.loginForm.getRawValue();
    this._auth.login({ email, pnr });
    const returnUrl = this._route.snapshot.queryParams['returnUrl'] ?? '/';
    this._router.navigateByUrl(returnUrl);
  }
}

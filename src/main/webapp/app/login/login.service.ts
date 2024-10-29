import { Injectable, inject } from '@angular/core';
import { Location } from '@angular/common';

import { AuthServerProvider } from 'app/core/auth/auth-session.service';
import { Logout } from './logout.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly location = inject(Location);
  private readonly authServerProvider = inject(AuthServerProvider);

  login(): void {
    // If you have configured multiple OIDC providers, then, you can update this URL to /login.
    // It will show a Spring Security generated login page with links to configured OIDC providers.
    location.href = `${location.origin}${this.location.prepareExternalUrl('oauth2/authorization/oidc')}`;
  }

  logout(): void {
    this.authServerProvider.logout().subscribe((logout: Logout) => {
      window.location.href = logout.logoutUrl;
    });
  }
}

import { Service, inject } from '@angular/core';

import { AuthServerProvider, Logout } from 'app/core/auth';

@Service()
export class LoginService {
  private readonly authServerProvider = inject(AuthServerProvider);

  login(): void {
    this.authServerProvider.login();
  }

  logout(): void {
    this.authServerProvider.logout().subscribe((logout: Logout) => {
      window.location.href = logout.logoutUrl;
    });
  }
}

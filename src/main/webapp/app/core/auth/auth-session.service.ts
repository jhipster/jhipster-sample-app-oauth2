import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

import { Logout } from './logout.model';

@Service()
export class AuthServerProvider {
  private readonly http = inject(HttpClient);
  private readonly location = inject(Location);

  login(): void {
    // If you have configured multiple OIDC providers, then, you can update this URL to /login.
    // It will show a Spring Security generated login page with links to configured OIDC providers.
    window.location.href = `${window.location.origin}${this.location.prepareExternalUrl('oauth2/authorization/oidc')}`;
  }

  logout(): Observable<Logout> {
    return this.http.post<Logout>(`${serverApiUrl}api/logout`, {});
  }
}

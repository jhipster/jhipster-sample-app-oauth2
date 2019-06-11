import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-session.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private accountService: AccountService, private location: Location, private authServerProvider: AuthServerProvider) {}

  login() {
    // If you have configured multiple OIDC providers, then, you can update this URL to /login.
    // It will show a Spring Security generated login page with links to configured OIDC providers.
    location.href = `${location.origin}${this.location.prepareExternalUrl('oauth2/authorization/oidc')}`;
  }

  logout() {
    this.authServerProvider.logout().subscribe(response => {
      const data = response.body;
      let logoutUrl = data.logoutUrl;
      // if Keycloak, uri has protocol/openid-connect/token
      if (logoutUrl.indexOf('/protocol') > -1) {
        logoutUrl = logoutUrl + '?redirect_uri=' + window.location.origin;
      } else {
        // Okta
        logoutUrl = logoutUrl + '?id_token_hint=' + data.idToken + '&post_logout_redirect_uri=' + window.location.origin;
      }
      window.location.href = logoutUrl;
    });
  }
}

import { Injectable } from '@angular/core';

import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-session.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
    constructor(private accountService: AccountService, private authServerProvider: AuthServerProvider) {}

    login() {
        const port = location.port ? ':' + location.port : '';
        location.href = '//' + location.hostname + port + location.pathname + 'login';
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

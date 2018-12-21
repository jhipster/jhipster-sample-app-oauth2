import { Injectable } from '@angular/core';

import { AccountService } from '../auth/account.service';
import { AuthServerProvider } from '../auth/auth-session.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
    constructor(private accountService: AccountService, private authServerProvider: AuthServerProvider) {}

    login() {
        let port = location.port ? ':' + location.port : '';
        if (port === ':9000') {
            port = ':8080';
        }
        location.href = '//' + location.hostname + port + location.pathname + 'login';
    }

    logout() {
        this.authServerProvider.logout().subscribe();
        this.accountService.authenticate(null);
    }
}

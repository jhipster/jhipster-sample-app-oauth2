import { Component, inject } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [TranslateDirective, TranslateModule],
})
export default class Home {
  public readonly account = inject(AccountService).account;

  private readonly loginService = inject(LoginService);

  login(): void {
    this.loginService.login();
  }
}

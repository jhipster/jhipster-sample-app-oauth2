import { Component, OnInit, inject, signal } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [TranslateDirective, TranslateModule],
})
export default class Home implements OnInit {
  account = signal<Account | null>(null);

  private readonly accountService = inject(AccountService);
  private readonly loginService = inject(LoginService);

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => this.account.set(account));
  }

  login(): void {
    this.loginService.login();
  }
}

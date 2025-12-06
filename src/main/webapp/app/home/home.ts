import { Component, OnInit, inject, signal } from '@angular/core';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [SharedModule],
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

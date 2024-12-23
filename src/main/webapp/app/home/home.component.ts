import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule],
})
export default class HomeComponent implements OnInit {
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

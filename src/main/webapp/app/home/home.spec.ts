import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';

import Home from './home';

describe('Home Component', () => {
  let comp: Home;
  let fixture: ComponentFixture<Home>;
  let mockAccountService: AccountService;
  let mockLoginService: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: AccountService,
          useValue: {
            isAuthenticated: vitest.fn(),
          },
        },
        {
          provide: LoginService,
          useValue: {
            login: vitest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Home);
    comp = fixture.componentInstance;
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = vitest.fn(() => of(null));
    mockLoginService = TestBed.inject(LoginService);
  });

  describe('login', () => {
    it('should call loginService.login on login', () => {
      // WHEN
      comp.login();

      // THEN
      expect(mockLoginService.login).toHaveBeenCalled();
    });
  });
});

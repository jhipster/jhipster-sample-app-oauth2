import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';

import Home from './home';

describe('Home Component', () => {
  let comp: Home;
  let fixture: ComponentFixture<Home>;
  let mockAccountService: AccountService;
  let mockLoginService: LoginService;
  const account: Account = {
    activated: true,
    authorities: [],
    email: '',
    firstName: null,
    langKey: '',
    lastName: null,
    login: 'login',
    imageUrl: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: AccountService,
          useValue: {
            isAuthenticated: jest.fn(),
          },
        },
        {
          provide: LoginService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Home);
    comp = fixture.componentInstance;
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(null));
    mockLoginService = TestBed.inject(LoginService);
  });

  describe('ngOnInit', () => {
    it('should synchronize account variable with current account', () => {
      // GIVEN
      mockAccountService.identity = jest.fn(() => of(account));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.account()).toEqual(account);
    });
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

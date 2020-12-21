jest.mock('app/core/auth/account.service');

jest.mock('app/login/login.service');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';

import { HomeComponent } from './home.component';

describe('Component Tests', () => {
  describe('Home Component', () => {
    let comp: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let mockAccountService: AccountService;
    let mockLoginService: LoginService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [HomeComponent],
          providers: [AccountService, LoginService],
        })
          .overrideTemplate(HomeComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(HomeComponent);
      comp = fixture.componentInstance;
      mockAccountService = TestBed.inject(AccountService);
      mockAccountService.identity = jest.fn(() => of(null));
      mockAccountService.getAuthenticationState = jest.fn(() => of(null));
      mockLoginService = TestBed.inject(LoginService);
    });

    it('Should call accountService.isAuthenticated when it checks authentication', () => {
      // WHEN
      comp.isAuthenticated();

      // THEN
      expect(mockAccountService.isAuthenticated).toHaveBeenCalled();
    });

    it('Should call loginService.login on login', () => {
      // WHEN
      comp.login();

      // THEN
      expect(mockLoginService.login).toHaveBeenCalled();
    });
  });
});

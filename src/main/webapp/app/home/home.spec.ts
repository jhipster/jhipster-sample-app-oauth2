import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTranslateService } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth';
import { LoginService } from 'app/login/login.service';

import Home from './home';

describe('Home Component', () => {
  let comp: Home;
  let fixture: ComponentFixture<Home>;
  let mockLoginService: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        {
          provide: AccountService,
        },
        {
          provide: LoginService,
          useValue: {
            login: vi.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Home);
    comp = fixture.componentInstance;
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

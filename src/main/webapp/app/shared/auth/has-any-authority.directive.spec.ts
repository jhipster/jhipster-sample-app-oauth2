import { provideHttpClient } from '@angular/common/http';
import { Component, ElementRef, WritableSignal, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';

import HasAnyAuthorityDirective from './has-any-authority.directive';

@Component({
  imports: [HasAnyAuthorityDirective],
  template: `<div *jhiHasAnyAuthority="'ROLE_ADMIN'" #content></div>`,
})
class TestHasAnyAuthorityDirective {
  content = viewChild<ElementRef>('content');
}

describe('HasAnyAuthorityDirective tests', () => {
  let mockAccountService: AccountService;
  let currentAccount: WritableSignal<Account | null>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        {
          provide: AccountService,
          useValue: {
            isAuthenticated: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    mockAccountService = TestBed.inject(AccountService);
    currentAccount = signal<Account | null>({ activated: true, authorities: [] } as any);
    mockAccountService.trackCurrentAccount = jest.fn(() => currentAccount);
  });

  describe('set jhiHasAnyAuthority', () => {
    it('should show restricted content to user if user has required role', () => {
      // GIVEN
      mockAccountService.hasAnyAuthority = jest.fn(() => true);
      const fixture = TestBed.createComponent(TestHasAnyAuthorityDirective);
      const comp = fixture.componentInstance;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeDefined();
    });

    it('should not show restricted content to user if user has not required role', () => {
      // GIVEN
      mockAccountService.hasAnyAuthority = jest.fn(() => false);
      const fixture = TestBed.createComponent(TestHasAnyAuthorityDirective);
      const comp = fixture.componentInstance;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content()).toBeUndefined();
    });
  });

  describe('change authorities', () => {
    it('should show or not show restricted content correctly if user authorities are changing', () => {
      // GIVEN
      mockAccountService.hasAnyAuthority = jest.fn((): boolean => Boolean(currentAccount()));
      const fixture = TestBed.createComponent(TestHasAnyAuthorityDirective);
      const comp = fixture.componentInstance;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content()).toBeDefined();

      // GIVEN
      currentAccount.set(null);

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content()).toBeUndefined();

      // WHEN
      currentAccount.set({ activated: true, authorities: ['foo'] } as any);
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeDefined();
    });
  });
});

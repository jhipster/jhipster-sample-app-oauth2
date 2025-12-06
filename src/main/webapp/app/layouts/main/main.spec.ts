import { DOCUMENT } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, TitleStrategy } from '@angular/router';

import { InterpolatableTranslationObject, LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';

import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import { AccountService } from 'app/core/auth/account.service';

import Main from './main';

describe('Main', () => {
  let comp: Main;
  let fixture: ComponentFixture<Main>;
  let titleService: Title;
  let translateService: TranslateService;
  let langChangeSubject: Subject<LangChangeEvent>;
  const routerState: any = { snapshot: { root: { data: {} } } };
  let router: Router;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        Title,
        {
          provide: AccountService,
          useValue: {
            identity: jest.fn(() => of(null)),
          },
        },
        { provide: TitleStrategy, useClass: AppPageTitleStrategy },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Main);
    comp = fixture.componentInstance;
    titleService = TestBed.inject(Title);
    translateService = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
    document = TestBed.inject(DOCUMENT);
    langChangeSubject = new Subject<LangChangeEvent>();
    Object.defineProperty(translateService, 'onLangChange', {
      value: langChangeSubject,
      writable: true,
    });
  });

  describe('page title', () => {
    const defaultPageTitle = 'global.title';
    const parentRoutePageTitle = 'parentTitle';
    const childRoutePageTitle = 'childTitle';
    const langChangeEvent: LangChangeEvent = { lang: 'en', translations: {} as InterpolatableTranslationObject };

    beforeEach(() => {
      routerState.snapshot.root = { data: {} };
      jest.spyOn(translateService, 'get').mockImplementation((key: string | string[]) => of(`${key as string} translated`));
      jest.spyOn(translateService, 'getCurrentLang').mockReturnValue('en');
      jest.spyOn(titleService, 'setTitle');
      comp.ngOnInit();
    });

    describe('navigation end', () => {
      it('should set page title to default title if pageTitle is missing on routes', async () => {
        // WHEN
        await router.navigateByUrl('');

        // THEN
        expect(document.title).toBe(`${defaultPageTitle} translated`);
      });

      it('should set page title to root route pageTitle if there is no child routes', async () => {
        // GIVEN
        router.resetConfig([{ path: '', title: parentRoutePageTitle, component: Blank }]);

        // WHEN
        await router.navigateByUrl('');

        // THEN
        expect(document.title).toBe(`${parentRoutePageTitle} translated`);
      });

      it('should set page title to child route pageTitle if child routes exist and pageTitle is set for child route', async () => {
        // GIVEN
        router.resetConfig([
          {
            path: 'home',
            title: parentRoutePageTitle,
            children: [{ path: '', title: childRoutePageTitle, component: Blank }],
          },
        ]);

        // WHEN
        await router.navigateByUrl('home');

        // THEN
        expect(document.title).toBe(`${childRoutePageTitle} translated`);
      });

      it('should set page title to parent route pageTitle if child routes exists but pageTitle is not set for child route data', async () => {
        // GIVEN
        router.resetConfig([
          {
            path: 'home',
            title: parentRoutePageTitle,
            children: [{ path: '', component: Blank }],
          },
        ]);

        // WHEN
        await router.navigateByUrl('home');

        // THEN
        expect(document.title).toBe(`${parentRoutePageTitle} translated`);
      });
    });

    describe('language change', () => {
      it('should set page title to default title if pageTitle is missing on routes', () => {
        // WHEN
        langChangeSubject.next(langChangeEvent);

        // THEN
        expect(document.title).toBe(`${defaultPageTitle} translated`);
      });

      it('should set page title to root route pageTitle if there is no child routes', async () => {
        // GIVEN
        routerState.snapshot.root.data = { pageTitle: parentRoutePageTitle };
        router.resetConfig([{ path: '', title: parentRoutePageTitle, component: Blank }]);

        // WHEN
        await router.navigateByUrl('');

        // THEN
        expect(document.title).toBe(`${parentRoutePageTitle} translated`);

        // GIVEN
        document.title = 'other title';

        // WHEN
        langChangeSubject.next(langChangeEvent);

        // THEN
        expect(document.title).toBe(`${parentRoutePageTitle} translated`);
      });

      it('should set page title to child route pageTitle if child routes exist and pageTitle is set for child route', async () => {
        // GIVEN
        router.resetConfig([
          {
            path: 'home',
            title: parentRoutePageTitle,
            children: [{ path: '', title: childRoutePageTitle, component: Blank }],
          },
        ]);

        // WHEN
        await router.navigateByUrl('home');

        // THEN
        expect(document.title).toBe(`${childRoutePageTitle} translated`);

        // GIVEN
        document.title = 'other title';

        // WHEN
        langChangeSubject.next(langChangeEvent);

        // THEN
        expect(document.title).toBe(`${childRoutePageTitle} translated`);
      });

      it('should set page title to parent route pageTitle if child routes exists but pageTitle is not set for child route data', async () => {
        // GIVEN
        router.resetConfig([
          {
            path: 'home',
            title: parentRoutePageTitle,
            children: [{ path: '', component: Blank }],
          },
        ]);

        // WHEN
        await router.navigateByUrl('home');

        // THEN
        expect(document.title).toBe(`${parentRoutePageTitle} translated`);

        // GIVEN
        document.title = 'other title';

        // WHEN
        langChangeSubject.next(langChangeEvent);

        // THEN
        expect(document.title).toBe(`${parentRoutePageTitle} translated`);
      });
    });
  });

  describe('page language attribute', () => {
    it('should change page language attribute on language change', () => {
      // GIVEN
      comp.ngOnInit();

      // WHEN
      langChangeSubject.next({ lang: 'lang1', translations: {} as InterpolatableTranslationObject });

      // THEN
      expect(document.querySelector('html')?.getAttribute('lang')).toEqual('lang1');

      // WHEN
      langChangeSubject.next({ lang: 'lang2', translations: {} as InterpolatableTranslationObject });

      // THEN
      expect(document.querySelector('html')?.getAttribute('lang')).toEqual('lang2');
    });
  });
});

@Component({
  template: '',
})
export class Blank {}

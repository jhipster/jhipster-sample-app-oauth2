import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('administration', () => {
    let navBarPage: NavBarPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage(true);
        navBarPage.getSignInPage().loginWithOAuth('admin', 'admin');
        browser.waitForAngular();
    });

    beforeEach(() => {
        navBarPage.clickOnAdminMenu();
    });

    it('should load metrics', () => {
        navBarPage.clickOnAdmin('jhi-metrics');
        const expect1 = /metrics.title/;
        element
            .all(by.css('h2 span'))
            .first()
            .getAttribute('jhiTranslate')
            .then(value => {
                expect(value).toMatch(expect1);
            });
    });

    it('should load health', () => {
        navBarPage.clickOnAdmin('jhi-health');
        const expect1 = /health.title/;
        element
            .all(by.css('h2 span'))
            .first()
            .getAttribute('jhiTranslate')
            .then(value => {
                expect(value).toMatch(expect1);
            });
    });

    it('should load configuration', () => {
        navBarPage.clickOnAdmin('jhi-configuration');
        const expect1 = /configuration.title/;
        element
            .all(by.css('h2'))
            .first()
            .getAttribute('jhiTranslate')
            .then(value => {
                expect(value).toMatch(expect1);
            });
    });

    it('should load audits', () => {
        navBarPage.clickOnAdmin('audits');
        const expect1 = /audits.title/;
        element
            .all(by.css('h2'))
            .first()
            .getAttribute('jhiTranslate')
            .then(value => {
                expect(value).toMatch(expect1);
            });
    });

    it('should load logs', () => {
        navBarPage.clickOnAdmin('logs');
        const expect1 = /logs.title/;
        element
            .all(by.css('h2'))
            .first()
            .getAttribute('jhiTranslate')
            .then(value => {
                expect(value).toMatch(expect1);
            });
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

import { browser, element, by, ExpectedConditions as ec } from 'protractor';

import { NavBarPage, SignInPage } from '../page-objects/jhi-page-objects';

const expect = chai.expect;

describe('account', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage(true);
  });

  it('should fail to login with bad password', async () => {
    const expect1 = 'home.title';
    const value1 = await element(by.css('h1 > span')).getAttribute('jhiTranslate');
    expect(value1).to.eq(expect1);
    signInPage = await navBarPage.getSignInPage();
    await signInPage.loginWithOAuth(username, 'foo');

    // Keycloak
    const alert = element(by.css('#input-error'));
    if (await alert.isPresent()) {
      expect(await alert.getText()).to.eq('Invalid username or password.');
    } else {
      // Okta
      const error = element(by.css('.infobox-error'));
      await browser.wait(ec.presenceOf(error), 5000);
      expect(await error.getText()).to.eq('Unable to sign in');
    }
  });

  it('should login successfully with admin account', async () => {
    await signInPage.clearPassword();
    await signInPage.loginWithOAuth('', password);

    const expect2 = 'home.logged.message';
    await browser.wait(ec.visibilityOf(element(by.id('home-logged-message'))));
    const value2 = await element(by.id('home-logged-message')).getAttribute('jhiTranslate');
    expect(value2).to.eq(expect2);
  });

  it('should navigate to 404 not found error page on non existing route and show user own navbar if valid authentication exists', async () => {
    // don't sign out and refresh page with non existing route
    await browser.get('/this-is-link-to-non-existing-page');

    // should navigate to 404 not found page
    const url = await browser.getCurrentUrl();
    expect(url).to.endWith('404');

    // as user is admin then should show admin menu to user
    await navBarPage.clickOnAdminMenu();
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

/* eslint-disable @typescript-eslint/no-namespace */

// ***********************************************
// This commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// ***********************************************
// Begin Specific Selector Attributes for Cypress
// ***********************************************

// Navbar
export const navbarSelector = '[data-cy="navbar"]';
export const adminMenuSelector = '[data-cy="adminMenu"]';
export const accountMenuSelector = '[data-cy="accountMenu"]';
export const registerItemSelector = '[data-cy="register"]';
export const settingsItemSelector = '[data-cy="settings"]';
export const passwordItemSelector = '[data-cy="passwordItem"]';
export const loginItemSelector = '[data-cy="login"]';
export const logoutItemSelector = '[data-cy="logout"]';
export const entityItemSelector = '[data-cy="entity"]';

// Administration
export const swaggerFrameSelector = 'iframe[data-cy="swagger-frame"]';
export const swaggerPageSelector = '[id="swagger-ui"]';
export const metricsPageHeadingSelector = '[data-cy="metricsPageHeading"]';
export const healthPageHeadingSelector = '[data-cy="healthPageHeading"]';
export const logsPageHeadingSelector = '[data-cy="logsPageHeading"]';
export const configurationPageHeadingSelector = '[data-cy="configurationPageHeading"]';

// ***********************************************
// End Specific Selector Attributes for Cypress
// ***********************************************

export const classInvalid = 'ng-invalid';

export const classValid = 'ng-valid';

Cypress.Commands.add('authenticatedRequest', data => {
  return cy.getCookie('XSRF-TOKEN').then(csrfCookie => {
    return cy.request({
      ...data,
      headers: {
        ...data.headers,
        'X-XSRF-TOKEN': csrfCookie?.value,
      },
    });
  });
});

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session(
    [username, password],
    () => {
      cy.getOauth2Data();
      cy.get('@oauth2Data').then(oauth2Data => {
        cy.oauthLogin(oauth2Data, username, password);
      });
    },
    {
      validate() {
        cy.authenticatedRequest({ url: '/api/account' }).its('status').should('eq', 200);
      },
    },
  );
});

export interface Credentials {
  adminUsername: string;
  adminPassword: string;
  username: string;
  password: string;
}

Cypress.Commands.add('credentials', () => {
  return cy.env(['E2E_USERNAME', 'E2E_PASSWORD']).then(({ E2E_USERNAME, E2E_PASSWORD }) => {
    return {
      adminUsername: E2E_USERNAME ?? Cypress.expose('adminUsername'),
      adminPassword: E2E_PASSWORD ?? Cypress.expose('adminPassword'),
      username: E2E_USERNAME ?? Cypress.expose('username'),
      password: E2E_PASSWORD ?? Cypress.expose('password'),
    };
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      authenticatedRequest(data): Cypress.Chainable;
      login(username: string, password: string): Cypress.Chainable;
      credentials(): Cypress.Chainable<Credentials>;
    }
  }
}

import 'cypress-audit/commands';
// Convert this to a module instead of a script (allows import/export)
export {};

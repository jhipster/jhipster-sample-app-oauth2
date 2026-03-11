# jhipsterOauth2SampleApplication

This application was generated using JHipster 9.0.0, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v9.0.0](https://www.jhipster.tech/documentation-archive/v9.0.0).

## Project Structure

Node is required for generation and recommended for development. `package.json` is always generated for a better development experience with prettier, commit hooks, scripts and so on.

In the project root, JHipster generates configuration files for tools like git, prettier, eslint, husky, and others that are well known and you can find references in the web.

`/src/*` structure follows default Java structure.

- `.yo-rc.json` - Yeoman configuration file
  JHipster configuration is stored in this file at `generator-jhipster` key. You may find `generator-jhipster-*` for specific blueprints configuration.
- `.yo-resolve` (optional) - Yeoman conflict resolver
  Allows to use a specific action when conflicts are found skipping prompts for files that matches a pattern. Each line should match `[pattern] [action]` with pattern been a [Minimatch](https://github.com/isaacs/minimatch#minimatch) pattern and action been one of skip (default if omitted) or force. Lines starting with `#` are considered comments and are ignored.
- `.jhipster/*.json` - JHipster entity configuration files

- `npmw` - wrapper to use locally installed npm.
  JHipster installs Node and npm locally using the build tool by default. This wrapper makes sure npm is installed locally and uses it avoiding some differences different versions can cause. By using `./npmw` instead of the traditional `npm` you can configure a Node-less environment to develop or test your application.
- `/src/main/docker` - Docker configurations for the application and services that the application depends on

## Development

### OAuth 2.0 / OpenID Connect

Congratulations! You've selected an excellent way to secure your JHipster application. If you're not sure what OAuth and OpenID Connect (OIDC) are, please see [What the Heck is OAuth?](https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth)

To log in to your app, you'll need to have [Keycloak](https://keycloak.org) up and running. The JHipster Team has created a Docker container for you that has the default users and roles. Start Keycloak using the following command.

```bash
docker compose -f src/main/docker/keycloak.yml up
```

The security settings in `src/main/resources/config/application.yml` are configured for this image.

```yaml
spring:
  ...
  security:
    oauth2:
      client:
        provider:
          oidc:
            issuer-uri: http://localhost:9080/realms/jhipster
        registration:
          oidc:
            client-id: web_app
            client-secret: web_app
            scope: openid,profile,email
```

Some of Keycloak configuration is now done in build time and the other part before running the app, here is the [list](https://www.keycloak.org/server/all-config) of all build and configuration options.

Before moving to production, please make sure to follow this [guide](https://www.keycloak.org/server/configuration) for better security and performance.

Also, you should never use `start-dev` nor `KC_DB=dev-file` in production.

When using Kubernetes, importing should be done using init-containers (with a volume when using `db=dev-file`).

### Okta

If you'd like to use Okta instead of Keycloak, it's pretty quick.

First, you'll need to create a free developer account at <https://developer.okta.com/signup/>. After doing so, you'll get your own Okta domain, that has a name like `https://dev-123456.okta.com`.

Modify `src/main/resources/config/application.yml` to use your Okta settings.

```yaml
spring:
  ...
  security:
    oauth2:
      client:
        provider:
          oidc:
            issuer-uri: https://{yourOktaDomain}/oauth2/default
        registration:
          oidc:
            client-id: {clientId}
            client-secret: {clientSecret}
security:
```

Create an OIDC App in Okta to get a `{clientId}` and `{clientSecret}`. To do this, log in to your Okta Developer account and navigate to **Applications** > **Add Application**. Click **Web** and click the **Next** button. Give the app a name you’ll remember, specify `http://localhost:8080` as a Base URI, and `http://localhost:8080/login/oauth2/code/oidc` as a Login Redirect URI. Click **Done**, then Edit and add `http://localhost:8080` as a Logout redirect URI. Copy and paste the client ID and secret into your `application.yml` file.

Create a `ROLE_ADMIN` and `ROLE_USER` group and add users into them. Modify e2e tests to use this account when running integration tests.
You'll need to change credentials in `src/test/javascript/e2e/account/account.spec.ts` and `src/test/javascript/e2e/admin/administration.spec.ts`.

Navigate to **API** > **Authorization Servers**, click the **Authorization Servers** tab and edit the default one. Click the **Claims** tab and **Add Claim**. Name it "groups", and include it in the ID Token. Set the value type to "Groups" and set the filter to be a Regex of `.*`.

After making these changes, you should be good to go! If you have any issues, please post them to [Stack Overflow](https://stackoverflow.com/questions/tagged/jhipster). Make sure to tag your question with "jhipster" and "okta".

### Auth0

If you'd like to use [Auth0](https://auth0.com/) instead of Keycloak, follow the configuration steps below:

- Create a free developer account at [Sign Up - Auth0](https://auth0.com/signup). After successful sign-up, your account will be associated with a unique domain like `dev-xxx.us.auth0.com`
- Create a new application of type `Regular Web Applications`. Switch to the `Settings` tab, and configure your application settings like:
  - Allowed Callback URLs: `http://localhost:8080/login/oauth2/code/oidc`
  - Allowed Logout URLs: `http://localhost:8080/`
- Navigate to **User Management** > **Roles** and create new roles named `ROLE_ADMIN`, and `ROLE_USER`.
- Navigate to **User Management** > **Users** and create a new user account. Click on the **Role** tab to assign roles to the newly created user account.
- Navigate to **Auth Pipeline** > **Rules** and create a new Rule. Choose `Empty rule` template. Provide a meaningful name like `JHipster claims` and replace `Script` content with the following and Save.

```javascript
function (user, context, callback) {
  user.preferred_username = user.email;
  const roles = (context.authorization || {}).roles;

  function prepareCustomClaimKey(claim) {
    return `https://www.jhipster.tech/${claim}`;
  }

  const rolesClaim = prepareCustomClaimKey('roles');

  if (context.idToken) {
    context.idToken[rolesClaim] = roles;
  }

  if (context.accessToken) {
    context.accessToken[rolesClaim] = roles;
  }

  callback(null, user, context);
}
```

- In your `JHipster` application, modify `src/main/resources/config/application.yml` to use your Auth0 application settings:

```yaml
spring:
  ...
  security:
    oauth2:
      client:
        provider:
          oidc:
            # make sure to include the ending slash!
            issuer-uri: https://{your-auth0-domain}/
        registration:
          oidc:
            client-id: {clientId}
            client-secret: {clientSecret}
            scope: openid,profile,email
jhipster:
  ...
  security:
    oauth2:
      audience:
        - https://{your-auth0-domain}/api/v2/
```

The build system will install automatically the recommended version of Node and npm.

We provide a wrapper to launch npm.
You will only need to run this command when dependencies change in [package.json](package.json).

```bash
./npmw install
```

We use npm scripts and [Angular CLI](https://angular.dev/tools/cli) with Webpack as our build system.

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

```bash
./npmw run backend:start
./npmw run start
```

Npm is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `./npmw update` and `./npmw install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `./npmw help update`.

The `./npmw run` command will list all the scripts available to run for this project.

### PWA Support

JHipster ships with PWA (Progressive Web App) support, and it's turned off by default. One of the main components of a PWA is a service worker.

The service worker initialization code is disabled by default. To enable it, uncomment the following code in `src/main/webapp/app/app.config.ts`:

```typescript
ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
```

### Managing dependencies

For example, to add [Leaflet](https://leafletjs.com/) library as a runtime dependency of your application, you would run the following command:

```bash
./npmw install --save --save-exact leaflet
```

To benefit from TypeScript type definitions from [DefinitelyTyped](https://definitelytyped.org/) repository in development, you would run the following command:

```bash
./npmw install --save-dev --save-exact @types/leaflet
```

Then you would import the JS and CSS files specified in library's installation instructions so that [Webpack][] knows about them:
Edit [src/main/webapp/app/app.config.ts](src/main/webapp/app/app.config.ts) file:

```typescript
import 'leaflet/dist/leaflet.js';
```

Edit [src/main/webapp/content/scss/vendor.scss](src/main/webapp/content/scss/vendor.scss) file:

```typescript
@import 'leaflet/dist/leaflet.css';
```

Note: There are still a few other things remaining to do for Leaflet that we won't detail here.

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development](https://www.jhipster.tech/development/).

### Using Angular CLI

You can also use [Angular CLI](https://angular.dev/tools/cli) to generate some custom client code.

For example, the following command:

```bash
ng generate component my-component
```

will generate few files:

```bash
create src/main/webapp/app/my-component/my-component.html
create src/main/webapp/app/my-component/my-component.ts
update src/main/webapp/app/app.config.ts
```

## Building for production

### Packaging as jar

To build the final jar and optimize the jhipsterOauth2SampleApplication application for production, run:

```bash
./mvnw -Pprod clean verify
```

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

```bash
java -jar target/*.jar
```

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Refer to [Using JHipster in production][] for more details.

### Packaging as war

To package your application as a war in order to deploy it to an application server, run:

```bash
./mvnw -Pprod,war clean verify
```

### JHipster Control Center

JHipster Control Center can help you manage and control your application(s). You can start a local control center server (accessible on http://localhost:7419) with:

```bash
docker compose -f src/main/docker/jhipster-control-center.yml up
```

## Testing

### Spring Boot tests

To launch your application's tests, run:

```bash
./mvnw verify
```

### Gatling

Performance tests are run by [Gatling](https://gatling.io/) and written in Scala. They're located in [src/test/java/gatling/simulations](src/test/java/gatling/simulations).

You can execute all Gatling tests with

```bash
./mvnw gatling:test
```

### Client tests

Unit tests are run by Vitest. They're located near components and can be run with:

```bash
./npmw test
```

#### E2E tests

UI end-to-end tests are powered by [Cypress][]. They're located in [src/test/javascript/cypress/](src/test/javascript/cypress/)
and can be run by starting Spring Boot in one terminal (`./npmw run app:start`) and running the tests (`./npmw run e2e`) in a second one.

Before running Cypress tests, it's possible to specify user credentials by overriding the `CYPRESS_E2E_USERNAME` and `CYPRESS_E2E_PASSWORD` environment variables.

```bash
export CYPRESS_E2E_USERNAME="<your-username>"
export CYPRESS_E2E_PASSWORD="<your-password>"
```

See Cypress documentation for setting OS [environment variables](https://docs.cypress.io/app/references/environment-variables#Setting) to learn more.

#### Lighthouse audits

You can execute automated [Lighthouse audits](https://developer.chrome.com/docs/lighthouse/overview) with [cypress-audit](https://github.com/mfrachet/cypress-audit) by running `./npmw run e2e:cypress:audits`.

You should only run the audits when your application is packaged with the production profile.

The Lighthouse report is created in `target/cypress/lhreport.html`.

## Others

### Code quality using Sonar

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```bash
docker compose -f src/main/docker/sonar.yml up -d
```

Note: we have turned off forced authentication redirect for UI in [src/main/docker/sonar.yml](src/main/docker/sonar.yml) for out of the box experience while trying out SonarQube, for real use cases turn it back on.

You can run a Sonar analysis with using the [sonar-scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner) or by using the maven plugin.

Then, run a Sonar analysis:

```bash
./mvnw -Pprod clean verify sonar:sonar -Dsonar.login=admin -Dsonar.password=admin
```

If you need to re-run the Sonar phase, please be sure to specify at least the `initialize` phase since Sonar properties are loaded from the sonar-project.properties file.

```bash
./mvnw initialize sonar:sonar -Dsonar.login=admin -Dsonar.password=admin
```

Additionally, Instead of passing `sonar.password` and `sonar.login` as CLI arguments, these parameters can be configured from [sonar-project.properties](sonar-project.properties) as shown below:

```bash
sonar.login=admin
sonar.password=admin
```

For more information, refer to the [Code quality page][].

### Docker Compose support

JHipster generates a number of Docker Compose configuration files in the [src/main/docker/](src/main/docker/) folder to launch required third party services.

For example, to start required services in Docker containers, run:

```bash
docker compose -f src/main/docker/services.yml up -d
```

To stop and remove the containers, run:

```bash
docker compose -f src/main/docker/services.yml down
```

[Spring Docker Compose Integration](https://docs.spring.io/spring-boot/reference/features/dev-services.html) is enabled by default. It's possible to disable it in `application.yml`:

```yaml
spring:
  ...
  docker:
    compose:
      enabled: false
```

You can also fully dockerize your application and all the services that it depends on.
To achieve this, first build a Docker image of your app by running:

```bash
npm run java:docker
```

Or build an arm64 Docker image when using an arm64 processor OS, i.e., Apple Silicon chips (M\*), running:

```bash
npm run java:docker:arm64
```

Then run:

```bash
docker compose -f src/main/docker/app.yml up -d
```

For more information refer to [Docker and Docker-Compose](https://www.jhipster.tech/documentation-archive/v9.0.0/docker-compose/), this page also contains information on the Docker Compose sub-generator (`jhipster docker-compose`), which is able to generate Docker configurations for one or several JHipster applications.

## Continuous Integration (optional)

To configure CI for your project, run the ci-cd sub-generator (`jhipster ci-cd`), this will let you generate configuration files for a number of Continuous Integration systems. Consult the [Setting up Continuous Integration](https://www.jhipster.tech/documentation-archive/v9.0.0/setting-up-ci/) page for more information.

## References

- [JHipster Homepage and latest documentation](https://www.jhipster.tech/)
- [JHipster 9.0.0 archive](https://www.jhipster.tech/documentation-archive/v9.0.0)
- [Using JHipster in development](https://www.jhipster.tech/documentation-archive/v9.0.0/development/)
- [Using Docker and Docker-Compose](https://www.jhipster.tech/documentation-archive/v9.0.0/docker-compose)
- [Using JHipster in production](https://www.jhipster.tech/documentation-archive/v9.0.0/production/)
- [Running tests page](https://www.jhipster.tech/documentation-archive/v9.0.0/running-tests/)
- [Code quality page](https://www.jhipster.tech/documentation-archive/v9.0.0/code-quality/)
- [Setting up Continuous Integration](https://www.jhipster.tech/documentation-archive/v9.0.0/setting-up-ci/)
- [Node.js](https://nodejs.org/)
- [NPM](https://www.npmjs.com/)
- [Gatling](https://gatling.io/)
- [Webpack](https://webpack.js.org/)
- [BrowserSync](https://www.browsersync.io/)
- [Jest](https://jestjs.io)
- [Leaflet](https://leafletjs.com/)
- [DefinitelyTyped](https://definitelytyped.org/)
- [Angular CLI](https://angular.dev/tools/cli)
- [Cypress](https://www.cypress.io/)

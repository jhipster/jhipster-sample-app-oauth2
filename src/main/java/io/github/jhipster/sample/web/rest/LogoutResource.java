package io.github.jhipster.sample.web.rest;

import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing global OIDC logout.
 */
@RestController
public class LogoutResource {

    private final ClientRegistration registration;

    public LogoutResource(ClientRegistrationRepository registrations) {
        this.registration = registrations.findByRegistrationId("oidc");
    }

    /**
     * {@code POST  /api/logout} : logout the current user.
     *
     * @param request the {@link HttpServletRequest}.
     * @param idToken the ID token.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and a body with a global logout URL.
     */
    @PostMapping("/api/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, @AuthenticationPrincipal(expression = "idToken") OidcIdToken idToken) {
        StringBuilder logoutUrl = new StringBuilder();

        String issuerUri = this.registration.getProviderDetails().getIssuerUri();
        if (issuerUri.contains("auth0.com")) {
            logoutUrl.append(issuerUri.endsWith("/") ? issuerUri + "v2/logout" : issuerUri + "/v2/logout");
        } else {
            logoutUrl.append(this.registration.getProviderDetails().getConfigurationMetadata().get("end_session_endpoint").toString());
        }

        String originUrl = request.getHeader(HttpHeaders.ORIGIN);

        if (logoutUrl.indexOf("/protocol") > -1) {
            logoutUrl.append("?redirect_uri=").append(originUrl);
        } else if (logoutUrl.indexOf("auth0.com") > -1) {
            // Auth0
            logoutUrl.append("?client_id=").append(this.registration.getClientId()).append("&returnTo=").append(originUrl);
        } else {
            // Okta
            logoutUrl.append("?id_token_hint=").append(idToken.getTokenValue()).append("&post_logout_redirect_uri=").append(originUrl);
        }

        request.getSession().invalidate();
        return ResponseEntity.ok().body(Map.of("logoutUrl", logoutUrl.toString()));
    }
}

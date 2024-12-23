package io.github.jhipster.sample.web.rest;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
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
     * @param oidcUser the OIDC user.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and a body with a global logout URL.
     */
    @PostMapping("/api/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, @AuthenticationPrincipal OidcUser oidcUser) {
        StringBuilder logoutUrl = new StringBuilder();

        logoutUrl.append(this.registration.getProviderDetails().getConfigurationMetadata().get("end_session_endpoint").toString());

        String originUrl = request.getHeader(HttpHeaders.ORIGIN);

        logoutUrl
            .append("?id_token_hint=")
            .append(oidcUser.getIdToken().getTokenValue())
            .append("&post_logout_redirect_uri=")
            .append(originUrl);

        request.getSession().invalidate();
        return ResponseEntity.ok().body(Map.of("logoutUrl", logoutUrl.toString()));
    }
}

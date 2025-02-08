package io.github.jhipster.sample.web.rest;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
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

    private final ClientRegistrationRepository registrationRepository;

    public LogoutResource(ClientRegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    /**
     * {@code POST  /api/logout} : logout the current user.
     *
     * @param request the {@link HttpServletRequest}.
     * @param oAuth2AuthenticationToken the OAuth2 authentication token.
     * @param oidcUser the OIDC user.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and a body with a global logout URL.
     */
    @PostMapping("/api/logout")
    public ResponseEntity<Map<String, String>> logout(
        HttpServletRequest request,
        @CurrentSecurityContext(expression = "authentication") OAuth2AuthenticationToken oAuth2AuthenticationToken,
        @AuthenticationPrincipal OidcUser oidcUser
    ) {
        StringBuilder logoutUrl = new StringBuilder();
        String originUrl = request.getHeader(HttpHeaders.ORIGIN);

        ClientRegistration clientRegistration = registrationRepository.findByRegistrationId(
            oAuth2AuthenticationToken.getAuthorizedClientRegistrationId()
        );
        logoutUrl
            .append(clientRegistration.getProviderDetails().getConfigurationMetadata().get("end_session_endpoint").toString())
            .append("?id_token_hint=")
            .append(oidcUser.getIdToken().getTokenValue())
            .append("&post_logout_redirect_uri=")
            .append(originUrl);

        request.getSession().invalidate();
        return ResponseEntity.ok().body(Map.of("logoutUrl", logoutUrl.toString()));
    }
}

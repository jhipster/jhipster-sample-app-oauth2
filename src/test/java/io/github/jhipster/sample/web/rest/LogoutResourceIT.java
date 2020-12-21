package io.github.jhipster.sample.web.rest;

import static io.github.jhipster.sample.web.rest.TestUtil.ID_TOKEN;
import static io.github.jhipster.sample.web.rest.TestUtil.authenticationToken;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import io.github.jhipster.sample.IntegrationTest;
import io.github.jhipster.sample.config.TestSecurityConfiguration;
import io.github.jhipster.sample.security.AuthoritiesConstants;
import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Integration tests for the {@link LogoutResource} REST controller.
 */
@IntegrationTest
class LogoutResourceIT {

    @Autowired
    private ClientRegistrationRepository registrations;

    @Autowired
    private WebApplicationContext context;

    private MockMvc restLogoutMockMvc;

    private OidcIdToken idToken;

    @BeforeEach
    public void before() throws Exception {
        Map<String, Object> claims = new HashMap<>();
        claims.put("groups", Collections.singletonList(AuthoritiesConstants.USER));
        claims.put("sub", 123);
        this.idToken = new OidcIdToken(ID_TOKEN, Instant.now(), Instant.now().plusSeconds(60), claims);

        SecurityContextHolder.getContext().setAuthentication(authenticationToken(idToken));
        SecurityContextHolderAwareRequestFilter authInjector = new SecurityContextHolderAwareRequestFilter();
        authInjector.afterPropertiesSet();

        this.restLogoutMockMvc = MockMvcBuilders.webAppContextSetup(this.context).build();
    }

    @Test
    void getLogoutInformation() throws Exception {
        String logoutUrl =
            this.registrations.findByRegistrationId("oidc")
                .getProviderDetails()
                .getConfigurationMetadata()
                .get("end_session_endpoint")
                .toString();
        restLogoutMockMvc
            .perform(post("/api/logout"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.logoutUrl").value(logoutUrl))
            .andExpect(jsonPath("$.idToken").value(ID_TOKEN));
    }
}

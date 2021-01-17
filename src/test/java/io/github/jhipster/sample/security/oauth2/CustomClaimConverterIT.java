package io.github.jhipster.sample.security.oauth2;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.github.jhipster.sample.IntegrationTest;
import io.github.jhipster.sample.JhipsterOauth2SampleApplicationApp;
import io.github.jhipster.sample.config.TestSecurityConfiguration;
import io.github.jhipster.sample.security.AuthoritiesConstants;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@IntegrationTest
@ExtendWith(MockitoExtension.class)
public class CustomClaimConverterIT {

    private static final String USERNAME = "admin";
    private static final String NAME = "John";
    private static final String FAMILY_NAME = "Doe";

    @Mock
    private RestTemplate restTemplate;

    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;

    private CustomClaimConverter customClaimConverter;

    @BeforeEach
    public void initTest() {
        customClaimConverter = new CustomClaimConverter(clientRegistrationRepository.findByRegistrationId("oidc"), restTemplate);
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode user = mapper.createObjectNode();
        user.put("preferred_username", USERNAME);
        user.put("given_name", NAME);
        user.put("family_name", FAMILY_NAME);
        user.putArray("groups").add(AuthoritiesConstants.ADMIN).add(AuthoritiesConstants.USER);
        ResponseEntity<ObjectNode> userInfo = ResponseEntity.ok(user);
        when(
            restTemplate.exchange(
                eq("https://api.jhipster.org/user"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                ArgumentMatchers.<Class<ObjectNode>>any()
            )
        )
            .thenReturn(userInfo);
    }

    @Test
    @Transactional
    public void testConvert() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", "123");
        Map<String, Object> convertedClaims = customClaimConverter.convert(claims);

        assertThat(convertedClaims.get("preferred_username")).isEqualTo(USERNAME);
        assertThat(convertedClaims.get("given_name")).isEqualTo(NAME);
        assertThat(convertedClaims.get("family_name")).isEqualTo(FAMILY_NAME);
        assertThat(convertedClaims.get("groups")).isEqualTo(List.of(AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER));
    }
}

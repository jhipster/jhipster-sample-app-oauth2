package io.github.jhipster.sample.service;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.jhipster.sample.IntegrationTest;
import io.github.jhipster.sample.config.Constants;
import io.github.jhipster.sample.domain.User;
import io.github.jhipster.sample.repository.UserRepository;
import io.github.jhipster.sample.security.AuthoritiesConstants;
import io.github.jhipster.sample.service.dto.AdminUserDTO;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for {@link UserService}.
 */
@IntegrationTest
@Transactional
class UserServiceIT {

    private static final String DEFAULT_LOGIN = "johndoe_service";

    private static final String DEFAULT_EMAIL = "johndoe_service@localhost";

    private static final String DEFAULT_FIRSTNAME = "john";

    private static final String DEFAULT_LASTNAME = "doe";

    @Autowired
    private CacheManager cacheManager;

    private static final String DEFAULT_IMAGEURL = "http://placehold.it/50x50";

    private static final String DEFAULT_LANGKEY = "dummy";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    private User user;

    private Map<String, Object> userDetails;

    @BeforeEach
    public void init() {
        user = new User();
        user.setLogin(DEFAULT_LOGIN);
        user.setActivated(true);
        user.setEmail(DEFAULT_EMAIL);
        user.setFirstName(DEFAULT_FIRSTNAME);
        user.setLastName(DEFAULT_LASTNAME);
        user.setImageUrl(DEFAULT_IMAGEURL);
        user.setLangKey(DEFAULT_LANGKEY);

        userDetails = new HashMap<>();
        userDetails.put("sub", DEFAULT_LOGIN);
        userDetails.put("email", DEFAULT_EMAIL);
        userDetails.put("given_name", DEFAULT_FIRSTNAME);
        userDetails.put("family_name", DEFAULT_LASTNAME);
        userDetails.put("picture", DEFAULT_IMAGEURL);
    }

    @AfterEach
    public void cleanupAndCheck() {
        cacheManager
            .getCacheNames()
            .stream()
            .map(cacheName -> this.cacheManager.getCache(cacheName))
            .filter(Objects::nonNull)
            .forEach(Cache::clear);
        userRepository.deleteAll();
    }

    @Test
    @Transactional
    void testDefaultUserDetails() {
        OAuth2AuthenticationToken authentication = createMockOAuth2AuthenticationToken(userDetails);
        AdminUserDTO userDTO = userService.getUserFromAuthentication(authentication);

        assertThat(userDTO.getLogin()).isEqualTo(DEFAULT_LOGIN);
        assertThat(userDTO.getFirstName()).isEqualTo(DEFAULT_FIRSTNAME);
        assertThat(userDTO.getLastName()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(userDTO.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(userDTO.isActivated()).isTrue();
        assertThat(userDTO.getLangKey()).isEqualTo(Constants.DEFAULT_LANGUAGE);
        assertThat(userDTO.getImageUrl()).isEqualTo(DEFAULT_IMAGEURL);
        assertThat(userDTO.getAuthorities()).contains(AuthoritiesConstants.ANONYMOUS);
    }

    @Test
    @Transactional
    void testUserDetailsWithUsername() {
        userDetails.put("preferred_username", "TEST");

        OAuth2AuthenticationToken authentication = createMockOAuth2AuthenticationToken(userDetails);
        AdminUserDTO userDTO = userService.getUserFromAuthentication(authentication);

        assertThat(userDTO.getLogin()).isEqualTo("test");
    }

    @Test
    @Transactional
    void testUserDetailsWithLangKey() {
        userDetails.put("langKey", DEFAULT_LANGKEY);
        userDetails.put("locale", "en-US");

        OAuth2AuthenticationToken authentication = createMockOAuth2AuthenticationToken(userDetails);
        AdminUserDTO userDTO = userService.getUserFromAuthentication(authentication);

        assertThat(userDTO.getLangKey()).isEqualTo(DEFAULT_LANGKEY);
    }

    @Test
    @Transactional
    void testUserDetailsWithLocale() {
        userDetails.put("locale", "it-IT");

        OAuth2AuthenticationToken authentication = createMockOAuth2AuthenticationToken(userDetails);
        AdminUserDTO userDTO = userService.getUserFromAuthentication(authentication);

        assertThat(userDTO.getLangKey()).isEqualTo("it");
    }

    @Test
    @Transactional
    void testUserDetailsWithUSLocaleUnderscore() {
        userDetails.put("locale", "en_US");

        OAuth2AuthenticationToken authentication = createMockOAuth2AuthenticationToken(userDetails);
        AdminUserDTO userDTO = userService.getUserFromAuthentication(authentication);

        assertThat(userDTO.getLangKey()).isEqualTo("en");
    }

    @Test
    @Transactional
    void testUserDetailsWithUSLocaleDash() {
        userDetails.put("locale", "en-US");

        OAuth2AuthenticationToken authentication = createMockOAuth2AuthenticationToken(userDetails);
        AdminUserDTO userDTO = userService.getUserFromAuthentication(authentication);

        assertThat(userDTO.getLangKey()).isEqualTo("en");
    }

    private OAuth2AuthenticationToken createMockOAuth2AuthenticationToken(Map<String, Object> userDetails) {
        Collection<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ANONYMOUS));
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
            "anonymous",
            "anonymous",
            authorities
        );
        usernamePasswordAuthenticationToken.setDetails(userDetails);
        OAuth2User user = new DefaultOAuth2User(authorities, userDetails, "sub");

        return new OAuth2AuthenticationToken(user, authorities, "oidc");
    }
}

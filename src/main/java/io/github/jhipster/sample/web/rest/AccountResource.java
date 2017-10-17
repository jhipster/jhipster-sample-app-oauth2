package io.github.jhipster.sample.web.rest;

import io.github.jhipster.sample.domain.User;
import io.github.jhipster.sample.domain.Authority;
import io.github.jhipster.sample.repository.UserRepository;
import io.github.jhipster.sample.service.UserService;
import io.github.jhipster.sample.service.dto.UserDTO;
import io.github.jhipster.sample.web.rest.errors.InternalServerErrorException;

import com.codahale.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class AccountResource {

    private final Logger log = LoggerFactory.getLogger(AccountResource.class);

    private final UserRepository userRepository;

    private final UserService userService;

    public AccountResource(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    /**
     * GET  /authenticate : check if the user is authenticated, and return its login.
     *
     * @param request the HTTP request
     * @return the login if the user is authenticated
     */
    @GetMapping("/authenticate")
    @Timed
    public String isAuthenticated(HttpServletRequest request) {
        log.debug("REST request to check if the current user is authenticated");
        return request.getRemoteUser();
    }

    /**
     * GET  /account : get the current user.
     *
     * @param principal the current user; resolves to null if not authenticated
     * @return the current user
     * @throws InternalServerErrorException 500 (Internal Server Error) if the user couldn't be returned
     */
    @GetMapping("/account")
    @Timed
    @SuppressWarnings("unchecked")
    public UserDTO getAccount(Principal principal) {
        if (principal != null) {
            if (principal instanceof OAuth2Authentication) {
                OAuth2Authentication authentication = (OAuth2Authentication) principal;
                Map<String, Object> details = (Map<String, Object>) authentication.getUserAuthentication().getDetails();
                Set<Authority> userAuthorities;

                // get roles from details
                if (details.get("roles") != null) {
                    List<String> roles = (List) details.get("roles");
                    userAuthorities = roles.stream()
                        .filter(role -> role.startsWith("ROLE_"))
                        .map(role -> {
                            Authority userAuthority = new Authority();
                            userAuthority.setName(role);
                            return userAuthority;
                        })
                        .collect(Collectors.toSet());
                    // if roles don't exist, try groups
                } else if (details.get("groups") != null) {
                    List<String> groups = (List) details.get("groups");
                    userAuthorities = groups.stream()
                        .filter(group -> group.startsWith("ROLE_"))
                        .map(group -> {
                            Authority userAuthority = new Authority();
                            userAuthority.setName(group);
                            return userAuthority;
                        })
                        .collect(Collectors.toSet());
                } else {
                    userAuthorities = authentication.getAuthorities().stream()
                        .map(role -> {
                            Authority userAuthority = new Authority();
                            userAuthority.setName(role.getAuthority());
                            return userAuthority;
                        })
                        .collect(Collectors.toSet());
                }

                User user = new User();
                user.setLogin((String) details.get("preferred_username"));
                if (details.get("given_name") != null) {
                    user.setFirstName((String) details.get("given_name"));
                }
                if (details.get("family_name") != null) {
                    user.setFirstName((String) details.get("family_name"));
                }
                if (details.get("email_verified") != null) {
                    user.setActivated((Boolean) details.get("email_verified"));
                }
                if (details.get("email") != null) {
                    user.setEmail((String) details.get("email"));
                }
                if (details.get("langKey") != null) {
                    user.setLangKey((String) details.get("langKey"));
                } else if (details.get("locale") != null) {
                    String locale = (String) details.get("locale");
                    String langKey = locale.substring(0, locale.indexOf("-"));
                    user.setLangKey(langKey);
                }

                user.setAuthorities(userAuthorities);

                UserDTO userDTO = new UserDTO(user);

                // convert Authorities to GrantedAuthorities
                Set<GrantedAuthority> grantedAuthorities = new LinkedHashSet<>();
                userAuthorities.forEach(authority -> {
                    grantedAuthorities.add(new SimpleGrantedAuthority(authority.getName()));
                });

                // create UserDetails so #{principal.username} works
                UserDetails userDetails =
                    new org.springframework.security.core.userdetails.User(user.getLogin(),
                    "N/A", grantedAuthorities);
                // update Spring Security Authorities to match groups claim from IdP
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                    userDetails, "N/A", grantedAuthorities);
                token.setDetails(details);
                authentication = new OAuth2Authentication(authentication.getOAuth2Request(), token);
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // save account in to sync users between IdP and JHipster's local database
                Optional<User> existingUser = userRepository.findOneByLogin(userDTO.getLogin());
                if (existingUser.isPresent()) {
                    // if IdP sends last updated information, use it to determine if an update should happen
                    if (details.get("updated_at") != null) {
                        Instant dbModifiedDate = existingUser.get().getLastModifiedDate();
                        Instant idpModifiedDate = new Date(Long.valueOf((Integer) details.get("updated_at"))).toInstant();
                        if (idpModifiedDate.isAfter(dbModifiedDate)) {
                            log.debug("Updating user '{}' in local database...", userDTO.getLogin());
                            userService.updateUser(userDTO.getFirstName(), userDTO.getLastName(), userDTO.getEmail(),
                                userDTO.getLangKey(), userDTO.getImageUrl());
                        }
                        // no last updated info, blindly update
                    } else {
                        log.debug("Updating user '{}' in local database...", userDTO.getLogin());
                        userService.updateUser(userDTO.getFirstName(), userDTO.getLastName(), userDTO.getEmail(),
                            userDTO.getLangKey(), userDTO.getImageUrl());
                    }
                } else {
                    log.debug("Saving user '{}' in local database...", userDTO.getLogin());
                    userRepository.save(user);
                }
                return userDTO;
            } else {
                // Allow Spring Security Test to be used to mock users in the database
                return Optional.ofNullable(userService.getUserWithAuthorities())
                    .map(UserDTO::new)
                    .orElseThrow(() -> new InternalServerErrorException("User could not be found"));
            }
        } else {
            throw new InternalServerErrorException("User could not be found");
        }
    }
}

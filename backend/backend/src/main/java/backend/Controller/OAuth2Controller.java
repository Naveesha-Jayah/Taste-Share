package backend.Controller;

import backend.Model.UserMModel;
import backend.Repository.UserMRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/oauth2")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OAuth2Controller {

    @Autowired
    private UserMRepository userRepository;

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User oauth2User) {
        if (oauth2User == null) {
            return ResponseEntity.ok().body(Map.of("authenticated", false));
        }

        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String providerId = (String) attributes.get("sub");

        UserMModel user = userRepository.findByEmailAddress(email)
                .orElseGet(() -> {
                    UserMModel newUser = new UserMModel();
                    newUser.setEmailAddress(email);
                    newUser.setFullName(name);
                    newUser.setProvider("google");
                    newUser.setProviderId(providerId);
                    return userRepository.save(newUser);
                });

        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "id", user.getId(),
                "email", user.getEmailAddress(),
                "name", user.getFullName(),
                "provider", user.getProvider()
        ));
    }
}
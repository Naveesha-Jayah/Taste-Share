package backend.Controller;

import backend.Exception.UserMNotFoundException;
import backend.Model.UserMModel;
import backend.Repository.UserMRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserMController {

    @Autowired
    private UserMRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/user-register")
    public ResponseEntity<?> newUserModel(@RequestBody UserMModel userModel) {
        Optional<UserMModel> existingUser = userRepository.findByEmailAddress(userModel.getEmailAddress());
        if (existingUser.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        if (!userModel.getPassword().equals(userModel.getConfirmPassword())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Passwords do not match"));
        }

        userModel.setProvider("local");
        userModel.setPassword(passwordEncoder.encode(userModel.getPassword()));
        UserMModel savedUser = userRepository.save(userModel);

        return ResponseEntity.ok(Map.of(
                "message", "Registration successful",
                "id", savedUser.getId(),
                "email", savedUser.getEmailAddress(),
                "name", savedUser.getFullName(),
                "provider", savedUser.getProvider()
        ));
    }

    @PostMapping("/user-login")
    public ResponseEntity<?> login(@RequestBody UserMModel loginDetails) {
        Optional<UserMModel> userOptional = userRepository.findByEmailAddress(loginDetails.getEmailAddress());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }

        UserMModel user = userOptional.get();

        if (!passwordEncoder.matches(loginDetails.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "id", user.getId(),
                "email", user.getEmailAddress(),
                "name", user.getFullName(),
                "provider", user.getProvider()
        ));
    }

    @GetMapping("/users")
    public List<UserMModel> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserId(@PathVariable Long id) {
        Optional<UserMModel> user = userRepository.findById(id);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }
        return ResponseEntity.ok(user.get());
    }
}
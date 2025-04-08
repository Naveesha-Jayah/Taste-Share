package backend.Controller;


import backend.Exception.UserNotFoundException;
import backend.Model.UserModel;
import backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    //insert
    @PostMapping("/register")
    public UserModel newUserModel(@RequestBody UserModel userModel){
        return userRepository.save(userModel);
    }
    // User Login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserModel loginDetails) {
        UserModel user = userRepository.findByEmailAddress(loginDetails.getEmailAddress())
                .orElseThrow(() -> new UserNotFoundException("Email not found: " + loginDetails.getEmailAddress()));

        // Check if the password matches
        if (user.getPassword().equals(loginDetails.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login Successful");
            response.put("id", user.getId()); // Return user ID
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials!"));
        }
    }

    //Display
    @GetMapping("user")
    List<UserModel>getAllUsers(){
        return userRepository.findAll();
    }

    @GetMapping("/user/{id}")
    UserModel getUserId(@PathVariable Long id){
        return userRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id));
    }

}

package com.internproject.LatenSync.controller;


import com.internproject.LatenSync.entity.LoginRequest;
import com.internproject.LatenSync.entity.User;
import com.internproject.LatenSync.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> addUser(@RequestBody User user){
        return new ResponseEntity<>(userService.addUser(user), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        try {
            boolean isAuthenticated = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
            if (isAuthenticated) {
                session.setAttribute("user", loginRequest.getUsername());

                // Return JSON response
                Map<String, String> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("username", loginRequest.getUsername());
                return ResponseEntity.ok(response);
            } else {
                // Return JSON error response
                Map<String, String> response = new HashMap<>();
                response.put("message", "Invalid username or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            // Return JSON error response
            Map<String, String> response = new HashMap<>();
            response.put("message", "An error occurred during login");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    @GetMapping("/get")
    public ResponseEntity<List<User>> getAllUser(){
        return new ResponseEntity<>(userService.getAllUser(),HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeUser(@PathVariable("id") String userName){
        userService.removeUser(userName);
        return new ResponseEntity<>("User removed successfully",HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserByUsername(@PathVariable("id") String userName){
        return new ResponseEntity<>(userService.getUserByUserName(userName),HttpStatus.OK);
    }

    @GetMapping("/currentUser")
    public ResponseEntity<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        User user = userService.getUserByUserName(username);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}

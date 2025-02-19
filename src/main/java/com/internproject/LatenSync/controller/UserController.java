package com.internproject.LatenSync.controller;


import com.internproject.LatenSync.entity.Device;
import com.internproject.LatenSync.entity.User;
import com.internproject.LatenSync.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/add")
    public ResponseEntity<User> addUser(User user){
        return new ResponseEntity<>(userService.addUser(user), HttpStatus.CREATED);
    }

    @GetMapping("/get")
    public ResponseEntity<List<User>> getAllUser(){
        return new ResponseEntity<>(userService.getAllUser(),HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeDevice(@PathVariable("id") String userName){
        userService.removeUser(userName);
        return new ResponseEntity<>("User removed successfully",HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getDeviceById(@PathVariable("id") String userName){
        return new ResponseEntity<>(userService.getUserByUserName(userName),HttpStatus.FOUND);
    }
}

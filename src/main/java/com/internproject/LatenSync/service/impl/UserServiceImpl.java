package com.internproject.LatenSync.service.impl;

import com.internproject.LatenSync.entity.User;
import com.internproject.LatenSync.exception.ResourceNotFoundException;
import com.internproject.LatenSync.repository.UserRepository;
import com.internproject.LatenSync.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserServiceImpl(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public User addUser(User user) {
        user.setUserName(user.getUserName());
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setUser_type(user.getUser_type());
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public void removeUser(String userName) {
        User user = userRepository.findByUserName(userName);
        if (user == null) {
            throw new ResourceNotFoundException("User", "Username", userName);
        }
        userRepository.deleteById(user.getId());
    }


    @Override
    public User getUserByUserName(String user_name) {
        return userRepository.findByUserName(user_name);
    }

    @Override
    public boolean authenticate(String username, String password) {
        User user = userRepository.findByUserName(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found in the database");
        }

        // BCrypt's matches method compares plaintext password with hashed password
        if(!bCryptPasswordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("The password is incorrect");
        }

        return true;
    }
}

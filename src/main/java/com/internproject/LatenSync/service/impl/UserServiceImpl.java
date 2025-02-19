package com.internproject.LatenSync.service.impl;

import com.internproject.LatenSync.entity.User;
import com.internproject.LatenSync.exception.ResourceNotFoundException;
import com.internproject.LatenSync.repository.UserRepository;
import com.internproject.LatenSync.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;
    @Override
    public User addUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public void removeUser(String userName) {
        User user = userRepository.findByUserName(userName);
        userRepository.findById(user.getId()).orElseThrow(()-> new ResourceNotFoundException("Metrics","Id",userName));
        userRepository.deleteById(user.getId());
    }

    @Override
    public User getUserByUserName(String user_name) {
        return userRepository.findByUserName(user_name);
    }
}

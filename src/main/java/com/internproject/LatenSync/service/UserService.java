package com.internproject.LatenSync.service;

import com.internproject.LatenSync.entity.User;

import java.util.List;

public interface UserService {

    User addUser(User user);
    List<User> getAllUser();
    void removeUser(String userName);
    User getUserByUserName(String user_name);

    boolean authenticate(String username, String password);
}

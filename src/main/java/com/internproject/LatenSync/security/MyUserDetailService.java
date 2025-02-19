package com.internproject.LatenSync.security;

import com.internproject.LatenSync.entity.User;
import com.internproject.LatenSync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUserName(username);

        if(user==null){
            throw new UsernameNotFoundException("User doesn't exist");
        }
        return new UserPrinciple(user);
    }
}

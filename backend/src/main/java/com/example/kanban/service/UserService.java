package com.example.kanban.service;

import com.example.kanban.model.User;
import com.example.kanban.repo.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {
    private final UserRepo userRepo;
    private final PasswordEncoder encoder;

    public UserService(UserRepo userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    public User ensureAdminSeed() {
        User u = userRepo.findByEmail("admin@local");
        if (u == null) {
            u = User.builder().setEmail("admin@local").setPassword(encoder.encode("admin123")).setDisplayName("Admin");
            userRepo.save(u);
        }
        return u;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userRepo.findByEmail(username);
        if (u == null) throw new UsernameNotFoundException("User not found");
        return u;
    }
}

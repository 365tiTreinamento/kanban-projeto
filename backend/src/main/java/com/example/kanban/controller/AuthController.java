package com.example.kanban.controller;

import com.example.kanban.model.User;
import com.example.kanban.repo.UserRepo;
import com.example.kanban.security.JwtUtil;
import com.example.kanban.service.UserService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

record LoginReq(@NotBlank String email, @NotBlank String password) {}
record LoginRes(String token) {}

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepo userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;
    private final UserService userService;

    public AuthController(UserRepo userRepo, PasswordEncoder encoder, JwtUtil jwt, UserService userService) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwt = jwt;
        this.userService = userService;
        // seed
        userService.ensureAdminSeed();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginReq req) {
        User u = userRepo.findByEmail(req.email());
        if (u == null || !encoder.matches(req.password(), u.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        String token = jwt.generateToken(u);
        return ResponseEntity.ok(new LoginRes(token));
    }
}

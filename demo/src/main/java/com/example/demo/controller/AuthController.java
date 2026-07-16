package com.example.demo.controller;

import com.example.demo.dto.AuthRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional; // Cần import thêm Optional

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Cho phép VueJS gọi API
public class AuthController {
    @Autowired AuthenticationManager authenticationManager;
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder encoder;
    @Autowired JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("username", loginRequest.getUsername());

        // --- CẬP NHẬT: Lấy thông tin user để đính kèm quyền (Role) gửi về Vue.js ---
        // Giả định hàm findByUsername trả về Optional<User>
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());
        if (userOptional.isPresent() && userOptional.get().getRole() != null) {
            response.put("role", userOptional.get().getRole());
        } else {
            response.put("role", "USER"); // Đề phòng dữ liệu cũ chưa có role
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequest signUpRequest) {
        // 1. Kiểm tra trùng username
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Tên tài khoản đã tồn tại!");
        }

        // 2. Kiểm tra mật khẩu
        if (signUpRequest.getPassword().length() < 6) {     
            return ResponseEntity.badRequest().body("Mật khẩu phải từ 6 ký tự trở lên!");
        }

        // 3. Thực hiện lưu
        User user = new User(signUpRequest.getUsername(), encoder.encode(signUpRequest.getPassword()));
        
        // --- CẬP NHẬT: Đặt quyền mặc định là USER cho mọi tài khoản mới ---
        user.setRole("USER"); 
        
        userRepository.save(user);
        return ResponseEntity.ok("Đăng ký thành công!");
    }
}
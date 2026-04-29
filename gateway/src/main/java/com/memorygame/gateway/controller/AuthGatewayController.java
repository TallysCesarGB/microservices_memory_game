package com.memorygame.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.memorygame.gateway.api.AuthGatewayRequest;
import com.memorygame.gateway.api.AuthGatewayResponse;
import com.memorygame.gateway.service.AuthGatewayService;

@RestController
@RequestMapping("/api/auth")
public class AuthGatewayController {

    private final AuthGatewayService authGatewayService;

    public AuthGatewayController(AuthGatewayService authGatewayService) {
        this.authGatewayService = authGatewayService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthGatewayResponse> register(@RequestBody AuthGatewayRequest request) {
        AuthGatewayResponse response = authGatewayService.register(request);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthGatewayResponse> login(@RequestBody AuthGatewayRequest request) {
        AuthGatewayResponse response = authGatewayService.login(request);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.OK : HttpStatus.UNAUTHORIZED).body(response);
    }
}
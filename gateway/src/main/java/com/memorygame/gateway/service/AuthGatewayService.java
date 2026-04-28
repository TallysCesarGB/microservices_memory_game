package com.memorygame.gateway.service;

import org.springframework.stereotype.Service;

import com.memorygame.auth.grpc.AuthResponse;
import com.memorygame.auth.grpc.AuthServiceGrpc;
import com.memorygame.auth.grpc.LoginRequest;
import com.memorygame.auth.grpc.RegisterRequest;
import com.memorygame.gateway.api.AuthGatewayRequest;
import com.memorygame.gateway.api.AuthGatewayResponse;

import io.grpc.StatusRuntimeException;
import net.devh.boot.grpc.client.inject.GrpcClient;

@Service
public class AuthGatewayService {

    private final AuthServiceGrpc.AuthServiceBlockingStub authStub;

    public AuthGatewayService(@GrpcClient("auth-service") AuthServiceGrpc.AuthServiceBlockingStub authStub) {
        this.authStub = authStub;
    }

    public AuthGatewayResponse register(AuthGatewayRequest request) {
        try {
            AuthResponse response = authStub.register(RegisterRequest.newBuilder()
                    .setUsername(request.getUsername())
                    .setPassword(request.getPassword())
                    .build());

            return new AuthGatewayResponse(response.getSuccess(), response.getToken(), response.getMessage());
        } catch (StatusRuntimeException exception) {
            return new AuthGatewayResponse(false, "", "Serviço de autenticação indisponível");
        }
    }

    public AuthGatewayResponse login(AuthGatewayRequest request) {
        try {
            AuthResponse response = authStub.login(LoginRequest.newBuilder()
                    .setUsername(request.getUsername())
                    .setPassword(request.getPassword())
                    .build());

            return new AuthGatewayResponse(response.getSuccess(), response.getToken(), response.getMessage());
        } catch (StatusRuntimeException exception) {
            return new AuthGatewayResponse(false, "", "Serviço de autenticação indisponível");
        }
    }
}
package com.memorygame.auth.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.memorygame.auth.grpc.AuthResponse;
import com.memorygame.auth.grpc.AuthServiceGrpc;
import com.memorygame.auth.grpc.LoginRequest;
import com.memorygame.auth.grpc.RegisterRequest;
import com.memorygame.auth.security.JwtTokenService;
import com.memorygame.auth.user.User;
import com.memorygame.auth.user.UserRepository;

import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class AuthServiceImpl extends AuthServiceGrpc.AuthServiceImplBase {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public AuthServiceImpl(UserRepository userRepository, JwtTokenService jwtTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtTokenService = jwtTokenService;
    }

    @Override
    public void register(RegisterRequest request,
                         io.grpc.stub.StreamObserver<AuthResponse> responseObserver) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            responseObserver.onNext(AuthResponse.newBuilder()
                    .setSuccess(false)
                    .setToken("")
                    .setMessage("Username já cadastrado")
                    .build());
            responseObserver.onCompleted();
            return;
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        responseObserver.onNext(AuthResponse.newBuilder()
                .setSuccess(true)
                .setToken("")
                .setMessage("Usuário registrado com sucesso")
                .build());
        responseObserver.onCompleted();
    }

    @Override
    public void login(LoginRequest request,
                      io.grpc.stub.StreamObserver<AuthResponse> responseObserver) {
        User user = userRepository.findByUsername(request.getUsername()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            responseObserver.onNext(AuthResponse.newBuilder()
                    .setSuccess(false)
                    .setToken("")
                    .setMessage("Credenciais inválidas")
                    .build());
            responseObserver.onCompleted();
            return;
        }

        String token = jwtTokenService.generateToken(user.getUsername());

        if (!jwtTokenService.validateToken(token)) {
            responseObserver.onNext(AuthResponse.newBuilder()
                    .setSuccess(false)
                    .setToken("")
                    .setMessage("Falha ao gerar token")
                    .build());
            responseObserver.onCompleted();
            return;
        }

        responseObserver.onNext(AuthResponse.newBuilder()
                .setSuccess(true)
                .setToken(token)
                .setMessage("Login realizado com sucesso")
                .build());
        responseObserver.onCompleted();
    }
}
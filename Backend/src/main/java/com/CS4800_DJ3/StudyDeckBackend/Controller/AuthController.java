package com.CS4800_DJ3.StudyDeckBackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CS4800_DJ3.StudyDeckBackend.DTO.AccountRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.ApiResponseDTO;
import com.CS4800_DJ3.StudyDeckBackend.Service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthService authService;


    @PostMapping(value = "/login")
    @Operation(
        description = "Logs in a user with the given username and password."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Logged in successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request - missing or invalid data"),
    })
    public ResponseEntity<ApiResponseDTO> login(@RequestBody AccountRequestDTO accountRequest, HttpSession session) {
        return authService.login(accountRequest, session);
    }
    


    @PostMapping(value = "/logout")
    @Operation(
        description = "Logs out the current user."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Logged out successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - user not logged in"),
    })
    public ResponseEntity<ApiResponseDTO> logout(HttpSession session) {
        return authService.logout(session);
    }

}

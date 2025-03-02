package com.CS4800_DJ3.StudyDeckBackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CS4800_DJ3.StudyDeckBackend.DTO.AccountRequest;
import com.CS4800_DJ3.StudyDeckBackend.Service.AuthService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    /**
     * API endpoint to login
     * @param AccountRequest: request body containing username and password
     * @param session:        session object to store user information
     * @return: response entity containing success or error message
     */
    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody AccountRequest accountRequest, HttpSession session) {
        return authService.login(accountRequest, session);
    }
    

    /**
     * Invalidate the session to log out the user
     * @param session: session object to store user information
     * @return response entity containing success or error message
     */
    @PostMapping(value = "/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        return authService.logout(session);
    }

}

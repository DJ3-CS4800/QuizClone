package com.CS4800_DJ3.StudyDeckBackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.CS4800_DJ3.StudyDeckBackend.DTO.AccountRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.ApiResponseDTO;
import com.CS4800_DJ3.StudyDeckBackend.Models.Account;
import com.CS4800_DJ3.StudyDeckBackend.Repo.AccountRepo;
import com.CS4800_DJ3.StudyDeckBackend.Util.ResponseUtil;

import jakarta.servlet.http.HttpSession;

@Service
public class AuthService {
 
    @Autowired
    private AccountRepo accountRepo;


    public ResponseEntity<ApiResponseDTO> login(AccountRequestDTO accountRequest, HttpSession session) {
        String username = accountRequest.getUsername();
        String password = accountRequest.getPassword();

        // Check if username and password are provided
        if (username == null || password == null) {
            return ResponseUtil.messsage(HttpStatus.BAD_REQUEST, "Username and password are required.");
        }

        Account account = accountRepo.findByUsername(username);

        // Check if account exists and password is correct
        if (account == null || !account.checkPassword(password)){
            return ResponseUtil.messsage(HttpStatus.BAD_REQUEST, "Invalid username or password.");
        }

        // Store user information in session
        session.setAttribute("username", account.getUsername());
        session.setAttribute("userID", account.getUserID());

        return ResponseUtil.messsage(HttpStatus.OK, "Logged in successfully.");
    }
    

    public ResponseEntity<ApiResponseDTO> logout(HttpSession session) {
        
        // Check if user is logged in
        if (session.getAttribute("userID") == null) {
            return ResponseUtil.messsage(HttpStatus.UNAUTHORIZED, "User not logged in.");
        }

        // Invalidate the session to log out the user
        session.invalidate();
        return ResponseUtil.messsage(HttpStatus.OK, "Logged out successfully.");
    }
}

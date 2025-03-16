package com.CS4800_DJ3.StudyDeckBackend.Service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.CS4800_DJ3.StudyDeckBackend.DTO.AccountCreateRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.AccountRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.ApiResponseDTO;
import com.CS4800_DJ3.StudyDeckBackend.Models.Account;
import com.CS4800_DJ3.StudyDeckBackend.Repo.AccountRepo;
import com.CS4800_DJ3.StudyDeckBackend.Util.ResponseUtil;

import jakarta.servlet.http.HttpSession;

@Service
public class AccountService {
    
    @Autowired
    private AccountRepo accountRepo;
    

    public ResponseEntity<ApiResponseDTO> createAccount(AccountCreateRequestDTO accountRequest) {
        String username = accountRequest.getUsername();
        String password = accountRequest.getPassword();
        String email = accountRequest.getEmail();

        // Check if username and password are provided
        if (username.isBlank() || password.isBlank() || email.isBlank()) {
            return ResponseUtil.messsage(HttpStatus.BAD_REQUEST, "Username, password, and email are required.");
        }

        // Check if account already exists
        if (accountRepo.findByUsername(username) != null) {
            return ResponseUtil.messsage(HttpStatus.BAD_REQUEST, "An Account with that username already exists.");
        }

        // Check if email is already in use
        if (accountRepo.findByEmail(email) != null) {
            return ResponseUtil.messsage(HttpStatus.BAD_REQUEST, "An Account with that email already exists.");
        }

        // Create new account and save to database
        Account newAccount = new Account();
        newAccount.setUsername(username);
        newAccount.setPassword(password);
        newAccount.setEmail(email);
        newAccount.setUserID(UUID.randomUUID());

        accountRepo.save(newAccount);

        return ResponseUtil.messsage(HttpStatus.OK, "Account created successfully.");
    }
    

    public ResponseEntity<ApiResponseDTO> deleteAccount(AccountRequestDTO accountRequest, HttpSession session) {
        String username = accountRequest.getUsername();
        String password = accountRequest.getPassword();

        // Get userID from session
        UUID userID = (UUID) session.getAttribute("userID");
        if (userID == null) {
            return ResponseUtil.messsage(HttpStatus.UNAUTHORIZED, "User not logged in.");
        }

        // Check if username and password are provided
        if (username.isBlank() || password.isBlank()) {
            return ResponseUtil.messsage(HttpStatus.BAD_REQUEST, "Username and password are required.");
        }

        Account account = accountRepo.findByUsername(username);

        // Check if account exists and password is correct
        if (account == null || !account.checkPassword(password)){
            return ResponseUtil.messsage(HttpStatus.BAD_REQUEST, "Incorrect username or password.");
        }

        // Delete the account from the database
        accountRepo.delete(account);

        // Invalidate the session to log out the user
        session.invalidate();

        return ResponseUtil.messsage(HttpStatus.OK, "Account deleted successfully.");
    }
}

package com.CS4800_DJ3.StudyDeckBackend.Service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.CS4800_DJ3.StudyDeckBackend.DTO.AccountRequest;
import com.CS4800_DJ3.StudyDeckBackend.Models.Account;
import com.CS4800_DJ3.StudyDeckBackend.Repo.AccountRepo;

import jakarta.servlet.http.HttpSession;

@Service
public class AuthService {
 
    @Autowired
    private AccountRepo accountRepo;

    public ResponseEntity<?> login(AccountRequest accountRequest, HttpSession session) {
        String username = accountRequest.getUsername();
        String password = accountRequest.getPassword();

        // Check if username and password are provided
        if (username == null || password == null) {
            return ResponseEntity.ok(Map.of("error", "Username and password are required."));
        }

        Account account = accountRepo.findByUsername(username);

        // Check if account exists and password is correct
        if (account == null || !account.checkPassword(password)){
            return ResponseEntity.ok(Map.of("error","Incorrect username or password."));
        }

        // Store user information in session
        session.setAttribute("username", account.getUsername());
        session.setAttribute("userID", account.getUserID());

        return ResponseEntity.ok(Map.of("success","Logged in successfully."));
    }


    public ResponseEntity<?> register(AccountRequest accountRequest) {
        String username = accountRequest.getUsername();
        String password = accountRequest.getPassword();

        // Check if username and password are provided
        if (username == null || password == null) {
            return ResponseEntity.status(401).body("Username and password are required.");
        }

        // Check if account already exists
        if (accountRepo.findByUsername(username) != null) {
            return ResponseEntity.status(401).body("An Account with that username already exists.");
        }

        // Create new account and save to database
        Account newAccount = new Account();
        newAccount.setUsername(username);
        newAccount.setPassword(password);

        accountRepo.addAccount(newAccount.getUsername(), newAccount.getPassword());

        return ResponseEntity.status(200).body("Account created successfully.");
    }


    public ResponseEntity<?> deleteAccount(AccountRequest accountRequest, HttpSession session) {
        String username = accountRequest.getUsername();
        String password = accountRequest.getPassword();

        // Check if username and password are provided
        if (username == null || password == null) {
            return ResponseEntity.status(401).body("Username and password are required.");
        }

        Account account = accountRepo.findByUsername(username);

        // Check if account exists and password is correct
        if (account == null || !account.checkPassword(password)){
            return ResponseEntity.status(401).body("Incorrect username or password.");
        }

        // Delete the account from the database
        accountRepo.delete(account);

        // Invalidate the session to log out the user
        session.invalidate();

        return ResponseEntity.status(200).body("Account deleted successfully.");
    }


    public ResponseEntity<?> logout(HttpSession session) {
        // Invalidate the session to log out the user
        session.invalidate();
        return ResponseEntity.status(200).body("Logged out successfully.");
    }
}

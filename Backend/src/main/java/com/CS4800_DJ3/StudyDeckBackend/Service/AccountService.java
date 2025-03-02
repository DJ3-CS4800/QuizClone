package com.CS4800_DJ3.StudyDeckBackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.CS4800_DJ3.StudyDeckBackend.DTO.AccountRequest;
import com.CS4800_DJ3.StudyDeckBackend.Models.Account;
import com.CS4800_DJ3.StudyDeckBackend.Repo.AccountRepo;

import jakarta.servlet.http.HttpSession;

@Service
public class AccountService {
    
    @Autowired
    private AccountRepo accountRepo;

    public ResponseEntity<?> createAccount(AccountRequest accountRequest) {
        String username = accountRequest.getUsername();
        String password = accountRequest.getPassword();
        String email = accountRequest.getEmail();

        // Check if username and password are provided
        if (username == null || password == null || email == null) {
            return ResponseEntity.status(401).body("Username, password, and email are required.");
        }

        // Check if account already exists
        if (accountRepo.findByUsername(username) != null) {
            return ResponseEntity.status(401).body("An Account with that username already exists.");
        }

        // Check if email is already in use
        if (accountRepo.findByEmail(email) != null) {
            return ResponseEntity.status(401).body("An Account with that email already exists.");
        }

        // Create new account and save to database
        Account newAccount = new Account();
        newAccount.setUsername(username);
        newAccount.setPassword(password);
        newAccount.setEmail(email);

        accountRepo.addAccount(newAccount.getUsername(), newAccount.getPassword(), newAccount.getEmail());

        return ResponseEntity.status(200).body("Account created successfully.");
    }
    
    public ResponseEntity<?> deleteAccount(AccountRequest accountRequest, HttpSession session) {
        String username = accountRequest.getUsername();
        String password = accountRequest.getPassword();

        // Get userID from session
        Long userID = (Long) session.getAttribute("userID");
        if (userID == null) {
            return ResponseEntity.status(401).body("User not logged in.");
        }

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
}

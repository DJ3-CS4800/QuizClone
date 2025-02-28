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

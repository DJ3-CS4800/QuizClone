package com.CS4800_DJ3.StudyDeckBackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CS4800_DJ3.StudyDeckBackend.DTO.AccountRequest;
import com.CS4800_DJ3.StudyDeckBackend.Service.AccountService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    /**
     * Delete an account
     * @param accountRequest: request body containing username and password
     * @param session: session object to store user information
     * @return response entity containing success or error message
     */
    @PostMapping(value = "/deleteAccount")
    public ResponseEntity<?> deleteAccount(@RequestBody AccountRequest accountRequest, HttpSession session) {
        return accountService.deleteAccount(accountRequest, session);
    }
}

package com.CS4800_DJ3.StudyDeckBackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CS4800_DJ3.StudyDeckBackend.DTO.AccountCreateRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.AccountRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.ApiResponseDTO;
import com.CS4800_DJ3.StudyDeckBackend.Service.AccountService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private AccountService accountService;


    @PostMapping("/register")
    @Operation(
        description = "Creates a new user account with a username, password, and email."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Account created successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request - missing or invalid data"),
    })
    public ResponseEntity<ApiResponseDTO> register(@RequestBody AccountCreateRequestDTO accountRequest) {
        return accountService.createAccount(accountRequest);
    }

    

    @PostMapping(value = "/deleteAccount")
    @Operation(
        description = "Deletes the user account with the given username and password. (Requires user to be logged in)"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Account deleted successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request - missing or invalid data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - user not logged in"),
    })
    public ResponseEntity<ApiResponseDTO> deleteAccount(@RequestBody AccountRequestDTO accountRequest, HttpSession session) {
        return accountService.deleteAccount(accountRequest, session);
    }
}

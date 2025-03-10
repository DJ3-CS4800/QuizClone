package com.CS4800_DJ3.StudyDeckBackend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.CS4800_DJ3.StudyDeckBackend.DTO.AccountRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.ApiResponseDTO;
import com.CS4800_DJ3.StudyDeckBackend.Models.Account;
import com.CS4800_DJ3.StudyDeckBackend.Repo.AccountRepo;
import com.CS4800_DJ3.StudyDeckBackend.Service.AuthService;

import jakarta.servlet.http.HttpSession;

public class AuthSerivceUnitTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private AccountRepo accountRepo;

    @Mock
    private HttpSession session;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLogin_Success() {
        AccountRequestDTO accountRequest = new AccountRequestDTO("testuser", "testpassword");
        Account account = mock(Account.class);

        when(accountRepo.findByUsername("testuser")).thenReturn(account);
        when(account.checkPassword("testpassword")).thenReturn(true);
        doNothing().when(session).setAttribute("username", "testuser");
        doNothing().when(session).setAttribute("userID", UUID.randomUUID());

        ResponseEntity<ApiResponseDTO> response = authService.login(accountRequest, session);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Logged in successfully.", response.getBody().getMessage());
    }

    @Test
    void testLogin_Fail_wrongPassword() {
        AccountRequestDTO accountRequest = new AccountRequestDTO("testuser", "wrongpassword");
        Account account = mock(Account.class);

        when(accountRepo.findByUsername("testuser")).thenReturn(account);
        when(account.checkPassword("wrongpassword")).thenReturn(false);

        ResponseEntity<ApiResponseDTO> response = authService.login(accountRequest, session);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid username or password.", response.getBody().getMessage());
    }

    @Test
    void testLogin_Fail_userNotFound() {
        AccountRequestDTO accountRequest = new AccountRequestDTO("nonexistentuser", "somepassword");
        when(accountRepo.findByUsername("nonexistentuser")).thenReturn(null); // Simulate user not found

        ResponseEntity<ApiResponseDTO> response = authService.login(accountRequest, session);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid username or password.", response.getBody().getMessage());
    }

}

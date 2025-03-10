package com.CS4800_DJ3.StudyDeckBackend;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import com.CS4800_DJ3.StudyDeckBackend.Repo.AccountRepo;
import com.CS4800_DJ3.StudyDeckBackend.Service.AuthService;

import jakarta.servlet.http.HttpSession;

@SpringBootTest
class Cs4800BackendApplicationTests {

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
	void contextLoads() {
	}
	
	@Test
void testAuthServiceBean() {
    assertNotNull(authService);  // Verify that the AuthService bean is loaded into the application context
}


}

package com.CS4800_DJ3.StudyDeckBackend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.CS4800_DJ3.StudyDeckBackend.Controller.AuthController;
import com.CS4800_DJ3.StudyDeckBackend.DTO.AccountCreateRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.Repo.AccountRepo;
import com.CS4800_DJ3.StudyDeckBackend.Service.AuthService;

@SpringBootTest
@AutoConfigureMockMvc
public class authAPIdoc {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private AuthService authService;

    MockHttpSession session = new MockHttpSession();

    @Test
    public void testLogin() throws Exception {
        String jsonBody = """
                { "username": "%s", "password": "%s" }
                """.formatted("1", "1");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonBody)
                .session(session))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.success").value("Logged in successfully."));
    }
}

package com.CS4800_DJ3.StudyDeckBackend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.UUID;
import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.CS4800_DJ3.StudyDeckBackend.Service.DeckProgressService;
import com.CS4800_DJ3.StudyDeckBackend.DTO.ApiResponseDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCardWithProgressDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckProgressEditRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.Models.DeckProgress;
import com.CS4800_DJ3.StudyDeckBackend.Repo.DeckProgressRepo;

import jakarta.servlet.http.HttpSession;

public class DeckProgressServiceTest {

    @InjectMocks
    private DeckProgressService deckProgressService;

    @Mock
    private DeckProgressRepo deckProgressRepo;

    @Mock
    private HttpSession session;

    private UUID userID;
    private UUID deckID;
    private DeckProgress sampleDeckProgress;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userID = UUID.randomUUID();
        deckID = UUID.randomUUID();

        // Create sample deck progress
        List<FlashCardWithProgressDTO> progressList = new ArrayList<>();
        progressList.add(new FlashCardWithProgressDTO(1, "Q1", "A1", 0, 0));
        progressList.add(new FlashCardWithProgressDTO(2, "Q2", "A2", 0, 0));

        sampleDeckProgress = new DeckProgress();
        sampleDeckProgress.setDeckID(deckID);
        sampleDeckProgress.setUserID(userID);
        sampleDeckProgress.setContentWithProgress(progressList);
    }

    @Test
    void testUpdateDeckProgress_Success() {
        when(session.getAttribute("userID")).thenReturn(userID);
        when(deckProgressRepo.findByUserIDAndDeckID(userID, deckID)).thenReturn(sampleDeckProgress);

        StudyDeckProgressEditRequestDTO editRequest = new StudyDeckProgressEditRequestDTO();
        editRequest.setContentWithProgress(List.of(
                new FlashCardWithProgressDTO(1, "Q1", "A1", 1, 0),
                new FlashCardWithProgressDTO(2, "Q2", "A2", 1, 1)));

        ResponseEntity<ApiResponseDTO> response = deckProgressService.updateDeckProgress(editRequest, deckID, session);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Deck progress updated successfully.", response.getBody().getMessage());

        verify(deckProgressRepo, times(1)).save(sampleDeckProgress);
    }

    @Test
    void testUpdateDeckProgress_Fail_UserNotLoggedIn() {
        when(session.getAttribute("userID")).thenReturn(null);

        StudyDeckProgressEditRequestDTO editRequest = new StudyDeckProgressEditRequestDTO();
        editRequest.setContentWithProgress(new ArrayList<>());

        ResponseEntity<ApiResponseDTO> response = deckProgressService.updateDeckProgress(editRequest, deckID, session);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("User not logged in.", response.getBody().getMessage());
    }

    @Test
    void testUpdateDeckProgress_Fail_DeckProgressNotFound() {
        when(session.getAttribute("userID")).thenReturn(userID);
        when(deckProgressRepo.findByUserIDAndDeckID(userID, deckID)).thenReturn(null);

        StudyDeckProgressEditRequestDTO editRequest = new StudyDeckProgressEditRequestDTO();
        editRequest.setContentWithProgress(new ArrayList<>());

        ResponseEntity<ApiResponseDTO> response = deckProgressService.updateDeckProgress(editRequest, deckID, session);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Deck progress not found.", response.getBody().getMessage());
    }
}

package com.CS4800_DJ3.StudyDeckBackend.Service;

import com.CS4800_DJ3.StudyDeckBackend.DTO.ApiResponseDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCardDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCardWithProgressDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckProgressEditRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.Models.StudyDeck;
import com.CS4800_DJ3.StudyDeckBackend.Models.DeckProgress;
import com.CS4800_DJ3.StudyDeckBackend.Repo.DeckProgressRepo;
import com.CS4800_DJ3.StudyDeckBackend.Util.ResponseUtil;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeckProgressService {

    @Autowired
    private DeckProgressRepo deckProgressRepo;

    public ResponseEntity<ApiResponseDTO> updateDeckProgress(
        StudyDeckProgressEditRequestDTO studyDeckProgressEditRequest, 
        long deckID,
        HttpSession session) {
        
        Long userID = (Long) session.getAttribute("userID");
        if (userID == null)
            return ResponseUtil.messsage(HttpStatus.UNAUTHORIZED, "User not logged in.");

        DeckProgress deckProgress = deckProgressRepo.findByUserIDAndDeckID(userID, deckID);
        if(deckProgress == null)
            return ResponseUtil.messsage(HttpStatus.NOT_FOUND, "Deck progress not found.");

        if(studyDeckProgressEditRequest.getContentWithProgress() == null)
            return ResponseUtil.messsage(HttpStatus.BAD_REQUEST, "Content with progress is null.");

        List<FlashCardWithProgressDTO> flashCardsWithProgress = studyDeckProgressEditRequest.getContentWithProgress().stream()
            .map(flashCardWithProgress -> new FlashCardWithProgressDTO(
                flashCardWithProgress.getCardID(),
                flashCardWithProgress.getQuestion(), 
                flashCardWithProgress.getAnswer(), 
                flashCardWithProgress.getUnderstandingLevel()))
            .collect(Collectors.toList());

        deckProgress.setContentWithProgress(flashCardsWithProgress);
        deckProgressRepo.save(deckProgress);

        return ResponseUtil.messsage(HttpStatus.OK, "Deck progress updated successfully.");
    }


    // Copy a study deck to a new deck progress object and save it to the database
    public DeckProgress copyStudyDeckToProgress(long deckID, long userID, StudyDeck studyDeck) {
        List<FlashCardWithProgressDTO> flashCardsWithProgress = studyDeck.getContent().stream()
                .map(flashCard -> new FlashCardWithProgressDTO(
                    flashCard.getCardID(),
                    flashCard.getQuestion(), 
                    flashCard.getAnswer(), 
                    0.0))
                .collect(Collectors.toList());

        DeckProgress deckProgress = new DeckProgress();
        deckProgress.setDeckID(deckID);
        deckProgress.setUserID(userID);
        deckProgress.setContentWithProgress(flashCardsWithProgress);

        deckProgressRepo.save(deckProgress);
        
        return deckProgress;
    }


    // Copy a study deck to a new deck progress object without saving it to the database
    public DeckProgress copyStudyDeckToProgressWithoutDB(long deckID, StudyDeck studyDeck) {
        List<FlashCardWithProgressDTO> flashCardsWithProgress = studyDeck.getContent().stream()
                .map(flashCard -> new FlashCardWithProgressDTO(
                    flashCard.getCardID(),
                    flashCard.getQuestion(), 
                    flashCard.getAnswer(), 
                    0.0))
                .collect(Collectors.toList());

        DeckProgress deckProgress = new DeckProgress();
        deckProgress.setDeckID(deckID);
        deckProgress.setContentWithProgress(flashCardsWithProgress);

        return deckProgress;
    }


    // Update the content in deckProgress with changes to content in studyDeck, transfer progress
    public DeckProgress updateStudyDeckToProgress(StudyDeck studyDeck, DeckProgress deckProgress) {
        List<FlashCardWithProgressDTO> flashCardsWithProgress = new ArrayList<>();
        int i = 0, j = 0;

        while(i < studyDeck.getContent().size() && j < deckProgress.getContentWithProgress().size()) {
            FlashCardDTO flashCard = studyDeck.getContent().get(i);
            FlashCardWithProgressDTO flashCardWithProgress = deckProgress.getContentWithProgress().get(j);

            if(flashCard.getCardID() == flashCardWithProgress.getCardID()) {
                flashCardsWithProgress.add(new FlashCardWithProgressDTO(
                    flashCard.getCardID(),
                    flashCard.getQuestion(), 
                    flashCard.getAnswer(), 
                    flashCardWithProgress.getUnderstandingLevel()));
                i++;
                j++;
            } else if(flashCard.getCardID() < flashCardWithProgress.getCardID()) {
                flashCardsWithProgress.add(new FlashCardWithProgressDTO(
                    flashCard.getCardID(),
                    flashCard.getQuestion(), 
                    flashCard.getAnswer(), 
                    0.0));
                i++;
            } else {
                j++;
            }
        }

        deckProgress.setContentWithProgress(flashCardsWithProgress);
        return deckProgress;
    }


    // update all deckProgress related to a studyDeck
    @Transactional
    public void updateAllStudyDeckToProgress(StudyDeck studyDeck) {
        List<DeckProgress> deckProgressList = deckProgressRepo.findAllByDeckID(studyDeck.getDeckID());
        for(DeckProgress deckProgress : deckProgressList) {
            updateStudyDeckToProgress(studyDeck, deckProgress);
            deckProgressRepo.save(deckProgress);
        }
    }


    // remove all deckProgress related to a studyDeck
    @Transactional
    public void removeAllStudyDeckToProgress(StudyDeck studyDeck) {
        List<DeckProgress> deckProgressList = deckProgressRepo.findAllByDeckID(studyDeck.getDeckID());
        for(DeckProgress deckProgress : deckProgressList) {
            deckProgressRepo.delete(deckProgress);
        }
    }

}
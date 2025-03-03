package com.CS4800_DJ3.StudyDeckBackend.Service;

import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCardWithProgressDTO;
import com.CS4800_DJ3.StudyDeckBackend.Models.StudyDeck;
import com.CS4800_DJ3.StudyDeckBackend.Models.DeckProgress;
import com.CS4800_DJ3.StudyDeckBackend.Repo.DeckProgressRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeckProgressService {

    @Autowired
    private DeckProgressRepo deckProgressRepo;

    // Copy a study deck to a new deck progress object and save it to the database
    public DeckProgress copyStudyDeckToProgress(long deckID, long userID, StudyDeck studyDeck) {
        List<FlashCardWithProgressDTO> flashCardsWithProgress = studyDeck.getContent().stream()
                .map(flashCard -> new FlashCardWithProgressDTO(flashCard.getQuestion(), 
                    flashCard.getAnswer(), 0.0))
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
                .map(flashCard -> new FlashCardWithProgressDTO(flashCard.getQuestion(), 
                    flashCard.getAnswer(), 0.0))
                .collect(Collectors.toList());

        DeckProgress deckProgress = new DeckProgress();
        deckProgress.setDeckID(deckID);
        deckProgress.setContentWithProgress(flashCardsWithProgress);

        return deckProgress;
    }
}
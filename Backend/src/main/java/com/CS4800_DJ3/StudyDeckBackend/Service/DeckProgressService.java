package com.CS4800_DJ3.StudyDeckBackend.Service;

import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCardWithProgress;
import com.CS4800_DJ3.StudyDeckBackend.Models.StudyDeck;
import com.CS4800_DJ3.StudyDeckBackend.Models.DeckProgress;
import com.CS4800_DJ3.StudyDeckBackend.Repo.DeckProgressRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeckProgressService {

    private final DeckProgressRepo deckProgressRepo;

    public DeckProgressService(DeckProgressRepo deckProgressRepository) {
        this.deckProgressRepo = deckProgressRepository;
    }

    public DeckProgress copyStudyDeckToProgress(long deckID, long userID, StudyDeck studyDeck) {
        List<FlashCardWithProgress> flashCardsWithProgress = studyDeck.getContent().stream()
                .map(flashCard -> new FlashCardWithProgress(flashCard.getQuestion(), 
                    flashCard.getAnswer(), 0.0))
                .collect(Collectors.toList());

        DeckProgress deckProgress = new DeckProgress();
        deckProgress.setDeckID(deckID);
        deckProgress.setUserID(userID);
        deckProgress.setCcontentWithProgress(flashCardsWithProgress);

        deckProgressRepo.save(deckProgress);
        
        return deckProgress;
    }
}
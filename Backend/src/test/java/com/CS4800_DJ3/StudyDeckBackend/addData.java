package com.CS4800_DJ3.StudyDeckBackend;

import java.util.List;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.TestInstance.Lifecycle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCard;
import com.CS4800_DJ3.StudyDeckBackend.Models.StudyDeck;
import com.CS4800_DJ3.StudyDeckBackend.Repo.StudyDeckRepo;

@SpringBootTest
@TestInstance(Lifecycle.PER_CLASS)
@AutoConfigureMockMvc
public class addData {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    StudyDeckRepo studyDeckRepo;

    @Test
    public void testAddData() {
        StudyDeck deck = new StudyDeck();
        deck.setDeckName("Deck 1");
        deck.setOwnerID(1);
        deck.setPublic(true);

        List<FlashCard> flashcards = List.of(
            new FlashCard("What is 10 x 10?", "100"),
            new FlashCard("What is 23 + 58?", "81"),
            new FlashCard("What is 55 - 33?", "22")
        );


        deck.setContent(flashcards);

        studyDeckRepo.save(deck);
    }

    @Test 
    public void testAddData2() {
        StudyDeck deck = new StudyDeck();
        deck.setDeckName("Math Final Study");
        deck.setOwnerID(1);
        deck.setPublic(false);

        List<FlashCard> flashcards = List.of(
            new FlashCard("What is 800 - 28 x 3?", "716"),
            new FlashCard("What is 2^10?", "1024"),
            new FlashCard("What is 3.14 x 10^2?", "314")
        );

        deck.setContent(flashcards);

        studyDeckRepo.save(deck);
    }

}
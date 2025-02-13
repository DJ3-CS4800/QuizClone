package com.CS4800_DJ3.StudyDeckBackend.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.CS4800_DJ3.StudyDeckBackend.Models.DeckProgress;

public interface DeckProgressRepo extends JpaRepository<DeckProgress, Long> {
    
    /**
     * SQL Query to find a deck progress by user id and deck id
     * @param userID: user id
     * @param deckID: deck id
     * @return DeckProgress: deck progress with the given user id and deck id
     */
    @Query(value = "SELECT * FROM deck_progress WHERE user_id = ?1 AND deck_id = ?2", nativeQuery = true)
    DeckProgress findByUserIDAndDeckID(long userID, long deckID);
} 

package com.CS4800_DJ3.StudyDeckBackend.Repo;

import java.util.List;
import java.util.UUID;

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
    DeckProgress findByUserIDAndDeckID(UUID userID, UUID deckID);


    /**
     * SQL Query to delete a deck progress by user id and deck id
     * @param userID: user id
     * @param deckID: deck id
     * @return DeckProgress: deck progress with the given user id and deck id
     */
    @Query(value = "DELETE FROM deck_progress WHERE user_id = ?1 AND deck_id = ?2", nativeQuery = true)
    void deleteByUserIDAndDeckID(UUID userID, UUID deckID);


    /**
     * SQL Query to find all deck progress by deck id
     * @param deckID: deck id
     * @return DeckProgress: deck progress with the given deck id
     */
    @Query(value = "SELECT * FROM deck_progress WHERE deck_id = ?1", nativeQuery = true)
    List<DeckProgress> findAllByDeckID(UUID deckID);
} 

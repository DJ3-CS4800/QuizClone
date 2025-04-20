package com.CS4800_DJ3.StudyDeckBackend.Repo;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckWithProgressDTO;
import com.CS4800_DJ3.StudyDeckBackend.Models.StudyDeck;

import jakarta.transaction.Transactional;

public interface StudyDeckRepo extends JpaRepository<StudyDeck, Long> {

    /**
     * SQL Query to find a StudyDeck by deckID
     * 
     * @param deckID: the deckID of the StudyDeck
     * @return: StudyDeck with the given deckID
     */
    @Query(value = "SELECT * FROM study_deck WHERE deck_id = ?1", nativeQuery = true)
    StudyDeck findByDeckID(UUID deckID);

    /**
     * SQL Query to find all StudyDecks by ownerID, sort by deckID descending
     * 
     * @param ownerID: the ownerID of the StudyDeck
     * @return: List of StudyDecks with the given ownerID
     */
    @Query(value = "SELECT * FROM study_deck WHERE owner_id = ?1 ORDER BY deck_id DESC", nativeQuery = true)
    List<StudyDeck> findAllByOwnerID(UUID ownerID);

    /**
     * SQL Query to delete a StudyDeck by deckID
     * 
     * @param deckID: the deckID of the StudyDeck
     */
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM study_deck WHERE deck_id = ?1", nativeQuery = true)
    void deleteStudyDeck(UUID deckID);

    /**
     * SQL Query to update the name of a StudyDeck
     * 
     * @param deckID: the deckID of the StudyDeck
     */
    @Transactional
    @Modifying
    @Query(value = "UPDATE study_deck SET deck_name = ?2 WHERE deck_id = ?1", nativeQuery = true)
    void updateName(UUID deckID, String name);

    /**
     * SQL Query to update the public status of a StudyDeck
     * 
     * @param deckID: the deckID of the StudyDeck
     */
    @Transactional
    @Modifying
    @Query(value = "UPDATE study_deck SET is_public = ?2 WHERE deck_id = ?1", nativeQuery = true)
    void updatePublic(UUID deckID, boolean isPublic);

    /**
     * SQL Query to find all StudyDecks with progress by a list of deckIDs
     * 
     * @param userId
     * @return
     */
    @Query(value = 
            "SELECT s.deck_id, s.deck_name, s.owner_id, s.owner_name, s.is_public, s.created_at, s.updated_at, dp.last_opened, dp.is_favorite " +
            "FROM study_deck s " +
            "JOIN deck_progress dp ON s.deck_id = dp.deck_id " +
            "WHERE dp.user_id = ?1 " +
            "ORDER BY dp.last_opened DESC", nativeQuery = true)
    List<StudyDeckWithProgressDTO> findDecksWithProgress(UUID userId);

    /**
     * Finds all public StudyDecks with deck names that contain the given search query (ignoring case).
     *
     * @param deckName the search query string to match within deck names.
     * @return a list of matching public StudyDecks.
     */
    @Query(value = "SELECT * FROM study_deck WHERE is_public = true AND deck_name ILIKE '%' || ?1 || '%'", nativeQuery = true)
    List<StudyDeck> searchPublicDecksNotLoggedIn(String deckName);

    /**
     * Finds all public StudyDecks with deck names that contain the given search query (ignoring case)
     * while excluding decks owned by the provided userID.
     *
     * @param ownerID  the UUID of the user whose decks should be excluded.
     * @param deckName the search query string to match within deck names.
     * @return a list of matching public StudyDecks not owned by the specified user.
     */
    @Query(value = "SELECT * FROM study_deck WHERE is_public = true AND owner_id <> ?1 AND deck_name ILIKE '%' || ?2 || '%'", nativeQuery = true)
    List<StudyDeck> searchPublicDecksLoggedIn(UUID ownerID, String deckName);

}

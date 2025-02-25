package com.CS4800_DJ3.StudyDeckBackend.Repo;

import java.util.List;
import org.springframework.data.jpa.repository.*;

import com.CS4800_DJ3.StudyDeckBackend.Models.StudyDeck;

import jakarta.transaction.Transactional;

public interface StudyDeckRepo extends JpaRepository<StudyDeck, Long> {
    

    /**
     * SQL Query to find a StudyDeck by deckID
     * @param deckID: the deckID of the StudyDeck
     * @return: StudyDeck with the given deckID
     */
    @Query(value = "SELECT * FROM study_deck WHERE deck_id = ?1", nativeQuery = true)
    StudyDeck findByDeckID(long deckID);


    /**
     * SQL Query to find all StudyDecks by ownerID
     * @param ownerID: the ownerID of the StudyDeck
     * @return: List of StudyDecks with the given ownerID
     */
    @Query(value = "SELECT * FROM study_deck WHERE owner_id = ?1", nativeQuery = true)
    List<StudyDeck> findAllByOwnerID(long ownerID);


    /**
     * SQL Query to add a new StudyDeck
     * @param deckName: the name of the StudyDeck
     * @param ownerID: the ownerID of the StudyDeck
     * @param content: the content of the StudyDeck
     * @return: the deckID of the new StudyDeck
     */
    @Transactional
    @Modifying
    @Query(value = "INSERT INTO study_deck (deck_name, owner_id, content) VALUES (?1, ?2, ?3) RETURNING deck_id", nativeQuery = true)
    long addStudyDeck(String deckName, int ownerID, String content);


    /**
     * SQL Query to delete a StudyDeck by deckID
     * @param deckID: the deckID of the StudyDeck
     */
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM study_deck WHERE deck_id = ?1", nativeQuery = true)
    void deleteStudyDeck(long deckID);


    /**
     * SQL Query to update the name of a StudyDeck
     * @param deckID: the deckID of the StudyDeck
     */
    @Transactional
    @Modifying
    @Query(value = "UPDATE study_deck SET deck_name = ?2 WHERE deck_id = ?1", nativeQuery = true)
    void updateName(long deckID, String name);


    /**
     * SQL Query to update the public status of a StudyDeck
     * @param deckID: the deckID of the StudyDeck
     */
    @Transactional
    @Modifying
    @Query(value = "UPDATE study_deck SET is_public = ?2 WHERE deck_id = ?1", nativeQuery = true)
    void updatePublic(long deckID, boolean isPublic);
}

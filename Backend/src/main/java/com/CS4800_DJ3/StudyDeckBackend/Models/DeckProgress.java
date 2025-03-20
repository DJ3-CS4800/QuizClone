package com.CS4800_DJ3.StudyDeckBackend.Models;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

import com.CS4800_DJ3.StudyDeckBackend.Converter.FlashCardWithProgressConverter;
import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCardWithProgressDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "deck_progress")
public class DeckProgress {
    
    // id of the progress
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "progress_id")
    private long progressID;

    // id of the deck with progress
    @Column(name = "deck_id")
    private UUID deckID;

    // id of the user with progress
    @Column(name = "user_id")
    private UUID userID;

    // last opened time of the deck
    @Column(name = "last_opened")
    private Timestamp lastOpened;

    // favorite status of the deck
    @Column(name = "is_favorite")
    private boolean isFavorite;    

    // content of the deck with progress
    @Column(name = "content_with_progress", columnDefinition = "JSON")
    @Convert(converter = FlashCardWithProgressConverter.class)
    @org.hibernate.annotations.ColumnTransformer(
    read = "content::json",
    write = "?::json")
    private List<FlashCardWithProgressDTO> contentWithProgress;


    // getters and setters
    public long getProgressID() {
        return progressID;
    }

    public void setProgressID(long progressID) {
        this.progressID = progressID;
    }

    public UUID getDeckID() {
        return deckID;
    }

    public void setDeckID(UUID deckID) {
        this.deckID = deckID;
    }

    public UUID getUserID() {
        return userID;
    }

    public void setUserID(UUID userID) {
        this.userID = userID;
    }

    public Timestamp getLastOpened() {
        return lastOpened;
    }

    public void setLastOpened(Timestamp lastOpened) {
        this.lastOpened = lastOpened;
    }

    public boolean getIsFavorite() {
        return isFavorite;
    }

    public void setIsFavorite(boolean isFavorite) {
        this.isFavorite = isFavorite;
    }

    public List<FlashCardWithProgressDTO> getContentWithProgress() {
        return contentWithProgress;
    }

    public void setContentWithProgress(List<FlashCardWithProgressDTO> contentWithProgress) {
        this.contentWithProgress = contentWithProgress;
    }
}

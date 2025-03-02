package com.CS4800_DJ3.StudyDeckBackend.Models;

import java.sql.Date;
import java.util.List;

import com.CS4800_DJ3.StudyDeckBackend.Converter.FlashCardWithProgressConverter;
import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCardWithProgress;

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
    private long deckID;

    // id of the user with progress
    @Column(name = "user_id")
    private long userID;

    // last opened date
    @Column(name = "last_opened")
    private Date lastOpened;

    // content of the deck with progress
    @Column(name = "content_with_progress", columnDefinition = "JSON")
    @Convert(converter = FlashCardWithProgressConverter.class)
    @org.hibernate.annotations.ColumnTransformer(
    read = "content::json",
    write = "?::json")
    private List<FlashCardWithProgress> contentWithProgress;


    // getters and setters
    public long getProgressID() {
        return progressID;
    }

    public void setProgressID(long progressID) {
        this.progressID = progressID;
    }

    public long getDeckID() {
        return deckID;
    }

    public void setDeckID(long deckID) {
        this.deckID = deckID;
    }

    public long getUserID() {
        return userID;
    }

    public void setUserID(long userID) {
        this.userID = userID;
    }

    public Date getLastOpened() {
        return lastOpened;
    }

    public void setLastOpened(Date lastOpened) {
        this.lastOpened = lastOpened;
    }

    public List<FlashCardWithProgress> getContentWithProgress() {
        return contentWithProgress;
    }

    public void setContentWithProgress(List<FlashCardWithProgress> contentWithProgress) {
        this.contentWithProgress = contentWithProgress;
    }
}

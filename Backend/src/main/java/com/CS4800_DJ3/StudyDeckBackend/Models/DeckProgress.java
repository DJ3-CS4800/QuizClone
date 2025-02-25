package com.CS4800_DJ3.StudyDeckBackend.Models;

import java.util.List;

import com.CS4800_DJ3.StudyDeckBackend.Converter.FlashCardWithProgressConverter;
import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCardWithProgress;

import jakarta.persistence.*;

@Entity
@Table(name = "deck_progress")
public class DeckProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "progress_id")
    private long progressID;

    @Column(name = "deck_id")
    private long deckID;

    @Column(name = "user_id")
    private long userID;

    @Column(name = "userName")
    private String userName;

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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public List<FlashCardWithProgress> getContentWithProgress() {
        return contentWithProgress;
    }

    public void setContentWithProgress(List<FlashCardWithProgress> contentWithProgress) {
        this.contentWithProgress = contentWithProgress;
    }
}

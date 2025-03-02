package com.CS4800_DJ3.StudyDeckBackend.Models;

import java.sql.Date;
import java.util.List;

import com.CS4800_DJ3.StudyDeckBackend.Converter.FlashCardConverter;
import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCard;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "study_deck")
public class StudyDeck {

    // id of the deck
    @Id
    @Column(name = "deck_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long deckID;

    //  name of the deck
    @Column(name = "deck_name")
    private String deckName;

    // id of the owner
    @Column(name = "owner_id")
    private long ownerID;

    // userName of the owner
    @Column(name = "owner_name")
    private String ownerName;

    // is the deck public, if not only the owner can see it
    @Column(name = "is_public")
    private boolean isPublic;

    // Created at
    @Column(name = "created_at")
    private Date createdAt;

    // Updated at
    @Column(name = "updated_at")
    private Date updatedAt;

    // content of the deck
    @Column(name = "content", columnDefinition = "JSON")
    @Convert(converter = FlashCardConverter.class)
    @org.hibernate.annotations.ColumnTransformer(
    read = "content::json",
    write = "?::json")
    private List<FlashCard> content;


    // getters and setters
    public long getDeckID() {
        return deckID;
    }

    public void setDeckID(long deckID) {
        this.deckID = deckID;
    }

    public String getDeckName() {
        return deckName;
    }

    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }

    public List<FlashCard> getContent() {
        return content;
    }

    public void setContent(List<FlashCard> content) {
        this.content = content;
    }

    public long getOwnerID() {
        return ownerID;
    }

    public void setOwnerID(long ownerID) {
        this.ownerID = ownerID;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}

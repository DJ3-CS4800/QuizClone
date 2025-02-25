package com.CS4800_DJ3.StudyDeckBackend.Models;

import java.util.List;

import com.CS4800_DJ3.StudyDeckBackend.Converter.FlashCardConverter;
import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCard;

import jakarta.persistence.*;

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
}

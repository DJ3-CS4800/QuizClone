package com.CS4800_DJ3.StudyDeckBackend.DTO;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class StudyDeckWithProgressDTO {
    @JsonProperty("deck_id")
    private UUID deckId;

    @JsonProperty("deck_name")
    private String deckName;

    @JsonProperty("owner_id")
    private UUID ownerId;

    @JsonProperty("owner_name")
    private String ownerName;

    @JsonProperty("is_public")
    private boolean isPublic;
    
    @JsonProperty("created_at")
    private Date createdAt;

    @JsonProperty("updated_at")
    private Date updatedAt;

    @JsonProperty("last_opened")
    private Timestamp lastOpened;

    @JsonProperty("is_favorite")
    private boolean isFavorite;

    public StudyDeckWithProgressDTO(UUID deckID, String deckName, UUID ownerID, String ownerName, 
                                    boolean isPublic, Date createdAt, Date updatedAt, Timestamp lastOpened, boolean isFavorite) {
        this.deckId = deckID;
        this.deckName = deckName;
        this.ownerId = ownerID;
        this.ownerName = ownerName;
        this.isPublic = isPublic;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastOpened = lastOpened;
        this.isFavorite = isFavorite;
    }


    public UUID getDeckId() {
        return deckId;
    }

    public void setDeckId(UUID deckID) {
        this.deckId = deckID;
    }

    public String getDeckName() {
        return deckName;
    }

    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerID) {
        this.ownerId = ownerID;
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

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
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
}

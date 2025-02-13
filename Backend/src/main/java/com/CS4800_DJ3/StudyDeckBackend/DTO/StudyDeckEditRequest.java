package com.CS4800_DJ3.StudyDeckBackend.DTO;

import java.util.List;

public class StudyDeckEditRequest {
    String deckName; 
    boolean isPublic;
    long deckID;
    List<FlashCard> content;

    public String getDeckName() {
        return deckName;
    }

    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void isPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public long getDeckID() {
        return deckID;
    }

    public void setDeckID(long deckID) {
        this.deckID = deckID;
    }

    public List<FlashCard> getContent() {
        return content;
    }

    public void setContent(List<FlashCard> content) {
        this.content = content;
    }
    
}

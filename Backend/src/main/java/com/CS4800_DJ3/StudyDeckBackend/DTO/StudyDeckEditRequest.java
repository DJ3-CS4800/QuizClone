package com.CS4800_DJ3.StudyDeckBackend.DTO;

import java.util.List;

public class StudyDeckEditRequest {
    String deckName; 
    boolean isPublic;
    List<FlashCard> content;

    public String getDeckName() {
        return deckName;
    }

    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }

    public boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public List<FlashCard> getContent() {
        return content;
    }

    public void setContent(List<FlashCard> content) {
        this.content = content;
    }
    
}

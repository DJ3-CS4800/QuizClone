package com.CS4800_DJ3.StudyDeckBackend.DTO;

import java.util.List;

public class StudyDeckCreateRequestDTO {
    String deckName; 
    boolean isPublic;
    List<FlashCardDTO> content;

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

    public List<FlashCardDTO> getContent() {
        return content;
    }

    public void setContent(List<FlashCardDTO> content) {
        this.content = content;
    }
}

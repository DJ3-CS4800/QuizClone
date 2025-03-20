package com.CS4800_DJ3.StudyDeckBackend.DTO;

public class DeckProgressUnderstandingLevelEditRequestDTO {
    private long flashCardId;
    private double understandingLevel;

    public long getFlashCardId() {
        return flashCardId;
    }

    public void setFlashCardId(long flashCardId) {
        this.flashCardId = flashCardId;
    }

    public double getUnderstandingLevel() {
        return understandingLevel;
    }

    public void setUnderstandingLevel(double understandingLevel) {
        this.understandingLevel = understandingLevel;
    }
}

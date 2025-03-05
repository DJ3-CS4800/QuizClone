package com.CS4800_DJ3.StudyDeckBackend.DTO;

public class FlashCardWithProgressDTO {
    private long cardID;
    private String question;
    private String answer;
    private double understandingLevel;

    public FlashCardWithProgressDTO() {}

    public FlashCardWithProgressDTO(long cardID, String question, String answer, double understandingLevel) {
        this.cardID = cardID;
        this.question = question;
        this.answer = answer;
        this.understandingLevel = understandingLevel;
    }

    public long getCardID() { 
        return cardID; 
    }

    public void setCardID(long cardID) { 
        this.cardID = cardID; 
    }

    public String getQuestion() { 
        return question; 
    }

    public void setQuestion(String question) { 
        this.question = question; 
    }

    public String getAnswer() { 
        return answer; 
    }

    public void setAnswer(String answer) { 
        this.answer = answer; 
    }

    public double getUnderstandingLevel() { 
        return understandingLevel; 
    }

    public void setUnderstandingLevel(double understandingLevel) { 
        this.understandingLevel = understandingLevel; 
    }
}

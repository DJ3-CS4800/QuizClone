package com.CS4800_DJ3.StudyDeckBackend.DTO;

public class FlashCardWithProgressDTO {
    private long cardID;
    private String question;
    private String answer;
    private int totalAttempts;
    private int totalCorrect;

    public FlashCardWithProgressDTO() {}

    public FlashCardWithProgressDTO(long cardID, String question, String answer, int totalAttempts, int totalCorrect) {
        this.cardID = cardID;
        this.question = question;
        this.answer = answer;
        this.totalAttempts = totalAttempts;
        this.totalCorrect = totalCorrect;
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

    public int getTotalAttempts() { 
        return totalAttempts; 
    }

    public void setTotalAttempts(int totalAttempts) { 
        this.totalAttempts = totalAttempts; 
    }

    public int getTotalCorrect() { 
        return totalCorrect; 
    }

    public void setTotalCorrect(int totalCorrect) { 
        this.totalCorrect = totalCorrect; 
    }
}

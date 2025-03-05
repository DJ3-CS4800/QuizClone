package com.CS4800_DJ3.StudyDeckBackend.DTO;

public class FlashCardDTO {
    private long cardID;
    private String question;
    private String answer;

    public FlashCardDTO() {}

    public FlashCardDTO(long cardID, String question, String answer) {
        this.cardID = cardID;
        this.question = question;
        this.answer = answer;
    }

    public long getCardID() { return cardID; }
    public void setCardID(long cardID) { this.cardID = cardID; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
}

package com.CS4800_DJ3.StudyDeckBackend.DTO;

public class FlashCardDTO {
    private String question;
    private String answer;

    public FlashCardDTO() {}

    public FlashCardDTO(String question, String answer) {
        this.question = question;
        this.answer = answer;
    }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
}

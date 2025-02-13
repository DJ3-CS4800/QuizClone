package com.CS4800_DJ3.StudyDeckBackend.DTO;

public class FlashCardWithProgress {
    private String question;
    private String answer;
    private double understandingLevel;

    public FlashCardWithProgress() {}

    public FlashCardWithProgress(String question, String answer, double understandingLevel) {
        this.question = question;
        this.answer = answer;
        this.understandingLevel = understandingLevel;
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

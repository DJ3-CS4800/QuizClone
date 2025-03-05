package com.CS4800_DJ3.StudyDeckBackend.DTO;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;


public class StudyDeckProgressEditRequestDTO {
    @JsonProperty("contentWithProgress")
    List<FlashCardWithProgressDTO> contentWithProgress;


    public List<FlashCardWithProgressDTO> getContentWithProgress() {
        return contentWithProgress;
    }

    public void setContentWithProgress(List<FlashCardWithProgressDTO> contentWithProgress) {
        this.contentWithProgress = contentWithProgress;
    }
}

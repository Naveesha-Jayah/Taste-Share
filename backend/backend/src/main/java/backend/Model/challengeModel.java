package backend.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;

import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class challengeModel {
    @Id
    @GeneratedValue

    private Long id;
    private String challengeTitle;
    private String challengeDetails;

    private LocalDate startDate;
    private LocalDate endtDate;

    private String coverImg;

    public challengeModel(){

    }

    public challengeModel(Long id, String challengeTitle, String challengeDetails, LocalDate startDate, LocalDate endtDate, String coverImg) {
        this.id = id;
        this.challengeTitle = challengeTitle;
        this.challengeDetails = challengeDetails;
        this.startDate = startDate;
        this.endtDate = endtDate;
        this.coverImg = coverImg;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChallengeTitle() {
        return challengeTitle;
    }

    public void setChallengeTitle(String challengeTitle) {
        this.challengeTitle = challengeTitle;
    }

    public String getChallengeDetails() {
        return challengeDetails;
    }

    public void setChallengeDetails(String challengeDetails) {
        this.challengeDetails = challengeDetails;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndtDate() {
        return endtDate;
    }

    public void setEndtDate(LocalDate endtDate) {
        this.endtDate = endtDate;
    }

    public String getCoverImg() {
        return coverImg;
    }

    public void setCoverImg(String coverImg) {
        this.coverImg = coverImg;
    }
}

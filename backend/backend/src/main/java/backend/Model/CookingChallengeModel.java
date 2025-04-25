package backend.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class CookingChallengeModel {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)

    private Long challengeId;

    private String ChallengeTitle;

    private String ChallengeDetails;

    private LocalDate startDate;

    private LocalDate endDate;

    private String ChallengeImage;

    public CookingChallengeModel(){}

    public CookingChallengeModel(Long challengeId, String challengeTitle, String challengeDetails, LocalDate startDate, LocalDate endDate, String challengeImage) {
        this.challengeId = challengeId;
        ChallengeTitle = challengeTitle;
        ChallengeDetails = challengeDetails;
        this.startDate = startDate;
        this.endDate = endDate;
        ChallengeImage = challengeImage;
    }

    public Long getChallengeId() {
        return challengeId;
    }

    public void setChallengeId(Long challengeId) {
        this.challengeId = challengeId;
    }

    public String getChallengeTitle() {
        return ChallengeTitle;
    }

    public void setChallengeTitle(String challengeTitle) {
        ChallengeTitle = challengeTitle;
    }

    public String getChallengeDetails() {
        return ChallengeDetails;
    }

    public void setChallengeDetails(String challengeDetails) {
        ChallengeDetails = challengeDetails;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getChallengeImage() {
        return ChallengeImage;
    }

    public void setChallengeImage(String challengeImage) {
        ChallengeImage = challengeImage;
    }
}

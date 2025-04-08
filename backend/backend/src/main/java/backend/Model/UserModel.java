package backend.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class UserModel {
    @Id
    @GeneratedValue

    private Long id;

    private String fullName;
    private String emailAddress;
    private String password;
    private String confirmPassword;



    public UserModel(){

    }

    public UserModel(Long id, String fullName, String emailAddress, String password, String confirmPassword) {
        this.id = id;
        this.fullName = fullName;
        this.emailAddress = emailAddress;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}

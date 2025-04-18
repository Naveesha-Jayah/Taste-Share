package backend.Exception;

public class UserMNotFoundException extends RuntimeException {
    public UserMNotFoundException(Long id) {
        super("Could not find user with id: " + id);
    }

    public UserMNotFoundException(String message) {
        super(message);
    }

    public UserMNotFoundException(String provider, String providerId) {
        super("Could not find user with provider: " + provider + " and provider ID: " + providerId);
    }
}
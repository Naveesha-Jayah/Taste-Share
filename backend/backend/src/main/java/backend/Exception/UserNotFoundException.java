package backend.Exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(Long id){
        super("Could Not Find Id"+ id);
    }
    public UserNotFoundException(String message){
        super(message);
    }
}

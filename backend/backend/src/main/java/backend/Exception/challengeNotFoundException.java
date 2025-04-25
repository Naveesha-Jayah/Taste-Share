package backend.Exception;

public class challengeNotFoundException extends RuntimeException{
    public challengeNotFoundException(Long id ){
        super("Could not find is" + id);
    }
    public challengeNotFoundException(String message){
        super(message);
    }

}

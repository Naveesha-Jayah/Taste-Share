package backend.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class PlanNotFoundAdvice {

    @ResponseBody
    @ExceptionHandler(PlanNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String planNotFoundHandler(PlanNotFoundException ex) {
        return ex.getMessage();
    }
}

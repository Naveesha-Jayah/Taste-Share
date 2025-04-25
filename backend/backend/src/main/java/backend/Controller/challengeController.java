package backend.Controller;

import backend.Exception.challengeNotFoundException;
import backend.Model.challengeModel;
import backend.Repository.challengeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class challengeController {
    @Autowired
    private challengeRepository  ChallengeRepository;


    @PostMapping("/challenges")
    public challengeModel newChallengeModel(@RequestBody challengeModel newChallengeModel){
        return ChallengeRepository.save(newChallengeModel);
    }

    @PostMapping("/challenges/coverImg")
    public String coverImg(@RequestParam("file")MultipartFile file){
        String folder ="src/main/uploads/";String coverImg = file.getOriginalFilename();
        try{
            File uploadDir =new File(folder);
            if(!uploadDir.exists()){
                uploadDir.mkdir();
            }
            file.transferTo(Paths.get(folder+coverImg));
        }catch (IOException e){
            e.printStackTrace();
            return "Error uploading file;" + coverImg;
        }
        return coverImg;

    }
    @GetMapping("/challenges")
    List<challengeModel>getAllChallenges(){return ChallengeRepository.findAll();}

    @GetMapping("/challenges/{id}")
    challengeModel getChallengeId(@PathVariable Long id){
        return ChallengeRepository.findById(id).orElseThrow(() -> new challengeNotFoundException(id));
    }

    private final String UPLOAD_DIR = "src/main/uploads/";
    @GetMapping ("/uploads/{filename}")
    public ResponseEntity<FileSystemResource>getImage(@PathVariable String filename){
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()){
            return  ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));

    }






}




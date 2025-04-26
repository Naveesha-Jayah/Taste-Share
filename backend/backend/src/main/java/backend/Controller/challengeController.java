package backend.Controller;

import backend.Exception.challengeNotFoundException;
import backend.Model.challengeModel;
import backend.Repository.challengeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    //UPDATE
    @PutMapping("/challenges/{id}")
   public challengeModel updateChallenge(
           @RequestPart(value ="challengeDetails") String challengeDetails,
           @RequestPart(value = "file",required = false)MultipartFile file,
           @PathVariable Long id
    ) {
        System.out.println("ChallengeDetails:" + challengeDetails);
        if (file != null) {
            System.out.println("File recived:" + file.getOriginalFilename());
        } else {
            System.out.println("no file uploaded:");
        }
        ObjectMapper mapper = new ObjectMapper();
        challengeModel newChallenge;
        try {
            newChallenge = mapper.readValue(challengeDetails, challengeModel.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing iteDetails", e);
        }
        return ChallengeRepository.findById(id).map(challenge -> {
            challenge.setChallengeDetails(newChallenge.getChallengeDetails());
            challenge.setStartDate(newChallenge.getStartDate());
            challenge.setEndtDate(newChallenge.getEndtDate());
            challenge.setCoverImg(newChallenge.getCoverImg());

            if (file != null && !file.isEmpty()) {
                String folder = "src/main/uploads/";
                String coverImg = file.getOriginalFilename();
                try {
                    file.transferTo(Paths.get(folder + coverImg));
                    challenge.setCoverImg(coverImg);
                } catch (IOException e) {
                    throw new RuntimeException("Error saving uploaded file ", e)
                }
            }
            return ChallengeRepository.save(challenge);


            return ChallengeRepository.save(challenge);
        }).orElseThrow(() -> new challengeNotFoundException(id));
    }

    @DeleteMapping("/challenges/{id}")
    public String deleteChallenge(@PathVariable Long id) {
        challengeModel ChallengeItem = ChallengeRepository.findById(id)
                .orElseThrow(() -> new challengeNotFoundException(id));

        String  coverImg = ChallengeItem.getCoverImg();
        if (coverImg !=null && !coverImg.isEmpty()) {
            File imagefile = new File("src/main/uploads" + coverImg);
            if (imagefile.exists()) {
                if (imagefile.delete()) {
                    System.out.println("Image Deleted");
                } else {
                    System.out.println("failed Image Delete");
                }

            }
        }
        //Delete repo C
        ChallengeRepository.deleteById(id);
        return "data with id "+id+ "and image deleted";

    }









}




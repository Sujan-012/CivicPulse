@RestController
public class MessageController {

    @PostMapping("/message")
    public String message() {
        return "Message Added Successfully";
    }

}

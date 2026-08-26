@RestController
@RequestMapping("/api")
public class WelcomeController {

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to Spring Boot";
    }

}

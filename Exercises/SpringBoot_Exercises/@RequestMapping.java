@RestController
@RequestMapping("/student")
public class StudentController {

    @RequestMapping("/home")
    public String home() {
        return "Student Home";
    }

}

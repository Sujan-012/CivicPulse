@RestController
public class StudentController {

    @PutMapping("/update")
    public String update() {
        return "Student Updated";
    }

}

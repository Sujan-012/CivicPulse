@RestController
public class StudentController {

    @DeleteMapping("/delete")
    public String delete() {
        return "Student Deleted";
    }

}

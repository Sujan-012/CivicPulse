@RestController
public class StudentController {

    @GetMapping("/student/{id}")
    public String getStudent(@PathVariable int id) {
        return "Student Id : " + id;
    }

}

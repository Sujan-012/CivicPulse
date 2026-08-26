@RestController
public class StudentController {

    @PostMapping("/student")
    public Student addStudent(@RequestBody Student student) {
        return student;
    }

}

class Student {

    public int id;
    public String name;

}

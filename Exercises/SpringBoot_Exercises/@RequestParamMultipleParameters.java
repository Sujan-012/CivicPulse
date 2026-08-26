@RestController
public class EmployeeController {

    @GetMapping("/employee")
    public String employee(
            @RequestParam String name,
            @RequestParam int age) {

        return name + " " + age;
    }

}

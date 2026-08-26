@RestController
public class CalculatorController {

    @GetMapping("/add")
    public int add(@RequestParam int a,
                   @RequestParam int b) {

        return a + b;
    }

}

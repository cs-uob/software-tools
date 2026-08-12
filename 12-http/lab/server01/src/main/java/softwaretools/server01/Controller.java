package softwaretools.server01;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;

@RestController
public class Controller {

    @Autowired
    ResourceLoader loader;

    @GetMapping("/")
    public ResponseEntity<String> mainPage() {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_TYPE, "text/plain");

        return new ResponseEntity<String>("Hello from Spring", headers, 200);
    }

    @GetMapping("/html")
    public ResponseEntity<Resource> htmlPage() {
        Resource htmlfile = loader.getResource("classpath:web/page.html");
        return ResponseEntity
            .status(200)
            .header(HttpHeaders.CONTENT_TYPE, "text/html")
            .body(htmlfile);
    }
}

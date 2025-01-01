# A server in Java

From now on, we will be using the Java language and the Spring Boot framework to
run 'real' web servers that you might deploy in a software engineering project.

## Compile and run

Make sure you have Java and Maven installed as per the build tools instructions
from last term.  Clone the repository `git@github.com:cs-uob/software-tools` if
you have not done so already, and navigate to the folder `server01` in this
week's lab.  In this folder, run `mvn spring-boot:run` to compile and run the
sample application. The first time you do this, it might download lots of files.

This runs a web server on port 8000.

## Explore the application

The `pom.xml` file tells maven that this is a spring boot project, and what the project is called (`softwaretools.server01`).

Under `src/main/resources` you find two files. First, `application.properties` which is a spring file configured to run on port 8000 (the default would otherwise be 8080). Secondly, a HTML file that the application can serve.

Under `src/main/java` is the source code. This is only two files, but of course the whole spring framework is active when the application runs. `Server01Application` is the main class, but this just contains boilerplate code for now.

`Controller.java` is the interesting one: in application development, _Model - View - Controller_ is one of several patterns to structure an application, where a _Controller_ is a piece of code that does the heavy lifting part, for example replying to a HTTP request.

Spring works with annotations, special classes whose name begins with an `@` sign. When the server starts, spring scans all files for annotations and sets up code to deal with them. Here we can see:

  - `@SpringBootApplication` (on the `Server01Application` class) tells spring that this is the main file to run.
  - `@RestController` tells spring that this class contains methods to deal with HTTP requests. It is so named because spring has libraries to make implementing the REST principles particularly easy.
  - `@AutoWired` on a field tells spring that this field is spring's responsibility to set up when the application starts. The `ResourceLoader` is part of spring and lets you access files in `src/main/resources`.
  - `@GetMapping(PATH)` tells spring that this method should be called to reply to a HTTP GET request for the provided path (there is of course also a `@PostMapping` and so on).

The `mainPage` method, which is called when you load `localhost:8000`, shows the basic way to reply to a HTTP request: set up any headers you need - in this case the content type - and return a `ResponseEntity` taking three parameters: the HTTP body of the response to return (this will be shown in your browser), the HTTP headers to set, and the response code which is 200 (OK) here.

The `htmlPage` method replies to requests for `localhost:8000/html`. Here we want to serve a file, so we use the resource loader to get it from the classpath which includes the `src/main/resources` folder (or rather, the version of it that ends up in the compiled JAR file). It also shows a second way to create a `ResponseEntity` using the _builder_ pattern.

## Exercises

  - Compile and run the application, and test both `localhost:8000` an `localhost:8000/html` in your browser. Observe both the headers in the developer tools, and the log messages that spring prints out for each request.
  - Add a method that replies to requests for `localhost:8000/bad` with a HTTP `404 NOT FOUND` error. The body of the page can be a simple string with a message of your choice. Stop and restart the application, and check that you get the correct error message when you try and open this page.

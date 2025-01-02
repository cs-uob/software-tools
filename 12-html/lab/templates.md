# Templating

The bread and butter of many developer jobs is building web applications that let people interact with data in a database. In a university for example, such an application might let students see the units they are enrolled in, their teaching and exam timetables, and their grades. Academics would be able to add new grades, and staff in the timetabling office would be able to create and edit timetables.

In such an application, pages need to be somewhat dynamic: the "student profile" page will show data for the particular student that you are looking at. Rather than generating these HTML pages "manually", for example by pasting strings together, it is much cleaner and usually more efficient to use a templating library. You could define one "student profile page" template, and then when a student requests their profile page, the server uses the template to create the page with this student's data. Creating a particular page from a template and some data is called _rendering_ the page.

This workshop's example application is `server02` in this lab's portion of the unit git repository. You build it with `mvn spring-boot:run` like the previous one, then access `localhost:8000`.

The application is a very minimal university database with students, units and grades. The `Database` interface in the `model` folder, together with the Student and Unit classes, form the data model - you can search for all students or all units in the database. In a real database of course, you would be able to search for an individual student by ID as well. 

The file `Templates.java` sets up the [thymeleaf](https://www.thymeleaf.org/) template engine. The `@Component` annotation tells spring to manage this class; other classes that need templates can request it by declaring a field of the right class with `@Autowired`, as you can see in `Controller.java`.

The main page is served up as before as a HTML file from the classpath in `src/main/resources/web`.

Have a look at the process when `/units` is requested. 
  - First, the method `unitsPage` accesses the database and loads the list of units.
  - Next, it creates a `Context`, a thymeleaf object that lets you pass values to a template. Here we add one value with key `units`, containing the list of units.
  - Finally, we render the template with the context and return this. If a method in a spring controller returns a string, then the string is assumed to contain a HTML page and spring correctly sets the HTTP status code and headers.

The template itself is in `src/main/resources/units.html`. Anything with a `th:` prefix is rendered by thymeleaf:

```html
<ul th:each="unit : ${units}">
    <li>
        <a th:href="'/unit/' + ${unit.code}" th:text="${unit.code}"></a>
        <span th:text="${unit.title}"></span>
    </li>
</ul>
```

The `th:each` attribute is the equivalent of a for loop in Java, in this case `for (Unit unit : units)` - in thymeleaf, unlike plain Java, you do not need to give the loop variable a type but you do need to use the `${...}` syntax whenever you are accessing a variable from the context. The `th:each` attribute renders its own tag once (in this case `<ul>`) and then renders everything inside the tag once per pass through the loop, so you get one `<li>` item per unit.

To create an attribute, you put `th:` in front of the attribute name, so the `th:href` creates the `href` attribute of a link (check the result in your browser). Thymeleaf attribute syntax is that you need to put single quotes around strings, `+` like in Java to stick strings together, and `${...}` around variables. 

The syntax `${instance.attribute}` loads an attribute from an instance of a Java class by calling its getter. In this case `${unit.code}` ends up calling `.getCode()` on the unit instance rather than accessing the field directly.

The `th:text` attribute is special and creates the body of a tag. For example, the span tag here creates a `<span>` whose body (between the opening and closing tags) contains the unit's title. Thymeleaf, unlike some other templating systems, doesn't let you include variables everywhere - some template engines let you just write `${variable}` anywhere in the HTML page, but thymeleaf only lets you do that in an attribute of a tag so if you simply want some text, you need to make a placeholder tag (`span` is a good choice here) and put the variable in its `th:text` attribute.

If you click on a unit, you get to the details page for that unit (that currently doesn't have any more detail than the code and title). When you send a HTTP request for `/unit/UNITCODE`, for example `/unit/COMS10012`, this is handled by the `unitDetailPage` method. 

Note that the `@GetMapping` contains a pattern `/unit/{code}` with a parameter to match all URLs of this form, and the parameter is passed to the method as a parameter that is annotated with `@PathVariable` to tell spring how to deal with it, namely to fill its value from the path of the HTTP request.

The method first finds the unit in the database and returns a 404 error page if there is no unit with that code. (In a real database, there would be a "find unit by code" method, you would not have to load all units just to find one of them.)

After this, we call thymeleaf on the `unit.html` template (this is the one without 's' in its name) to render the unit page.

## Exercises

**Basic exercise:** Rewrite the units list page to show the units in a table instead of a list. The table should have one row per unit and three columns: the first column should be the unit code, the second should be the unit title, and the third column should contain a link with text "details" that takes you to the details page for the unit. Also make a header row in the table with headings 'code', 'title' and 'link'. (This is purely a HTML and templating exercise, you do not need to change any Java code for this.)

**Intermediate exercise:** Implement controller methods and templates for listing all students and viewing an individual student's details, analogous to the ones for units (you can choose whether you make a list or a table for the students - there are currently only two). You only need to show a student's id and name for now, not the grades. Note that the id is an integer, not a string. You can copy-paste the Unit controller code and templates and make the necessary changes to show students instead, but make sure you understand what the bits do that you're changing. The student class is in the `src/main/java/softwaretools/server02/model` folder.

**Intermediate exercise:** The student class contains a method `getGrades()` that returns a list of pairs (unit, grade). The unit is a unit object, and the grade is an integer. On your student details page, make a table listing the titles and codes of all the units the student has taken, and the grades they got. 

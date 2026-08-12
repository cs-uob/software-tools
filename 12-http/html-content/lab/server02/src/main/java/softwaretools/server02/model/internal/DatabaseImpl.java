package softwaretools.server02.model.internal;

import java.util.ArrayList;
import java.util.List;
import softwaretools.server02.model.Database;
import softwaretools.server02.model.Student;
import softwaretools.server02.model.Unit;

public class DatabaseImpl implements Database {
    /* 
       This pattern will not win any contests for good OOP style, but it
       works for making a singleton for this example.
    */
    private static final List<Student> students;
    private static final List<Unit> units;
    static {
        students = new ArrayList<>();
        Student s = new Student(2021001, "Steven");
        Student c = new Student(2021002, "Connie");
        students.add(s);
        students.add(c);
        
        units = new ArrayList<>();
        Unit mathsA = new Unit("COMS10014", "Mathematics A");
        Unit mathsB = new Unit("COMS10013", "Mathematics B");
        Unit awesome = new Unit("COMS10012", "Software Tools");
        Unit impFunc = new Unit("COMS10016", "Imperative and Functional Programming");
        Unit compArch = new Unit("COMS10015", "Computer Architecture");
        Unit oopAlg = new Unit("COMS10017", "Object-Oriented Programming and Algorithms 1");
        units.add(mathsA);
        units.add(mathsB);
        units.add(awesome);
        units.add(impFunc);
        units.add(compArch);
        units.add(oopAlg);
        
        s.addGrade(mathsA, 55);
        s.addGrade(mathsB, 58);
        s.addGrade(awesome, 60);
        s.addGrade(impFunc, 45);
        s.addGrade(compArch, 52);
        s.addGrade(oopAlg, 58);
        
        c.addGrade(mathsA, 75);
        c.addGrade(mathsB, 83);
        c.addGrade(awesome, 90);
        c.addGrade(impFunc, 72);
        c.addGrade(compArch, 70);
        c.addGrade(oopAlg, 85);       
    }
    
    @Override
    public List<Student> getStudents() {
        return students;
    }
    
    @Override
    public List<Unit> getUnits() {
        return units;
    }
}

package softwaretools.server02.model;

import java.util.List;

public interface Database {
    List<Student> getStudents();
    List<Unit> getUnits();
}

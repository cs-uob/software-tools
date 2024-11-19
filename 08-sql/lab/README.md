
# Reading an ER diagram

Here is an ER diagram for a fictional university database:

![ER diagram](./uni-diagram.png)

The foreign key columns are not included in the tables - in this diagram, they are implied by the relationships, e.g. the `Unit.director` column comes from the "directs" relationship.

Looking at the diagram and the table schemas, answer the following questions for yourself:

  * Which relationships are mandatory or optional? (For example, must every unit have at least one student enrolled?)
  * Which relationships are one-one, one-many or many-many?
  * How do the above affect the placement of foreign keys? For example, why is the foreign key for "lecturer belongs to research group" on the Lecturer table?

# Drawing an ER diagram

Draw an ER diagram for the following scenario.

> The University of Bristol Hoverboard Society (HovSoc) wants to create a database to manage its membership and events. Each member has a name, an optional student number, a contact e-mail address and a hoverboard riding skill level (represented as an integer, minimum 0). We assume that e-mail addresses are unique among members.
> 
> The committee consists of some of the members, each of which has a unique committee role. We assume that committee roles do not change during the year and that each committee role must be filled every year.
>  
> An event has a date, a name, a location, an optional description and an organiser who must be a society member (not necessarily a committee member). An event is attended by a set of members. There is never more than one event at the same location on the same date but event names are not unique.

You can draw the diagram with pen and paper or you can use a free modelling tool like [draw.io](https://draw.io). 

  * For draw.io, open the "Entity Relation" section in the menu on the left and use the "Table" (first item) object for tables. Clicking on it adds a table to your diagram.
  * To add a row to a table, select an existing row and press Control-D (duplicate item). To delete a row, press the delete key.
  * To add a relationship, select a table by clicking its header and drag one of the blue triangles that appear round the edges onto another table. You can change the type of a relationship in the details panel on the right (the "line start" and "line end" boxes).
  * File/Save as lets you download your diagram in an XML-based format, which you can open and edit later. File/Export as lets you download it as an image.



# Implementing a Schema

Write a CREATE/DROP script for the schema that you have just designed, we'll cover CREATE TABLE in more detail in next weeks lecture, but for now [you can find a description of the syntax here](https://www.sqlite.org/lang_createtable.html).

  * A create/drop script starts with a sequence of DROP TABLE IF EXISTS statements followed by a sequence of CREATE TABLE scripts. The effect of running it is to make sure all tables exist and are empty, whether or not the tables existed before.
  * If table A has a foreign key to table B then you must create table B before A and drop table A before dropping B. The simple way to do this is work out the CREATE order, then put all DROP statements in the exact opposite order.

Save your script as a file (the extension `.sql` is usual for SQL scripts).

To test that it works, run it in SQLite3
```
sqlite3 <myscript.sql
```

# More modelling

Using what you have learnt so far about relational modelling, think about and discuss in groups how you would model a university database to store student's academic progress, such as units enrolled on and completed, marks obtained etc. based on your understanding of how the University of Bristol works. For example, a unit can have different assessments with different weights. You will of course also need a `Students` table, and you can make the model more involved if you like by including that different students are on different degree programmes, and that sometimes students have to resit units.

You should end up with a more detailed version of the model briefly shown at the top of the previous page - if you have the time you can make both an ER diagram and a create/drop script.

This is also a good point to mention another fact of how marks and credit points work: exam boards. At the end of each academic year around May, your unit directors all report their marks for each student to an exam board, which sits and decides on final marks and awarding credit. For example, an exam board can moderate the marks for a unit. This is why you do not get your exam marks until a long time after the exam has happened, even if it's a multiple choice exam that can be marked automatically: the marks still have to go through an exam board. (There is another, smaller exam board around the start of Teaching Block 2 so you don't have to wait until summer for your January exam marks to be released.)
If you want to model this in your schema, the idea here is that a student has two marks associated with each unit: the "actual mark" (the input to the exam board) and the "agreed mark" (the one that comes out of the board and goes on your transcript). Of course, for most students most of the time, the two are the same. Your schema will need to store "agreed marks" explicitly, but there are ways of doing the model that does not store the "actual mark" directly. Think about how you could recompute it from other information in the database - we will of course learn how to do this in SQL in a later activity.

The key idea in relational modelling is not to store information more than once if you can avoid it. If you have stored in several places that Fred is taking Introduction to Programming, and then Fred switches his units, you don't want to end up with a situation where this change is only reflected in some parts of the database.
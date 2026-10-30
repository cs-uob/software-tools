# Software Tools
(COMS10012 / COMSM0085)

## Week 10: Databases, beyond SQL
(or, "When is a riddle a database?")
  - Notes on using SQL from code.
  - Cursing recursive data structures.
  - Datalog fundamentals
  - Learning things with FACTS and RULES.
  - Exam questions

---

## But first...

Things you still don't understand..?

This is your last lecture before the TB1 exam!


---
## Using SQL from your program

You would not usually write a meaningful program in SQL itself.
  - SQL is not Turing-complete (though there are extensions) and struggles with recursion.
  - SQL is a _domain-specific_ language designed just for querying databases.
  - You don't hate yourself enough. 
  - Your friends won't let you do this to yourself.

Most programming languages you _would_ write an application in have libraries
that act as interfaces between your code and a database engine.

Exactly how this works varies by programming language and database engine. To
access SQLite from Python, you would `import sqlite3`, while to access it from Java
you would access generic database interfaces with `import java.sql.*` and then
specify the connection type `DriverManager.getConnection("jdbc:sqlite:<database>");` 
-- look up the appropriate library documentation for whichever combination of language 
and DB you are using.

Most of the best languages for this kind of work you aren't familiar with yet,
so let's look at an example in C.

---

## Appointment checker (v1)


---
## SQL Injection


---
## Appointment checker (v2)

---
## SQL and recursion


---
## Recursive data structures


---
## Datalog

---
## Learning about relationships


---
## Recursive relationships


---
## Learning about... access control?


---
## The TB1 exam

---
## The End

We'll see you in the labs on Friday.

(And the following Thursday).

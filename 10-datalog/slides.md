# Software Tools
(COMS10012 / COMSM0085)

## Week 10: Databases, beyond SQL
(or, "When is a puzzle a database?")
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

We can create a basic tool that acts as an interface to our `patients.db`
database using `sqlite3_open` and `sqlite3_exec`.

All the program is really doing is getting the user to supply an ID:

```c
	char appointmentID[7];
```

And then it creates a string in the form of a `SELECT`

```c
  sprintf(sql, "SELECT * FROM Appointment WHERE AppointmentID = %s;", appointmentID);
```

This works well enough so long as users only do what we expect.

But what happens when I claim my AppointmentID is `1 OR 1=1`?

(How does `WHERE` work again?)

---
## SQL Injection

A classic vulnerability for many user-facing applications (particularly web applications).

Unsanitised user input being included directly in SQL queries means any attacker
who understands SQL well enough can access or even modify your database without
restriction.

[Obligatory XKCD reference](https://xkcd.com/327/)

This is consistently one of the OWASP Top Ten security vulnerabilities.

Estimates ranging from **10% to 33%** of all web application vulnerabilities are
linked to SQL injection.

The solution is simple: use **prepared statements**. These involve careful preprocessing
steps (supported in all sane DB libraries) that mean that input values included 
in queries cannot be misinterpreted as SQL clauses.

---
## Appointment checker (v2)

```c
	sqlite3_stmt *stmt;

    //Use a prepared statement with '?' for input locations
    char *sql = "SELECT * FROM Appointment WHERE AppointmentID = ?";

    //Have the 'prepare' function prepare our statement 
    retval = sqlite3_prepare_v2(db, sql, -1, &stmt, 0);
    
    if (retval == SQLITE_OK){
        //Bind our user input to the parameter placement (1)
        //in the prepared SQL query.
        sqlite3_bind_text(stmt, 1, appointmentID, strlen(appointmentID), SQLITE_STATIC);
    }
```

By having `prepare` and `bind` carefully make clear that user input should not
be treated as part of our SQL, we assure that user input of `1 OR 1=1` is parsed
properly:

```sql
SELECT * FROM Appointment WHERE AppointmentID = 1 OR 1=1;
SELECT * FROM Appointment WHERE AppointmentID = '1 OR 1=1';
```

Always look for the DB interface library's prepared statement functionality when
handling user input.

(Do note: there are several other problems with this example code).

---
## SQL and recursion

I have a database of managerial relationships.

```bash
sqlite3 bosses.db
```

```sql
SELECT manager.manager FROM manager WHERE manager.employee = 'Matthew Edwards';
```

Can I find out who my manager's manager is, in one query? Sure:


```sql
SELECT a.manager, b.manager AS managermanager 
FROM manager a JOIN manager b ON a.manager = b.employee 
WHERE a.employee = 'Matthew Edwards';
```

This is a `SELF JOIN` -- perfectly sensible in some situtations. Note we have to
name `a` and `b` to be clear which side of the join we are talking about.

But can I find **all** of my managers?

---

## SQL and recursion

Not really. I **can** keep on JOINing...

```sql
SELECT  a.manager, 
        b.manager AS manager2,
        c.manager AS manager3
FROM manager a 
  JOIN manager b ON a.manager = b.employee 
  JOIN manager c on b.manager = c.employee
WHERE a.employee = 'Matthew Edwards';
```

But this is awkward -- I need to know how deep I have to go in advance and I
can't just have the query climb all the way up the heirarchy.

What if there are 5 more layers? What if there are 24?


---
## Recursive data structures

You know (I hope, from your programming lessons) that certain recursive data structures 
(like trees and graphs) can be efficient data representations for lots of problems.

- organisational hierarchies
- file storage
- process relationships

While you **can** implement storage of these structures in relational databases,
they can be difficult to query effectively.

This is frustrating, because what we want in our management example is
conceptually quite simple: a list of `Y` for a given person `X`, where either:
 - `X` directly reports to `Y`, or 
 - `Y` manages whoever `X` directly reports to:

You could formalise this a little like:

```prolog
manages(Y, X) :- directreport(Y,X).
manages(Y, X) :- directreport(Z,X), manages(Y, Z).
```



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

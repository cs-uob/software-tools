# Software Tools
(COMS10012 / COMSM0085)

## Week 8: Creating Relational Databases (in SQL)
(or, "When CREATE TABLE is like building a bridge")
 - Why data storage decisions matter.
 - Entities and entity relationships.
 - Keys and functional dependencies.
 - Normal forms.
 - A Structured Query Language.
 - CREATE TABLE and INSERT INTO.

---

## But first...

Questions about debugging?


---

## Why data storage decisions matter

As computer scientists, many of you will in the future be responsible for the design and deployment of information systems. 

Professional engineers are also held responsible for the safety of the structures they build.

> I, `___`, in the presence of these my mentors and my peers in my CALLING, pledge on my HONOUR and COLD IRON, that to the best of my knowledge and power, I will not tolerate or pass, or participate in the passing of, BAD WORKMANSHIP or FAULTY MATERIAL in all that concerns my works as an ENGINEER, or in my dealings with my own conscience, before the WORLD.

(from the Obligation spoken at the Calling of the Engineer)

The ceremony of the Calling was created in response to the Quebec Bridge Disaster -- 75 people died because of poor engineering.

How many people have died because of bad information systems design?

---

## Just store data in Excel?

The 'world-beating track and trace system' the UK used during the COVID19
pandemic took this approach. Using the old `.xls` spreadsheet format. 

The `.xls` spreadsheet format has a limit of 65,536 rows (~0.1% of the UK
population). Cases beyond this were simply dropped. 

(This software cost the public £35m).

15,841 referrals were known to be missed. An estimated 125,000 - 185,000 additional
infections took place as a result, leading to an estimated additional 1,500 -
2,500 deaths.

> I will not tolerate or pass, or participate in the passing of, BAD WORKMANSHIP or FAULTY MATERIAL in all that concerns my works as an ENGINEER

---

## Okay, but I'm just handling data for a-

Human genome datasets use codes like 'SEPT2' and 'MARCH1' for genes ('Septin 2',
'Membrane-Associated Ring Finger (C3HC4) 1').

This is a perfectly sensible method of abbreviation... unless you're storing
your data in Excel. Excel has a handy 'date conversion' feature that takes dates
entered in different formats and standardises them.  

So 'SEPT2' becomes '2-September', or '2006/09/02'.  

Excel also handily converts funny strings like '2310009E13' into floating-point
numbers (you obviously meant '2.31E+13', right?).

A 2016 study found that about 1 in 5 genome datasets contain these errors. The
rate of these errors was increasing over time.

It is quite hard to estimate how many lives may have been lost as a result.

---

## Okay, no Excel, I'll just-

Building your own data storage system from first principles is a bad idea on the
same level as 'creating your own cryptographic library'.

There are large textbooks about the different ways this can go wrong.

There are _appropriate tools_ for storing, managing and accessing data:
**databases**.

If you need multiple applications (/people/processes) to be able to read/write
data then _you need to use a database engine_ that provides ACID
transactions (e.g., MySQL, MariaDB).

ACID: An update to the database must be:
 - **atomic**: it either is completed or it hasn't happened at all.
 - **consistent**: all constraints in the database design are respected.  
 - **isolated**: the update doesn't affect other updates.
 - **durable**: it must be written to persistent storage.

Even if you don't need the concurrency guarantees provided by a full database
engine, you may still want to use a database system that supports _relational_
database design (e.g., DuckDB, SQLite). 

---

## Relational Databases

In most cases, you want to want to store information about particular
**entities** (e.g, users, students, buildings, events).

There are many individual instances of each type of entity (e.g., user1012 is
one of your users, 'Bloggs, Joe' is a specific student, 'MVB' is a specific
building). We want to store **records** of these instances.

There are also several different **attributes** that any entity can have (a
student has a name, a number, a fee status; a building has a name, an address, a
capacity).

In a relational database, **entities** are represented by tables.  
 - Tables represent the **attributes** of entities as columns.
 - Every row in the table represents a **record** of this type of entity.

'Building' table: 

| Name | Address     | Capacity | 
|------|-------------|----------|
| MVB  | Woodland Rd |  400     |
| SRB  | Temple Quar-|  600     |
| QB   | Woodland Rd | 1000     |



---

## How is this 'relational'?

Entities also have **relationships**. Students _study in_ buildings. Students
also _attend_ events. These are interactions between our 'student' entities and
our 'building' and 'event' entities. 

'Relational' databases allow for entities to have attributes that express these
relationships to other entities.

Or: tables have columns that refer to other tables.

How?

Specifically: _how do we refer to a specific row in a table?_

(Why would using, e.g., 'the fourth row in the events table' be a bad solution?)

---

## Keys

We can use some combination of the **attributes** in a table to uniquely identify a row. 
This combination of attributes is called a 'key'.

'Key' terminology:
  - a **candidate key** is a minimal set of attributes that would uniquely identify records (/rows). They are 'candidates' because they are possible keys, but you will select an appropriate key from the candidates.
  - a **composite key** is just a term for a key that is made up of > 1 attribute.
  - a **surrogate key** is when you create an attribute like 'Transaction ID' that only exists to make a key.
  - a **primary key** is the key you are actually using for a table.

Importantly, when it comes to relations:
  - a **foreign key** is a primary key from one table being used as a reference in another table.

For example: `DegreeID` might be the (surrogate) **primary key** in the Degree
table. When we add a `studies` relationship between the Student and Degree
tables, we add an attribute to Student that _references_ the Degree table using
that primary key. 

---

## A Foreign Key Example

Our 'Degree' table:

| DegreeID | Name             | School | Duration |
|----------|------------------|--------|----------|
| 1001     | Computer Science | COMS   | 3 years  |
| 1002     | Mathemathics     | MATH   | 4 years  |
| 1003     | Engineering      | ENG    | 3 years  |


Our 'Student' table:

| StudentNo | Name            | Fee Status | Studies | 
|-----------|-----------------|------------|---------|
| 345212    | Bloggs, Joe     | Paid       | 1002    |
| 341215    | Doe, Jane       | Paid       | 1001    |
| 134214    | Doe, John       | Arrears    | 1002    |


Here, `studies` is a **foreign key** in Student, referencing the Degree table by
using the **primary key** from that table (which is `DegreeID`). 

---

## Relational database design

So far, you should understand:
  - I will represent entities as tables, with attributes (columns).
  - To uniquely identify records in tables, I will use a **primary key**, selected from the possible **candidate keys**.
  - I can represent relationships between entities by using keys as references.


Next step: **normalisation** of your database.

A relational database can be said adhere to certain **normal forms**. Higher
normal forms indicate that a database has certain desirable properties. 

This often has practical payout: better-normalised databases can be easier to
maintain, because normalisation _removes redundancies_ and organises information
in a manner that makes querying the database easier or more efficient¹.

¹ Usually -- there can be costs to over-normalisation.

---

## Normal Forms

There are normal forms ranging from 0NF or UNF (un-normalized) to 6NF (most
normalised).

0NF > 1NF > 2NF > 3NF > BCNF > 4NF > 5NF > 6NF

In practice, the problems solved by 4NF and higher rarely occur and these
definitions are mostly of academic interest. Using 4NF+ might risk
over-normalisation. We will only cover 0NF to BCNF.

- **0NF** is straightforward: any relational database without duplicate records is presumed to be 0NF.
- **1NF**: ONF + every attribute in your tables is **atomic** -- no nested lists.
- **2NF**: 1NF + there are no _partial functional dependencies_ of non-key attributes on candidate keys.
- **3NF**: 2NF + there are no _transitive functional dependencies_ of non-key attributes on candidate keys.
- **BCNF**: 3NF + there are no _functional dependences_ other than on candidate keys.

---

## Functional dependencies

To understand normal forms, it is useful to first understand 'functional
dependencies'.

Simply: for X and Y, we say X _functionally determines_ Y if and only
if for every value of X there can be at most one value of Y. 

For example, StudentID and Grade: many students may have the same grade, but for
every student ID there should only one grade. 

table 'SoftwareToolsResults':

| StudentID | Grade |
|-----------|-------|
| 32032043  | 50    |
| 21415591  | 55    |
| 13121981  | 50    |

This doesn't just happen to be the case in the database, it is a feature of the process generating the data.

---

## More functional dependencies

A **partial** functional dependency arises when an attribute in your table
depends only on _part_ of your key. (This is only possible when you create a
composite key). 

'UnitResults'

|*StudentID | *Unit     | Hairstyle | Grade | HairStyleRating   |
|-----------|-----------|-----------|-------|-------------------|
| 32032043  | COMS10012 | BowlCut   | 50    |  Poor             |
| 21415591  | COMS10014 | Snazzy    | 55    |  Good             |
| 32032043  | COMS10014 | BowlCut   | 60    |  Poor             |
| 13121981  | COMS10012 | Wavy      | 50    |  Average          |


A **transitive** functional dependency arises when there is a chain of
dependencies in your data attributes, so that Z functionally depends on X, but
_only because_ Z depends upon Y, and Y depends on X.

(We will look at more examples in a moment). 

---

## Normal Forms Examples: 0NF->1NF

The 'Event' table below is in 0NF

|*Location |*Time  | Organiser | OrganiserEmail | Attendees     | SafetyOfficer |  Name      | 
|----------|-------|-----------|----------------|---------------|---------------|------------|
| Queens 1 | 12:00 | Jim B     | jimb@aol.com   | jay; rob; mary| Rob Money     | PizzaParty |
| Fulham 4 | 15:00 | Harry     | harry@aol.com  | harry; rob    | George Foreman| ChillOut   |
| Queens 1 | 15:00 | Jay Ring  | jr@gmail.com   | jay; rob; ben | Rob Money     | StudySesh  |

This is not in 1NF because the `Attendees` attribute is not atomic, it is a list.

You would make this 1NF by moving attendance tracking to a new table:

'EventAttendances' with foreign key ('EventLoc','EventTime') referencing the Event table.

| Attendee | EventLoc | EventTime |
|----------|----------|-----------|
|  jay     | Queens 1 | 12:00     |
|  jay     | Queens 1 | 15:00     |
|  rob     | Fulham 4 | 15:00     |
...

Now if you need to find which events 'jay' attended, you can do a simple lookup instead of having to text-search the attendees lists.

---

## Normal Forms Examples: 1NF->2NF

The table below is in 1NF 

|*Location |*Time  | Organiser | OrganiserEmail | SafetyOfficer |  Name      | 
|----------|-------|-----------|----------------|---------------|------------|
| Queens 1 | 12:00 | Jim B     | jimb@aol.com   | Rob Money     | PizzaParty |
| Fulham 4 | 15:00 | Harry     | harry@aol.com  | George Foreman| ChillOut   |
| Queens 1 | 15:00 | Jay Ring  | jr@gmail.com   | Rob Money     | StudySesh  |

It is not in 2NF because the `SafetyOfficer` attribute has a *partial functional dependency* on `Location` (for the sake of argument: there is one Safety Officer for every location, no matter the time).

You would make this 2NF by again extracting `SafetyOfficer` and creating another table that maps `Location` and `SafetyOfficer` without reference to events.

|*Location | SafetyOfficer |
|----------|---------------|
| Queens 1 | Rob Money     |
| Fulham 4 | George Foreman|

Now we have removed the redundancy in the Event table: we don't keep repeating Rob Money's name.

---
## Normal Forms Examples: 2NF->3NF

The table below is in 2NF 

|*Location |*Time  | Organiser | OrganiserEmail |  Name      | 
|----------|-------|-----------|----------------|------------|
| Queens 1 | 12:00 | Jim B     | jimb@aol.com   | PizzaParty |
| Fulham 4 | 15:00 | Harry     | harry@aol.com  | ChillOut   |
| Queens 1 | 15:00 | Jay Ring  | jr@gmail.com   | StudySesh  |

It is not in 3NF because `Organiser` depends on `OrganiserEmail`, creating a *transitive functional dependency*. (We might imagine many organisers called Harry, but only one with that email address -- and the organiser's details depend on who they are, not the event they are organising). 

You would make this 3NF by moving additional organiser details to another table, and keeping the identifying `OrganiserEmail` in Event but making it a **foreign key** referencing your new table.

|*OrganiserEmail | Name    |
|----------------|---------|
| jimb@aol.com   | Jim B   |
| harry@aol.com  | Harry   |
| jr@gmail.com   | Jay Ring|

---

## Normal Forms Examples: 3NF

The table below is in 3NF 

|*Location |*Time  | OrganiserEmail |  Name      | 
|----------|-------|----------------|------------|
| Queens 1 | 12:00 | jimb@aol.com   | PizzaParty |
| Fulham 4 | 15:00 | harry@aol.com  | ChillOut   |
| Queens 1 | 15:00 | jr@gmail.com   | StudySesh  |

It is *also* in BCNF (3.5NF), because there are no functional dependencies other than on the only candidate key.

(It is quite hard to construct examples in 3NF but not in BCNF that also make sense for the other NFs)

---

## Boyce-Codd Normal Form (3.5NF)

The aim of meeting 2NF and 3NF was to remove redundancies (because they are wasteful and complicate updating your database tables).

The original supposition was that if you remove both _partial_ and _transitive_ dependencies in the manner described above, you should have removed all functional dependencies that might be creating redundancy.

However, this is not always the case!

The definitions rely on relationships with candidate keys. In a situation where you have multiple **candidate keys** that you could potentially use as a primary key, and those keys are also **composite**, even when you remove the issues identified in 2NF and 3NF, a sneaky edge case can arise: some attributes in your different candidate keys might depend on each other. 

The output would look like a *partial functional dependency* but is not caught by earlier checks that only look at the relationship of 'non-key' attributes to 'key' attributes. 

A table is in BCNF if *each attribute* depends on *the whole key and only the whole key*.

---

## So normalisation is about reducing the number of columns and creating more tables instead?

Not exactly: the aim is to remove implicit redundancies that complicate updates to your tables.

However, in practice, this is how it is often accomplished.

In pencil outline:
 - **4NF** requires non-trivial 'multi-valued' dependencies to exist only on keys.
 - **5NF** requires that you cannot decompose the table into other tables that can be trivially joined to recreate it.
 - **6NF** requires that every table contains one key and at most one other attribute.

(You won't need these until you have _a lot_ more practical experience with databases, and possibly never).

---
## From Theory to Practice

This week, you will be practicing designing relational databases in two ways.

1. By diagramming entities and their relationships.
2. By creating tables in SQLite, and adding records.

SQLite (like most relational databases) uses a language known as SQL (Structured
Query Language).

This week is all about _creating_ databases. Effectively querying those
databases to _extract_ information is a focus for next week.

---

## Starting SQLite

From the commandline, to start creating a database `test.db`.

```bash 
sqlite3 test.db
```

For this week there are two SQL commands of interest: 
  1. [CREATE TABLE](https://www.sqlite.org/lang_createtable.html)
  2. [INSERT](https://www.sqlite.org/lang_insert.html)

The full syntax guide covers many edge-cases. For a simple start:

```sql
sqlite> CREATE TABLE degree (degreeID INTEGER UNIQUE PRIMARY KEY,
                             name TEXT, 
                             school TEXT, 
                             durationYears INTEGER);
```

You can see it exists in the output of the SQLite command `.tables`

Note convention: capitalise SQL keywords.

Can add constraint `PRIMARY KEY(a, b)` at the end of list of columns to use
attributes `a` and `b` as a **composite key**. 

---
## Making Relations

To insert _references_ to make certain attributes foreign keys for other tables,
you need to specify this at the time of table creation.

This implies (without using some advanced features) that you need to create the
table that will be referenced _first_, before you create the one that does the
referencing.

```sql
sqlite> CREATE TABLE student (studentNO INTEGER UNIQUE PRIMARY KEY,
                              name TEXT,
                              feeStatus TEXT,
                              studies INTEGER,
                              FOREIGN KEY(studies) REFERENCES degree(degreeID));
```

To make sure that foreign key constraints are respected (i.e., you can't insert
values of `studies` that reference a non-existent value for `degreeID`) you
first need to set a parameter.

```sql
sqlite> PRAGMA foreign_keys = ON;
```

---

## More Simple SQLite

To introduce actual records into your tables, you will use INSERT.

```sql
sqlite> INSERT INTO degree VALUES (1001, 'Computer Science', 'COMS', 3);
sqlite> INSERT INTO degree VALUES (1002, 'Mathematics', 'MATH', 4);
```

For INSERTing multiple records at once there is a shorthand:

```sql
sqlite> INSERT INTO degree VALUES (1001, 'Computer Science', 'COMS', 3),
                                  (1002, 'Mathematics', 'MATH', 4),
                                  (1003, 'Engineering', 'ENG', 3);
```

Question: why would the second example fail if I ran all of these?

Use `SELECT * FROM degree;` to look at your complete table -- we'll revisit
SELECT statements in more detail next week.

---

## The End

We'll see you in the labs on Friday.

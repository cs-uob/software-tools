# Software Tools
(COMS10012 / COMSM0085)

## Week 8: Creating Relational Databases (in SQL)
(or, )
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

Professional engineers are also held responsible for the safety of the the structures they build.

> I, `___`, in the presence of these my mentors and my peers in my CALLING, pledge on my HONOUR and COLD IRON, that to the best of my knowledge and power, I will not tolerate or pass, or participate in the passing of, BAD WORKMANSHIP or FAULTY MATERIAL in all that concerns my works as an ENGINEER, or in my dealings with my own conscience, before the WORLD.

(from the Obligation spoken at the Calling of the Engineer)

The ceremony of the Calling was created in response to the Quebec Bridge Disaster -- 75 people died because of poor engineering.

How many people have died because of bad information systems design?

---

## Just store data in Excel?

The 'world-beating track and trace system' the UK used during the COVID19 pandem
took this approach. Using the old `.xls` spreadsheet format. 

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

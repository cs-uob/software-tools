# Software Tools
(COMS10012 / COMSM0085)

## Week 9: Querying Databases with SQL
(or, "My CS degree led to me working as a joiner")
  - A little more table-making
  - Asking for things selectively 
  - Working with aggregates
  - Joining tables together
  - Sub-queries
  - Transactions and updates


---
## But first...

Questions about database design? 


---

## Recap: Simple CREATE TABLE

You've seen + had practice with table creation.

```sql
sqlite> CREATE TABLE degree (degreeID INTEGER UNIQUE PRIMARY KEY,
                             name TEXT, 
                             school TEXT, 
                             durationYears INTEGER);
```

But what are TEXT and INTEGER?

---

## Data 'Typing' in SQLite 

Remember, SQL is a language used across lots of different database engines (with
various quirks in each).

In almost every SQL database engine _except_ SQLite, column typing is strict,
and there are storage-efficient types like `BOOLEAN` for true/false or
`CHARACTER(10)` for strings of length 10. They usually have specific `DATE`
storage formats.

SQLite is more... relaxed. It accepts many of these keywords, but in practice
ignores or translates them. 

Columns do have an 'affinity' to one of `INTEGER`,`TEXT`,`BLOB` or`REAL` (also
`NUMERIC`: a mashup). Values can also be `NULL`.  The affinities mean that
values will automatically be converted to the preferred type.

```sql
CREATE TABLE t1(a INT, b VARCHAR(10)); 
INSERT INTO t1(a,b) VALUES('123',456);
```

But: `BOOLEAN` is stored as an `INTEGER`, all `CHAR` lengths are ignored (to
implement restrictions you need to use a constraint). 

---

## Reimplementing CHARACTER(10) for SQLite

```sql
sqlite> CREATE TABLE degree (degreeID INTEGER UNIQUE PRIMARY KEY,
                             name TEXT, 
                             shortname TEXT,
                             school TEXT, 
                             durationYears INTEGER
                             CHECK(length(shortname) <= 10));

sqlite> INSERT INTO degree VALUES (1002, 'Mathematics', 
                    'Mathematics for people who cannot count', 'MATH', 4);

Error near line 14: CHECK constraint failed: length(shortname) <= 10
```

You can also use CHECK statements to assert requirements involving multiple
attributes of a record. `CHECK(length(shortname) <= length(name))`.

Another useful constraint for columns: `NOT NULL`.

---

## SELECT statements 

The assigned reading this week is all about `SELECT` statements.

`SELECT` is the only syntax diagram that the SQLite3 documentation authors thought
was so complicated that they needed to make a simpler version.

We'll look at the most practical components using a real(ish) database (in the
repo).

```bash 
sqlite chinook.db
```

(Could also use an `ATTACH` command from inside SQLite).

---

## Being SELECTive

```sql
SELECT * FROM Customer;
```

Too much! We can specify that we only want particular result columns.

```sql
SELECT CustomerID, FirstName, LastName, Email FROM Customer;
```

Still too many records: we want to `LIMIT` how many are displayed.

```sql
SELECT CustomerID, FirstName, LastName, Email FROM Customer LIMIT 10;
```

This gives us a manageable number of rows, but what if we care about `ORDER`?

```sql
SELECT CustomerID, FirstName, LastName, Email FROM Customer ORDER BY FirstName LIMIT 10;
SELECT CustomerID, FirstName, LastName, Email FROM Customer ORDER BY FirstName DESC LIMIT 10;
```

(Note: `ORDER` before `LIMIT`).

---

## SELECTing records WHERE conditions hold

A `WHERE` expression applies a filter to the rows returned -- only records that
match the expression will be returned in the results.

```sql
SELECT CustomerId, PostalCode, City FROM Customer WHERE Country='France';

SELECT CustomerId, City, PostalCode FROM Customer WHERE Country='France' AND City='Paris';

SELECT CustomerId, City, PostalCode, Country FROM Customer WHERE Country='France' OR City='Toronto';
```

You can use wildcards to partially-match text with the `LIKE` expression.

```sql
SELECT CustomerId, City, Email FROM Customer WHERE Email LIKE '%yahoo%';
```

Standard numeric comparisons are also possible.

```sql
SELECT CustomerId, City, Email FROM Customer WHERE CustomerId < 20;
```

You can also use sets to select specific values.

```sql
SELECT CustomerId, City, PostalCode, Country FROM Customer WHERE Country IN ('France','Germany');
```

---

## Working in aggregate

A `SELECT` statement that either involves a `GROUP BY` instruction or uses an
_aggregate function_ in results selection is an **aggregate** query.

```sql
SELECT count(*) FROM Customer;
```

Main built-in aggregate functions: 
```sql
count(), avg(), sum(), min(), max()
```

Non-aggregate columns are an ill-defined single value from the set of records
being aggregated. Sometimes this is meaningless:

```sql
SELECT avg(CustomerId), Country FROM Customer;
```

However, when you use `GROUP BY`, the aggregate function is applied within _each group_.

```sql
SELECT count(Country), Country FROM Customer GROUP BY Country;
```

---

## Gathering more aggregates

`GROUP BY` is a powerful way to get insight into tabular data.

```sql
SELECT count(CustomerID), min(CustomerId), SupportRepId FROM Customer GROUP BY SupportRepId;

SELECT count(CustomerId) FROM Customer WHERE SupportRepId = 3;
```

You can quickly cross-tabulate:
```sql
SELECT count(CustomerId), Country, SupportRepId FROM Customer GROUP BY SupportRepId, Country;
```

NB: `NULL` values can play havoc with `GROUP BY`

```sql
SELECT count(Company), Company FROM Customer GROUP BY Company;

SELECT count(Company), Company FROM Customer WHERE Company IS NOT NULL GROUP BY Company;
```

Note: `GROUP BY` is applied to the results _after_ `WHERE`. We filter the
dataset according to `WHERE` and _then_ form the groups in `GROUP BY`.

If you want to filter the grouped results (e.g., count values), you use a
`HAVING` expression.


---

## HAVING fun

(When `SELECT` statements get long and complex, breaking onto multiple lines can
help you parse them.)

In some queries `HAVING` might as well have been a `WHERE`.

```sql
SELECT count(CustomerId) AS NoCustomers, Country, SupportRepId 
FROM Customer 
GROUP BY SupportRepId, Country 
HAVING Country = 'Germany'; 
```

But in other queries, it would not be possible to use a `WHERE`.

```sql
SELECT count(CustomerId) AS NoCustomers, Country, SupportRepId 
FROM Customer 
GROUP BY SupportRepId, Country 
HAVING NoCustomers > 2; 
```

('NoCustomers' doesn't exist until we `GROUP BY`).

---

## JOINing tables

So far we've only used `SELECT` queries where `FROM` has its simplest form: a
single table.

Database normalisation means information is spread across multiple tables. When
the information we want draws on multiple tables, our `SELECT` needs to draw
records `FROM` a _temporary combination_ of those tables. This is called a
**join**.  

```sql
SELECT Customer.FirstName, Customer.LastName, Employee.FirstName, Employee.LastName 
FROM Employee JOIN Customer ON Employee.EmployeeId = Customer.SupportRepId 
WHERE Customer.Country = 'Germany' AND Employee.ReportsTo = 2;
```

Note that the join happens _before_ filtering with `WHERE` or our selection of columns.

You can `JOIN` tables using foreign keys: here `Customer.SupportRepId` was a
foreign key pointing at `Employee.EmployeeId`, so this was a natural way to join.

```sql
SELECT Album.Title AS AlbumTitle, Artist.Name AS ArtistName
FROM Artist JOIN Album ON Artist.ArtistId = Album.ArtistId 
WHERE Artist.Name LIKE 'Al%' OR Album.Title LIKE 'Al%';
```


---

## Types of JOIN

The default `JOIN` is an `INNER JOIN`. You most often will want an inner join.

When joining tables `a` and `b` on `a.id = b.id`: 

| Join Type      |   Includes from a |   Includes from b | Good For          |
|----------------|-------------------|-------------------|-------------------|
| INNER JOIN     | only matches in b | only matches in a | only matches      | 
| LEFT JOIN      | all values        | only matches in a | all a, b optional |
| RIGHT JOIN     | only matches in b | all values        | all b, a optional |
| FULL JOIN      | all values        | all values        | either optional   |

`LEFT`, `RIGHT` and `FULL` are types of `OUTER` join (they all create `NULL`s).
Sometimes you will see this specified, e.g., `FULL OUTER JOIN` -- the meaning is
the same.

There is also a `CROSS JOIN` which accepts no ON condition and simply creates a
Cartesian product of the two tables.

Note the difference: `FULL JOIN` gets you all records in `a` or `b` at least
once, even when one doesn't have a match. `CROSS JOIN` pairs **every** record in 
`a` to **every** record in `b`, with no attempt to match.

---

## Sub-queries

The `JOIN` creates a temporary table for us to `SELECT` `FROM`, stitching
together real tables in the way we defined.

But what if we want to create some type of summary table, and then query that
table?

(One answer is we could `CREATE TEMPORARY TABLE AS SELECT`, to avoid storage)

The general solution is **sub-queries**: using the results of one `SELECT`
query as a temporary table we can query.

```sql
SELECT sum(Albums) AS Albums, 
       count(Name) AS Artists,
       round(avg(Albums),2) AS AlbumsPerArtist 
FROM (
  SELECT count(Album.Title) AS Albums, Artist.Name
  FROM Album RIGHT JOIN Artist ON Album.ArtistId = Artist.ArtistId
  GROUP BY Artist.Name
);
```

Here we further aggregated an aggregate query: necessary for answering tricky questions.

(Why `RIGHT JOIN` instead of `INNER JOIN`?)

---

## SELECTive memory

There are a lot of parts to `SELECT`. It's important to put things in the right
place. When solving problems using SQL, try considering in order:

1. `FROM`: What table am I selecting records from? Is it a temporary table
   I need to form with a `JOIN` or a sub-query?

2. `SELECT`: Which attributes (columns) do I want to see? If I am performing an
   _aggregate_ query, do I need to `GROUP BY` some attribute?

3. `WHERE`: Which records (rows) do I want to see? If this is an aggregate
   query, do I mean `HAVING`?

4. Do I want to `ORDER BY` an attribute, or `LIMIT` the records displayed?

Experiment in your SQLite shell to get rapid feedback, but write completed
commands down in a script so you can replicate them later.

---

## Enough SELECT

You've seen `CREATE TABLE` and `DROP TABLE`, `INSERT` and `SELECT`.

For database _maintenance_:
  - `ALTER TABLE` to rename table, remove columns, redefine columns.
  - `UPDATE` to alter records (identify which with `WHERE`); or
  - use special `ON CONFLICT` clause in `INSERT` to 'UPSERT'

```sql
CREATE TABLE vocabulary(word TEXT PRIMARY KEY, count INT DEFAULT 1);
INSERT INTO vocabulary(word) VALUES('jovial')
  ON CONFLICT(word) DO UPDATE SET count=count+1;
```

In concurrent application settings, to retain ACID consistency, you may need to
use **transactions**

```sql
BEGIN TRANSACTION
 ... some INSERTs/ UPDATEs, etc...
END TRANSACTION
```

Either **all** changes in the transaction complete successfully, or **none** do.


---
## The End

We'll see you in the labs on Friday.

# Software Tools
(COMS10012 / COMSM0085)

## Week 9: Querying Databases with SQL
(or, "Working with tables as a joiner")
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




---

## The End

We'll see you in the labs on Friday.

WITH RECURSIVE mymanagers(m)
 AS (SELECT manager FROM manager WHERE employee='Matthew Edwards'
	UNION
	SELECT manager FROM manager, mymanagers WHERE manager.employee=mymanagers.m)
 SELECT * FROM mymanagers;

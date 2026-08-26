USE college;

-- Students above age 20
SELECT *
FROM student
WHERE age > 20;

-- Find student by name
SELECT *
FROM student
WHERE name = 'Abdul';

-- Using AND condition
SELECT *
FROM student
WHERE age > 20 
AND name = 'John';

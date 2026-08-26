USE college;

-- Total students
SELECT COUN(*) AS total_students
FROM student;

-- Maximum age
SELECT MAX(age) AS maximum_age
FROM student;

-- Minimum age
SELECT MIN(age) AS minimum_age
FROM student;

-- Average age
SELECT AVG(age) AS average_age
FROM student;

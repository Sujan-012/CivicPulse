CREATE DATABASE company;

USE company;

CREATE TABLE department(
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50)
);

CREATE TABLE employee(
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(50),
    dept_id INT
);

INSERT INTO department VALUES
(1,'IT'),
(2,'HR'),
(3,'Finance');

INSERT INTO employee VALUES
(101,'Abdul',1),
(102,'Rahul',2),
(103,'Kavin',3);

-- INNER JOIN

SELECT 
employee.emp_name,
department.dept_name

FROM employee

INNER JOIN department

ON employee.dept_id = department.dept_id;

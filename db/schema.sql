DROP DATABASE IF EXISTS workforce_db; --  Deletes any existing databases with that name
CREATE DATABASE workforce_db; --  creates workforce_db 

USE workforce_db --  Selects the "workforce_db" database for use 

CREATE TABLE department ( --  Creates a table named "department" to store information about different departments 
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, --  Unique identifier for each department, auto-incremented  
name VARCHAR(30) NOT NULL --  Name of the department, must not be NULL
);

CREATE TABLE roles (  --  Creates a table named "roles" to store information about different roles within departments
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each role, auto-incremented
  department_id INT, -- Foreign key referencing the id of the department to which the role belongs
  title VARCHAR(30) NOT NULL, -- Title of the role, must not be NULL
  salary DECIMAL, -- Salary associated with the role
  FOREIGN KEY (department_id) -- Constraint to enforce referential integrity with the department table
  REFERENCES department(id)
  ON DELETE SET NULL -- If the referenced department is deleted, set the department_id in this table to NULL
);

CREATE TABLE employee (  -- Creates a table named "employee" to store information about individual employees
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each employee, auto-incremented
 first_name VARCHAR(30),  -- First name of the employee
 last_name VARCHAR(30),  -- Last name of the employee
 role_id INT,   -- Foreign key referencing the id of the role assigned to the employee
 manager_id INT NULL,  -- Foreign key referencing the id of the manager of the employee
 -- Constraint to enforce referential integrity with the roles table
 FOREIGN KEY (role_id)
 REFERENCES roles(id)
 );
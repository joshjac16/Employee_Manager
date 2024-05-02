USE workforce_db;

INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Accountant", 125000, 3),
       ("Legal Team Lead", 250000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 3),
       ("Mike", "Chan", 2, 1),
       ("Ashley", "Rodriguez", 3, null),
       ("Kevin", "Tupik", 4, 3),
       ("Malia", "Brown", 5, null),
       ("Sarah", "Lourd", 2, null),
       ("Tom", "Allen", 4, 7), 
       ("Christian", "Eckenrode", 1, 2);

       view all departments, view all roles, view all employees, add a department,
        add a role, add an employee, and update an employee role
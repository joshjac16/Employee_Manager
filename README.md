# Employee_Manager
Streamline employee database management for companies. Easily view, add, update, and delete employee information with this intuitive interface. It is built using Node.js, Inquirer, and MySQL, providing an interface for users to easily view and interact with the database.


## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```


## Installation 

1. Clone the repository to your local machine.
```md
git clone 
```
2. Navigate to the project directory.
3. install dependencies.
```md
npm i
```
4. Ensure Inquirer version 8.2.4 is installed
5. Set up your MySQL database and configure a new '.env' file using the example file
6. Make a new database in mysql
```md 
source schema.sql
```
7. Add content to database 
```md
source seed.sql
```

## Usage 

To start the application, navigate to the project directory in your terminal and run the command node server.js.

Upon launching the application, you will be presented with various options:

* View all departments
* View all roles
* View all employees
* Add a department
* Add a role
* Add an employee
* Update an employee role
* Exit
* Choose an option by selecting it and pressing enter.

### Viewing Departments, Roles, and Employees
Select the corresponding option to view all departments, roles, or employees. The application will display the requested information in a formatted table.

### Adding a Department, Role, or Employee
Choose the respective option to add a department, role, or employee. Follow the prompts to enter the necessary information. The data will be added to the database accordingly.

### Updating an Employee Role
Select the option to update an employee's role. Follow the prompts to select the employee and their new role. The database will be updated with the new information.

### Video Walkthrough 
![Database schema includes tables labeled “employee,” role,” and “department.”](https://github.com/joshjac16/Employee_Manager/assets/130494193/b49c57e2-fc6d-486b-8b8f-6a039433a919)


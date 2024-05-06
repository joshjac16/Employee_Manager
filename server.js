// Importing required modules
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
require("dotenv").config();

// Creating MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


// Connecting to the database
connection.connect((err) => {
  if (err) throw err;
  console.log("listening at ");
  startApp();
});


// Function to start the application
function startApp() {
    // Prompting user for action
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Exit",
      ],
    })
    .then(({ action }) => {
      switch (action) {
        case "View All Employees":
          viewAllEmployee();
          break;
        case "View All Departments":
          viewDepartment();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployee();
          break;
        default:
          connection.end();
          process.exit(0);
      }
    });
}

// Function to view all employees
function viewAllEmployee() {
  connection.query(
    'SELECT E.ID,E.FIRST_NAME,E.LAST_NAME,R.TITLE,D.NAME AS DEPARTMENT ,R.SALARY,CONCAT(M.FIRST_NAME," ",M.LAST_NAME) AS "MANAGER" FROM  EMPLOYEE E LEFT JOIN ROLES R ON E.role_id = R.ID LEFT JOIN DEPARTMENT D ON R.department_id = D.ID LEFT JOIN EMPLOYEE M ON E.manager_id = M.ID;',
    function (err, data) {
      if (err) throw err;
      console.table(data);
      startApp();
    }
  );
}

// Function to view all departments
function viewDepartment() {
  connection.query("SELECT * FROM DEPARTMENT", function (err, data) {
    if (err) throw err;
    console.table(data);
    startApp();
  });
}

// Function to view all roles
function viewRoles() {
  connection.query(
    'SELECT R.ID,R.TITLE,D.NAME AS "DEPARTMENT NAME",R.SALARY FROM ROLES R,DEPARTMENT D WHERE R.department_id =D.ID;',
    function (err, data) {
      if (err) throw err;
      console.table(data);
      startApp();
    }
  );
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "enter department name: ",
      },
    ])
    .then(({ newDepartment }) => {
      connection.query(
        "INSERT INTO department (name) VALUES (?);",
        newDepartment,
        function (err, data) {
          if (err) throw err;
          console.log(`Added ${newDepartment} to database`);
          startApp();
        }
      );
    });
}


// Function to add a role
function addRole() {
  connection.query("SELECT id, name FROM department", function (err, data) {
    if (err) throw err;

    const choices = data.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    inquirer
      .prompt([
        {
          name: "newRole",
          type: "input",
          message: "Enter role name: ",
        },
        {
          name: "newRoleSalary",
          type: "input",
          message: "Enter role salary: ",
        },
        {
          name: "newRoleDepartment",
          type: "list",
          message: "Which department does the role belong to?",
          choices: choices,
        },
      ])
      .then(({ newRole, newRoleSalary, newRoleDepartment }) => {
        connection.query(
          "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);", // Assuming you have a 'role' table
          [newRole, newRoleSalary, newRoleDepartment],
          function (err, data) {
            if (err) throw err;
            console.log(`Added ${newRole} to the database`);
            startApp();
          }
        );
      });
  });
}

// Function to add an employee
function addEmployee() {
  connection.query("SELECT id, title FROM roles;", function (err, rolesData) {
    if (err) throw err;

    const roleChoices = rolesData.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    connection.query(
      'SELECT DISTINCT M.ID, CONCAT(M.first_name, " ", M.last_name) AS "MANAGER" FROM employee E JOIN employee M ON E.manager_id = M.ID ORDER BY M.ID ASC;',
      function (err, managersData) {
        if (err) throw err;

        const manChoices = [{ name: "None", value: null }];

        managersData.forEach((manager) => {
          manChoices.push({
            name: manager.MANAGER,
            value: manager.ID,
          });
        });

        inquirer
          .prompt([
            {
              name: "newEmpFName",
              type: "input",
              message: "What is the Employee's First Name?",
            },
            {
              name: "newEmpLName",
              type: "input",
              message: "What is the Employee's Last Name?",
            },
            {
              name: "newEmpRole",
              type: "list",
              message: "What is the role of this Employee?",
              choices: roleChoices,
            },
            {
              name: "newEmployeeM",
              type: "list",
              message: "What Manager is the Employee under?",
              choices: manChoices,
            },
          ])
          .then(({ newEmpFName, newEmpLName, newEmpRole, newEmployeeM }) => {
            connection.query(
              "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);",
              [newEmpFName, newEmpLName, newEmpRole, newEmployeeM],
              function (err, data) {
                if (err) throw err;

                console.log(
                  `Added ${newEmpFName} ${newEmpLName} to the database`
                );

                startApp();
              }
            );
          });
      }
    );
  });
}


// Function to update an employee's role
function updateEmployee() {
  connection.query(
    'SELECT E.ID, CONCAT(E.FIRST_NAME," ",E.LAST_NAME) AS EMPLOYEE FROM employee E',
    function (err, data) {
      if (err) throw err;
      const empChoice = data.map((employee) => ({
        name: employee.EMPLOYEE,
        value: employee.ID, 
      }));

      connection.query(
        "SELECT id, title FROM roles;",
        function (err, roleData) {
          if (err) throw err;
          const newRole = roleData.map((role) => ({
            name: role.title,
            value: role.id,
          }));

          inquirer
            .prompt([
              {
                name: "updateEmp", 
                type: "list",
                message: "Which employee's role would you like to update?",
                choices: empChoice,
              },
              {
                name: "updateRole", 
                type: "list",
                message:
                  "What role do you want to move the selected employee to?",
                choices: newRole,
              },
            ])
            .then(({ updateEmp, updateRole }) => {
              
              connection.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [updateRole, updateEmp], 
                function (err, data) {
                  if (err) throw err;

                  console.log("Employee role updated successfully");
                  startApp();
                }
              );
            });
        }
      );
    }
  );
}

const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  //   port: 8889,
  user: "root",
  password: "password",
  database: "workforce_db",
});

// const connection = mysql.createConnection(
//   {
//     host: "localhost",
//     // MySQL username,
//     user: "root",
//     // TODO: Add MySQL password here
//     password: "password",
//     database: "workforce_db",
//   },
//   console.log(`Connected to the workforce_db database.`)
// );

connection.connect((err) => {
  if (err) throw err;
  console.log("listening at ");
  startApp();
});

function startApp() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add department",
        "Add role",
        "Add employee",
        "Update employee",
        "Exit",
      ],
    })
    .then(({ action }) => {
      switch (action) {
        case "View all employees":
          viewAllEmployee();
          break;
        case "View all departments":
          viewDepartment();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "Add department":
          addDepartment();
          break;
        case "Add role":
          addRole();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Update employee":
          updateEmployee();
          break;
        default:
          connection.end();
          process.exit(0);
      }
    });
}

function viewAllEmployee() {
  connection.query(
    'SELECT E.ID,E.FIRST_NAME,E.LAST_NAME,R.TITLE,D.NAME,R.SALARY,CONCAT(M.FIRST_NAME," ",M.LAST_NAME) AS "MANAGER" FROM  EMPLOYEE E LEFT JOIN ROLES R ON E.role_id = R.ID LEFT JOIN DEPARTMENT D ON R.department_id = D.ID LEFT JOIN EMPLOYEE M ON E.manager_id = M.ID;',
    function (err, data) {
      if (err) throw err;
      console.table(data);
      startApp();
    }
  );
}

function viewDepartment() {
  connection.query("SELECT * FROM DEPARTMENT", function (err, data) {
    if (err) throw err;
    console.table(data);
    startApp();
  });
}

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
          console.table(data);
          startApp();
        }
      );
    });
}

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
            console.table(data);
            startApp();
          }
        );
      });
  });
}

function addEmployee() {
  connection.query("SELECT id, title FROM roles;", function (err, rolesData) {
    if (err) throw err;

    const roleChoices = rolesData.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    // Fetch managers
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
                console.table(data);
                startApp();
              }
            );
          });
      }
    );
  });
}

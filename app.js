const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3001;
require('dotenv').config();

// Connect to PostgreSQL
const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
         ssl: true
});

// Create a PostgreSQL table for employees
const createEmployeeTable = `
    CREATE TABLE IF NOT EXISTS postgres (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        position VARCHAR(255),
        salary INTEGER,
        state VARCHAR(255)
    );
`;

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Error connecting to PostgreSQL database:', err);
});


pool.query(createEmployeeTable)
    .then(() => console.log('Employee table created successfully'))
    .catch(err => {
        console.error('Error creating employee table:', err);
        // Handle the error more gracefully here, e.g., res.status(500).send('Internal Server Error');
    });

// Middleware to parse POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./client/build'));


// Serve HTML form at the root URL
//app.get('/', (req, res) => {
//    res.sendFile(__dirname + '/dummyfile/client/src/index.js');
//});

// Display employee data
app.get('/employees', (req, res) => {
    console.log('Received GET request to /');
    pool.query('SELECT * FROM employees')
        .then((result) => {
            const employees = result.rows;
             res.json(employees);
//            res.write('<h1>Employee Information</h1>');
 //           res.write('<table border="1">');
   //         res.write('<tr><th>Name</th><th>Position</th><th>Salary</th><th>State</th></tr>');
    //        employees.forEach((employee) => {
     //           res.write(`<tr><td>${employee.name}</td><td>${employee.position}</td><td>${employee.salary}</td><td>${employee.state}</td></tr>`);
      //      });
      //      res.write('</table>');
      //      res.write('<a href="/">Go back</a>');
       //     res.end();
        })
        .catch((err) => {
            console.error(err);
            res.send('Error fetching employee data.');
        });
});

// Handle form submission and store data in PostgreSQL
app.post('/add', (req, res) => {
    const { name, position, salary, state } = req.body;
    console.log(`Received POST request to /add with data: name=${name}, position=${position}, salary=${salary}, state=${state}`);
    const insertEmployeeQuery = 'INSERT INTO employees (name, position, salary, state) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [name, position, salary, state];

    pool.query(insertEmployeeQuery, values)
        .then(() => {
            // Redirect to the /employees route to display employee data
            res.redirect('/employees');
        })
        .catch(err => {
            console.error(err);
            res.send('Error saving employee data.');
        });
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Closing server and database connections gracefully.');
    app.close(() => {
        pool.end(() => {
            console.log('Server and database connections closed.');
            process.exit(0);
        });
    });
});

app.listen(port,'0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
});

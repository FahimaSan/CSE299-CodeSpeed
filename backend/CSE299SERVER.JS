const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require('express-session');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));
app.options('*', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
});

app.use(express.json());
app.use(cookieParser());

const sessionSecret = process.env.SESSION_SECRET;
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 2
    }
}));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});

console.log("Setting up routes...");

// Register User
app.post('/register', (req, res) => {
    console.log("POST /register called", req.body);
    const { UserName, Email, Password_hash } = req.body;
    if (!UserName || !Email || !Password_hash) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    const sql = `INSERT INTO users (UserName, Email, Password_hash, Created_At) VALUES (?, ?, ?, NOW())`;
    db.query(sql, [UserName, Email, Password_hash], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json({ message: "User registered successfully", UserID: result.insertId, UserName, Email });
    });
});

// Get User by ID
//.....

// Delete User by ID
//for future deactivation of id

// Start Typing Test
app.post('/typing-test/complete', (req, res) => {
    const { userID, test_mode, programming_language, start_time, end_time } = req.body;
  
    if (!userID || !test_mode || !programming_language || !start_time || !end_time) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    const sql = `INSERT INTO typing_tests (userID, test_mode, programming_language, start_time, end_time)
                 VALUES (?, ?, ?, ?, ?)`;
  
    db.query(sql, [userID, test_mode, programming_language, new Date(start_time), new Date(end_time)], (err, result) => {
      if (err) {
        console.error("Error saving typing test:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
  
      res.json({ message: "Typing test recorded", testID: result.insertId });
    });
  });
  

// End Typing Test


// Get User Typing Tests
app.get('/typing-test/user/:userID', (req, res) => {
    console.log("GET /typing-test/user called for userID:", req.params.userID);
    const { userID } = req.params;
    const sql = `SELECT * FROM typing_tests WHERE userID = ? ORDER BY start_time DESC`;
    db.query(sql, [userID], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json(results);
    });
});

// Save Customizations
app.post('/customizations', (req, res) => {
    console.log("POST /customizations called", req.body);
    const { userID, theme, font } = req.body;
    if (!userID || !theme || !font) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    const sql = `INSERT INTO customizations (UserID, theme, font) VALUES (?, ?, ?)`;
    db.query(sql, [userID, theme, font], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json({ message: "Customization saved successfully", customizationID: result.insertId, userID, theme, font });
    });
});

// Save Results
app.post('/save-result', (req, res) => {
    const { testID, accuracy, words_per_minute, time_taken } = req.body;

    if (!testID || accuracy === undefined || !words_per_minute || !time_taken) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const sql = `
        INSERT INTO results (testID, accuracy, words_per_minute, time_taken, updated_date)
        VALUES (?, ?, ?, ?, NOW())
    `;

    db.query(sql, [testID, accuracy, words_per_minute, time_taken], (err, result) => {
        if (err) {
            console.error("Error saving result:", err);
            return res.status(500).json({ error: "Error saving result" });
        }

        console.log("Result saved. Insert ID:", result.insertId);
        res.json({ message: "Result saved successfully", resultID: result.insertId });
    });
});


// Get Result by Test ID
app.post('/save-result', (req, res) => {
    const { testID, accuracy, words_per_minute, time_taken } = req.body;
  
    if (!testID || accuracy === undefined || !words_per_minute || !time_taken) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    const sql = `
      INSERT INTO results (testID, accuracy, words_per_minute, time_taken, updated_date)
      VALUES (?, ?, ?, ?, NOW())
    `;
  
    db.query(sql, [testID, accuracy, words_per_minute, time_taken], (err, result) => {
      if (err) {
        console.error("Error saving result:", err);
        return res.status(500).json({ error: "Error saving result" });
      }
  
      console.log("Result saved with ID:", result.insertId);
      res.json({ message: "Result saved successfully", resultID: result.insertId });
    });
  });
  app.get('/performance-history', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.session.user.UserID;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const formattedDate = oneWeekAgo.toISOString().split('T')[0];

    const query = `
        SELECT r.accuracy, r.words_per_minute, r.time_taken, r.updated_date 
        FROM results r 
        JOIN typing_tests t ON r.testID = t.testID
        WHERE t.userID = ? AND r.updated_date >= ?
        ORDER BY r.updated_date DESC
    `;

    db.query(query, [userId, formattedDate], (err, results) => {
        if (err) {
            console.error('Error fetching performance history:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

  

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    db.query('SELECT * FROM users WHERE Email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.Password_hash);
        if (passwordMatch) {
            req.session.user = { UserID: user.UserID, UserName: user.UserName, Email: user.Email };
            return res.json({ message: 'Login successful', user: req.session.user });
            
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Logout
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

// Check Auth
app.get('/check-auth', (req, res) => {
    console.log("Check-auth session:", req.session);
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Profile
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = req.session.user.UserID;
    db.query('SELECT UserName, Email FROM users WHERE UserID = ?', [userId], (err, results) => {
        if (err) return res.status(500).send('Server error');
        if(results.length === 0){
          return res.status(404).json({message: "User not found"});
        }
        res.json(results[0]);
    });
});

// Performance History
app.get('/performance-history', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = req.session.user.UserID;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const formattedDate = oneWeekAgo.toISOString().split('T')[0];
    const query = `
        SELECT r.accuracy, r.words_per_minute, r.time_taken, r.updated_date 
        FROM results r 
        JOIN typing_tests t ON r.testID = t.testID
        WHERE t.UserID = ? AND r.updated_date >= ?
        ORDER BY r.updated_date DESC
    `;
    db.query(query, [userId, formattedDate], (err, results) => {
        if (err) {
            console.error('Error fetching results history:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// Invalid Route Handler
app.all('*', (req, res) => {
    console.log(`Invalid route accessed: ${req.method} ${req.path}`);
    res.status(404).json({ message: `Cannot ${req.method} ${req.path}` });
});
// ...save result

app.post('/save-result', (req, res) => {
    const { testID, accuracy, words_per_minute, time_taken } = req.body;

    const insertSql = `
        INSERT INTO results (testID, accuracy, words_per_minute, time_taken, updated_date) 
        VALUES (?, ?, ?, ?, NOW())
    `;

    db.query(insertSql, [testID, accuracy, words_per_minute, time_taken], (err, result) => {
        if (err) {
            console.error("Error saving result:", err);
            return res.status(500).json({ error: "Error saving result" });
        }

        console.log(" Result inserted. Insert ID:", result.insertId);
        res.json({ message: "Result saved successfully", resultID: result.insertId });
    });
});


// Start Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

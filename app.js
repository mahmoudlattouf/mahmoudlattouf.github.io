// Filename: app.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to log headers and request
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Serve static files (fake frontend)
app.use(express.static('public'));

// ------------------------
// Fake Admin Panel
// ------------------------
app.get('/admin', (req, res) => {
    res.send(`
        <h1>Fake Admin Panel</h1>
        <form method="POST" action="/admin/login">
            <input name="username" placeholder="Username" /><br/>
            <input type="password" name="password" placeholder="Password" /><br/>
            <button type="submit">Login</button>
        </form>
    `);
});

// Fake login endpoint
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;

    // Echo back for testing SQLi/XSS payloads
    res.send(`
        <h2>Login attempt</h2>
        <p>Username: ${username}</p>
        <p>Password: ${password}</p>
        <p>Logged from IP: ${req.ip}</p>
    `);
});

// ------------------------
// API Endpoint for testing payloads
// ------------------------
app.get('/api/data', (req, res) => {
    const { query } = req.query;
    res.json({
        message: 'Fake API Response',
        queryEcho: query || null,
        status: 'OK'
    });
});

// ------------------------
// Endpoint to test headers
// ------------------------
app.get('/api/headers', (req, res) => {
    res.json({
        headersReceived: req.headers,
        note: 'Send custom headers to test WAF inspection'
    });
});

// ------------------------
// Simulate "dangerous" endpoint
// ------------------------
app.get('/api/execute', (req, res) => {
    const cmd = req.query.cmd || '';
    res.send(`
        <p>Simulated command execution: ${cmd}</p>
        <p>Do NOT run real commands on WAF test server!</p>
    `);
});

app.listen(PORT, () => {
    console.log(`Fake WAF test server running on port ${PORT}`);
});

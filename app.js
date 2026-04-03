const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home page with forms
app.get('/', (req, res) => {
  res.send(`
    <h1>WAF Test App</h1>

    <h2>Search</h2>
    <form action="/search">
      <input name="q" />
      <button type="submit">Search</button>
    </form>

    <h2>Login</h2>
    <form action="/login">
      <input name="username" placeholder="username" />
      <input name="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>

    <h2>Comment</h2>
    <form action="/comment" method="POST">
      <input name="comment" />
      <button type="submit">Post</button>
    </form>

    <h2>API Test (JSON)</h2>
    <form action="/api/data" method="POST">
      <textarea name="json"></textarea>
      <button type="submit">Send</button>
    </form>
  `);
});

// Search (XSS)
app.get('/search', (req, res) => {
  res.send(`You searched for: ${req.query.q}`);
});

// Login (SQLi-style)
app.get('/login', (req, res) => {
  res.send(`Login attempt: ${req.query.username}`);
});

// Comment (stored XSS simulation)
app.post('/comment', (req, res) => {
  res.send(`Comment received: ${req.body.comment}`);
});

// API endpoint (JSON injection)
app.post('/api/data', (req, res) => {
  res.json({
    received: req.body
  });
});

// Command injection style
app.get('/ping', (req, res) => {
  res.send(`Pinging ${req.query.host}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

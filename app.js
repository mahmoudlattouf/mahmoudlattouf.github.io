const express = require('express');
const multer = require('multer');
const session = require('express-session');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: true
}));

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Home page
app.get('/', (req, res) => {
  res.send(`
    <h1>WAF Test App</h1>

    <h2>Login</h2>
    <form action="/login" method="POST">
      <input name="username" placeholder="username" />
      <input name="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>

    <h2>Search (XSS)</h2>
    <form action="/search">
      <input name="q" />
      <button type="submit">Search</button>
    </form>

    <h2>Comment</h2>
    <form action="/comment" method="POST">
      <input name="comment" />
      <button type="submit">Post</button>
    </form>

    <h2>File Upload</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>

    <h2>API (JSON)</h2>
    <form action="/api/data" method="POST">
      <textarea name="json"></textarea>
      <button type="submit">Send</button>
    </form>

    <h2>Admin Page</h2>
    <a href="/admin">Go to Admin</a>
  `);
});

// 🔐 LOGIN (session-based)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // intentionally weak auth
  if (username === 'admin' && password === 'password') {
    req.session.user = 'admin';
    return res.send('Logged in as admin');
  }

  res.send(`Login failed for ${username}`);
});

// 🔐 Protected route
app.get('/admin', (req, res) => {
  if (req.session.user === 'admin') {
    return res.send('Welcome Admin Panel');
  }
  res.send('Access denied');
});

// 🔍 Search (XSS)
app.get('/search', (req, res) => {
  res.send(`Search result: ${req.query.q}`);
});

// 💬 Comment (stored XSS simulation)
app.post('/comment', (req, res) => {
  res.send(`Comment: ${req.body.comment}`);
});

// 📁 File upload
app.post('/upload', upload.single('file'), (req, res) => {
  res.send(`File uploaded: ${req.file.originalname}`);
});

// 🔗 API endpoint
app.post('/api/data', (req, res) => {
  res.json({ received: req.body });
});

// 💣 Command injection simulation
app.get('/ping', (req, res) => {
  res.send(`Pinging ${req.query.host}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

app.get('/search', (req, res) => {
  const q = req.query.q;
  res.send(`Search result: ${q}`);
});

// SQLi-style test
app.get('/login', (req, res) => {
  const user = req.query.username;
  const pass = req.query.password;
  res.send(`Login attempt: ${user}`);
});

// Command injection style
app.get('/ping', (req, res) => {
  const host = req.query.host;
  res.send(`Pinging ${host}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form submitted:', { name, email, message });

  if (!name || !email || !message) {
    return res.status(400).json({ status: 'error', message: 'Please complete all fields.' });
  }

  res.json({ status: 'success', message: `Thanks ${name}, your message has been received.` });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`June Cafe server running at http://localhost:${port}`);
});

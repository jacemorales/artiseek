const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/artipoints', require('./routes/artipoints'));
app.use('/api/services', require('./routes/services'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/applications', require('./routes/applications'));

app.get('/', (req, res) => {
  res.send('Hello from the Artiseek backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
    "https://autofixerai.netlify.app",
    "http://localhost:5173"
  ]
}));

app.use(express.json({ limit: '10mb' }));

app.use('/api', analyzeRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`AutoFix AI backend running on port ${PORT}`);
});
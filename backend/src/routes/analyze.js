const express = require('express');
const router = express.Router();
const AICodeFixer = require('../services/aiFixer');
const { analysisLimiter } = require('../middleware/rateLimit');

const aiFixer = new AICodeFixer(process.env.OPENAI_API_KEY);

router.post('/analyze', analysisLimiter, async (req, res) => {
  const { code, language = 'python' } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "code" field' });
  }
  try {
    const result = await aiFixer.findAndFixErrors(code, language);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI analysis failed', details: err.message });
  }
});

module.exports = router;
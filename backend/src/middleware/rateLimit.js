const rateLimit = require('express-rate-limit');

const analysisLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: { error: 'Too many analysis requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { analysisLimiter };
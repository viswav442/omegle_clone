const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const config = require("../config/config");

const limiter = rateLimit(config.rateLimit);

const setupSecurity = (app) => {
  // Basic security headers
  app.use(helmet());

  // Rate limiting
  app.use(limiter);

  // CORS setup is handled in server.js

  // Prevent parameter pollution
  app.use((req, res, next) => {
    if (req.query) {
      Object.keys(req.query).forEach((key) => {
        if (Array.isArray(req.query[key])) {
          req.query[key] = req.query[key][0];
        }
      });
    }
    next();
  });
};

module.exports = setupSecurity;

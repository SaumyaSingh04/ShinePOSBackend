// Simple validation middleware - no complex rules
const handleValidationErrors = (req, res, next) => {
  next();
};

module.exports = {
  handleValidationErrors
};
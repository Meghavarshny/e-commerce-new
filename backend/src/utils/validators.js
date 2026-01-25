// Validate email format
const isValidEmail = (email) => {
  return /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email);
};

// Validate password strength (min 6 chars)
const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

module.exports = { isValidEmail, isValidPassword };

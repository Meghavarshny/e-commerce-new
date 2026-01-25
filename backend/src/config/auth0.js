const { auth } = require('express-oauth2-jwt-bearer');

const auth0Middleware = auth({
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  audience: process.env.AUTH0_CLIENT_ID,
  tokenSigningAlg: 'RS256'
});

module.exports = auth0Middleware;

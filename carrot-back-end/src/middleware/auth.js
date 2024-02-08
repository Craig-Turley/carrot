const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-ru724ralugsbullp.us.auth0.com/.well-known/jwks.json`,
  }),
  audience: 'your-api-audience',
  issuer: `https://dev-ru724ralugsbullp.us.auth0.com/`,
  algorithms: ['RS256'],
});

module.exports = authCheck;
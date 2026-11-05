/**
 * Loads the configuration (environment variables, see config_defaults.js).
 */

const config = require('./config_defaults');

if (!process.env.WEBSITE_SESSION_SECRET) {
    console.warn('WEBSITE_SESSION_SECRET is not set. Using a random secret.');
}
if (!config.OAUTH_CREDENTIALS.CLIENT_SECRET) {
    console.warn('WEBSITE_CLIENT_SECRET is not set. Login will fail.');
}

module.exports = config;

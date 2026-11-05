/**
 * OpenID Connect (authorization code flow) against Keycloak.
 */

const OAuthStrategy = require('passport-oauth2');
const authAdapter = require('../../adapter/auth_service_adapter');
const logger = require('../../global/logger');
const CONFIG = require('../../config/config_loader');

module.exports = function (passport) {
    logger.debug('Configure Keycloak auth');

    passport.use('iuno', new OAuthStrategy({
            authorizationURL: authAdapter.endpoints.authorization,
            tokenURL: authAdapter.endpoints.token,
            clientID: CONFIG.OAUTH_CREDENTIALS.CLIENT_ID,
            clientSecret: CONFIG.OAUTH_CREDENTIALS.CLIENT_SECRET,
            callbackURL: CONFIG.OAUTH_CREDENTIALS.CALLBACK_URL,
            scope: ['openid'],
            passReqToCallback: true
        },
        function (req, accessToken, refreshToken, params, profile, done) {
            const token = authAdapter.buildToken(accessToken, refreshToken, params);

            if (!token.user) {
                return done(new Error('Access token without subject'));
            }

            done(null, {
                id: token.user,
                token: token
            });
        }
    ));
};

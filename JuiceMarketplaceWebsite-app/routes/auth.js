/**
 * Created by beuttlerma on 02.06.17.
 */
const express = require('express');
const logger = require('../global/logger');
const config = require('../config/config_loader');
const authAdapter = require('../adapter/auth_service_adapter');

const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/auth_schema');

module.exports = function (passport) {
    var router = express.Router();

    // LOGOUT ==============================
    router.get('/logout', validate({
        query: validation_schema.Empty,
        body: validation_schema.Empty
    }), function (req, res) {
        req.logout();

        const authServerLogout = authAdapter.endpoints.logout
            + '?client_id=' + encodeURIComponent(config.OAUTH_CREDENTIALS.CLIENT_ID)
            + '&post_logout_redirect_uri=' + encodeURIComponent(config.PUBLIC_WEBSITE_URL + '/');

        res.redirect(authServerLogout);
    });

    router.get('/loggedin', validate({
        query: validation_schema.Empty,
        body: validation_schema.Empty
    }), function (req, res) {
        res.status(200);
        if (req.isAuthenticated()) {
            res.send('true');
        } else {
            res.send('false');
        }
    });

    // =============================================================================
    // AUTHENTICATE (IUNO) ==================================================
    // =============================================================================

    router.get('/iuno', validate({
        query: validation_schema.Empty,
        body: validation_schema.Empty
    }), function (req, res, next) {
        logger.info('iuno login');

        passport.authenticate('iuno')(req, res, next);
    });

    // Registration page of Keycloak; the flow ends in the same callback as the login
    router.get('/register', function (req, res) {
        res.redirect(authAdapter.endpoints.registration
            + '?client_id=' + encodeURIComponent(config.OAUTH_CREDENTIALS.CLIENT_ID)
            + '&response_type=code&scope=openid'
            + '&redirect_uri=' + encodeURIComponent(config.OAUTH_CREDENTIALS.CALLBACK_URL));
    });

    router.get('/callback', validate({
        query: validation_schema.IUNO_Callback_Query,
        body: validation_schema.Empty
    }), function (req, res, next) {

        passport.authenticate('iuno', {
            successRedirect: '/console',
            failureRedirect: '/'
        })(req, res, next);
    });

    return router;
};
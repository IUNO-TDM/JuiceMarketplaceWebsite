/**
 * Created by beuttlerma on 02.06.17.
 */
const express = require('express');
const logger = require('../global/logger');
const config = require('../config/config_loader');

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

        const hostUrl = req.protocol + '://' + req.get('host');

        const authServerLogout =
            config.HOST_SETTINGS.OAUTH_SERVER_EXTERNAL.PROTOCOL
            + '://' + config.HOST_SETTINGS.OAUTH_SERVER_EXTERNAL.HOST
            + ':' + config.HOST_SETTINGS.OAUTH_SERVER_EXTERNAL.PORT
            + '/passport/logout?redirect='
            + encodeURIComponent(hostUrl);

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
    router.get('/iuno/callback', validate({
        query: validation_schema.IUNO_Callback_Query,
        body: validation_schema.Empty
    }), function (req, res, next) {

        passport.authenticate('iuno', {
            successRedirect: '/website/console',
            failureRedirect: '/website',
            failureFlash: true
        })(req, res, next);
    });

    return router;
};
const oAuthServer = require('../adapter/auth_service_adapter');
const logger = require('../global/logger');

const self = {};


self.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.sendStatus(401);
};

self.isUserWithRole = function (role, req, res, next) {
    if (!req.isAuthenticated()) {
        return res.sendStatus(401);
    }

    oAuthServer.getUserInfoForToken(req.user.token.accessToken, function (err, userInfo) {
        if (err) {
            return next(err);
        }

        if (!userInfo.roles || userInfo.roles.indexOf(role) <= -1) {
            logger.warn('[authentication_service] unauthorized api request for role: ' + role);
            logger.warn('[authentication_service] requesting user: ' + JSON.stringify(req.user.token.user));

            return res.sendStatus(401);
        }

        return next();
    });
};

self.isAdmin = function (req, res, next) {
    self.isUserWithRole('Admin', req, res, next)
};


module.exports = self;
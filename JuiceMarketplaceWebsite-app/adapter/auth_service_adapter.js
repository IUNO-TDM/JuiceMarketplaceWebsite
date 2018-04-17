/**
 * Created by beuttlerma on 02.06.17.
 */


var logger = require('../global/logger');
const CONFIG = require('../config/config_loader');
var request = require('request');

var self = {
    publicToken: null
};

function buildOptionsForRequest(method, protocol, host, port, path, qs) {

    return {
        method: method,
        url: protocol + '://' + host + ':' + port + path,
        qs: qs,
        json: true,
        headers: {
            'Authorization': 'Basic ' + new Buffer(CONFIG.OAUTH_CREDENTIALS.CLIENT_ID + ':' + CONFIG.OAUTH_CREDENTIALS.CLIENT_SECRET).toString('base64')
        }
    }
}

self.getUserInfoForToken = function (token, callback) {
    if (typeof(callback) !== 'function') {
        callback = function (err, data) {
            logger.warn('Callback not handled by caller');
        };
    }

    var options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.PROTOCOL,
        CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.HOST,
        CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.PORT,
        '/userinfo',
        {
            access_token: token
        }
    );

    request(options, function (e, r, jsonData) {
        logger.debug('Response from OAUTH Server: ' + JSON.stringify(jsonData));
        const err = logger.logRequestAndResponse(e, options, r, jsonData);

        callback(err, jsonData);
    });

};

self.getClient = function (clientId, callback) {
    if (typeof(callback) !== 'function') {
        callback = (err, data) => {
            logger.warn('Callback not handled by caller');
        };
    }

    self.getPublicToken((err, token) => {
        if (err) {
            return next(err);
        }
        if (!token) {
            logger.crit('[auth_service_adapter] could not get public token.');
            callback(new Error('Missing authorization token'));
        }

        const options = buildOptionsForRequest(
            'GET',
            CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.PROTOCOL,
            CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.HOST,
            CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.PORT,
            `/clients/${clientId}`,
            {}
        );

        options.headers.authorization = `Bearer ${token['accessToken']}`;

        request(options, (e, r, jsonData) => {
            logger.debug('Response from OAUTH Server: ' + JSON.stringify(jsonData));
            const err = logger.logRequestAndResponse(e, options, r, jsonData);

            callback(err, jsonData);
        });
    });
};

self.getImageForUser = function (userId, token, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    var options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.PROTOCOL,
        CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.HOST,
        CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.PORT,
        '/users/' + userId + '/image',
        {}
    );
    options.headers.authorization = 'Bearer ' + token.accessToken;
    options.encoding = null;

    request(options, function (e, r, imageBuffer) {
        var err = logger.logRequestAndResponse(e, options, r, imageBuffer);

        callback(err, {
            imageBuffer: imageBuffer,
            contentType: r ? r.headers['content-type'] : null
        });
    });
};

self.refreshTokenForUser = function (user, callback) {
    if (!user) {
        callback(new Error('Missing argument'));
        return;
    }

    if (!user.token) {
        callback(new Error('Missing oauth token'));
        return;
    }

    if (new Date(user.token.accessTokenExpiresAt) > new Date()) {
        callback(null, user);
        return;
    }

    if (!user.token.refreshTokenExpiresAt || new Date(user.token.refreshTokenExpiresAt) < new Date()) {
        callback(new Error('RefreshTokenExpired'));
        return;
    }

    // Refresh access token
    var options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.PROTOCOL,
        CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.HOST,
        CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.PORT,
        '/oauth/token',
        {}
    );


    options.form = {
        grant_type: 'refresh_token',
        refresh_token: user.token.refreshToken
    };

    request(options, function (e, r, data) {
        var err = logger.logRequestAndResponse(e, options, r, data);

        const _token = data.access_token;

        _token.refreshToken = user.token.refreshToken;
        _token.refreshTokenExpiresAt = user.token.refreshTokenExpiresAt;

        callback(err, {
            id: user.id,
            token: _token
        });
    });
};


self.getPublicToken = function (callback) {

    if (self.publicToken && new Date(self.publicToken.accessTokenExpiresAt) > new Date()) {
        logger.info('[auth_service_adapter] refreshing public token');
        return callback(null, self.publicToken);
    }

    var options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.PROTOCOL,
        CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.HOST,
        CONFIG.HOST_SETTINGS.OAUTH_SERVER_INTERNAL.PORT,
        '/oauth/token',
        {}
    );


    options.form = {
        grant_type: 'password',
        username: CONFIG.PUBLIC_USER.username,
        password: CONFIG.PUBLIC_USER.password
    };

    request(options, function (e, r, data) {
        var err = logger.logRequestAndResponse(e, options, r, data);

        if (!err && data) {
            const _token = data.access_token;

            if (_token) {
                self.publicToken = _token;
            }
        }

        callback(err, self.publicToken);
    });
};

module.exports = self;
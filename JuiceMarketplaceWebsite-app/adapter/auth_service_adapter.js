/**
 * Adapter for the Keycloak OpenID Connect endpoints (realm from config).
 * Server-to-server calls use KEYCLOAK_INTERNAL_URL, browser redirects use KEYCLOAK_PUBLIC_URL.
 */

const logger = require('../global/logger');
const CONFIG = require('../config/config_loader');
const request = require('request');

const self = {
    publicToken: null
};

const oidcPath = '/realms/' + CONFIG.KEYCLOAK_REALM + '/protocol/openid-connect';

self.endpoints = {
    authorization: CONFIG.KEYCLOAK_PUBLIC_URL + oidcPath + '/auth',
    registration: CONFIG.KEYCLOAK_PUBLIC_URL + oidcPath + '/registrations',
    logout: CONFIG.KEYCLOAK_PUBLIC_URL + oidcPath + '/logout',
    token: CONFIG.KEYCLOAK_INTERNAL_URL + oidcPath + '/token',
    userinfo: CONFIG.KEYCLOAK_INTERNAL_URL + oidcPath + '/userinfo'
};

function noop(name) {
    return function () {
        logger.warn('Callback not handled by caller: ' + name);
    };
}

function decodeJwtPayload(jwt) {
    try {
        const payload = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    } catch (err) {
        return {};
    }
}

/**
 * Maps a Keycloak token response to the token object kept in the session.
 */
self.buildToken = function (accessToken, refreshToken, params) {
    const now = Date.now();
    const payload = decodeJwtPayload(accessToken);
    params = params || {};

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        accessTokenExpiresAt: new Date(now + (params.expires_in || 60) * 1000).toISOString(),
        refreshTokenExpiresAt: refreshToken ? new Date(now + (params.refresh_expires_in || 1800) * 1000).toISOString() : undefined,
        user: payload.sub
    };
};

self.getUserInfoForToken = function (token, callback) {
    if (typeof(callback) !== 'function') {
        callback = noop('getUserInfoForToken');
    }

    const options = {
        method: 'GET',
        url: self.endpoints.userinfo,
        json: true,
        headers: {
            authorization: 'Bearer ' + token
        }
    };

    request(options, function (e, r, jsonData) {
        const err = logger.logRequestAndResponse(e, {method: options.method, url: options.url}, r, jsonData);
        if (err) {
            return callback(err);
        }

        const payload = decodeJwtPayload(token);
        const roles = (payload.realm_access && payload.realm_access.roles) || payload.roles || [];

        callback(null, {
            id: jsonData.sub,
            username: jsonData.preferred_username,
            firstname: jsonData.given_name,
            lastname: jsonData.family_name,
            useremail: jsonData.email,
            roles: roles
        });
    });
};

// Keycloak does not hold machine details that the website could show; the client id is used as name.
self.getClient = function (clientId, token, callback) {
    if (typeof(callback) !== 'function') {
        callback = noop('getClient');
    }

    callback(null, {id: clientId, clientname: clientId});
};

// Keycloak users have no profile image
self.getImageForUser = function (userId, token, callback) {
    if (typeof(callback) !== 'function') {
        callback = noop('getImageForUser');
    }

    callback(null, null);
};

function postToTokenEndpoint(form, callback) {
    const options = {
        method: 'POST',
        url: self.endpoints.token,
        json: true,
        form: Object.assign({
            client_id: CONFIG.OAUTH_CREDENTIALS.CLIENT_ID,
            client_secret: CONFIG.OAUTH_CREDENTIALS.CLIENT_SECRET
        }, form)
    };

    request(options, function (e, r, data) {
        // options are not logged: they contain the client secret
        const err = logger.logRequestAndResponse(e, {method: options.method, url: options.url}, r, null);
        callback(err, data);
    });
}

self.refreshTokenForUser = function (user, callback) {
    if (!user) {
        return callback(new Error('Missing argument'));
    }

    if (!user.token) {
        return callback(new Error('Missing oauth token'));
    }

    if (new Date(user.token.accessTokenExpiresAt) > new Date()) {
        return callback(null, user);
    }

    if (!user.token.refreshTokenExpiresAt || new Date(user.token.refreshTokenExpiresAt) < new Date()) {
        return callback(new Error('RefreshTokenExpired'));
    }

    postToTokenEndpoint({
        grant_type: 'refresh_token',
        refresh_token: user.token.refreshToken
    }, function (err, data) {
        if (err || !data || !data.access_token) {
            return callback(err || new Error('Token refresh failed'));
        }

        callback(null, {
            id: user.id,
            token: self.buildToken(data.access_token, data.refresh_token || user.token.refreshToken, data)
        });
    });
};

// Token of the website's own service account (client credentials), used for public pages
self.getPublicToken = function (callback) {

    if (self.publicToken && new Date(self.publicToken.accessTokenExpiresAt) > new Date()) {
        return callback(null, self.publicToken);
    }

    postToTokenEndpoint({grant_type: 'client_credentials'}, function (err, data) {
        if (!err && data && data.access_token) {
            self.publicToken = self.buildToken(data.access_token, null, data);
        }

        callback(err, self.publicToken);
    });
};

module.exports = self;

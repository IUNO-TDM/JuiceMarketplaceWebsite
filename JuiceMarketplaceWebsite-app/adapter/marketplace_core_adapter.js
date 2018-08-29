/**
 * Created by beuttlerma on 07.02.17.
 */

const self = {};

const https = require('https');
const logger = require('../global/logger');
const CONFIG = require('../config/config_loader');
const request = require('request');
const helper = require('../services/helper_service');

//<editor-fold desc="Build Options">
function buildOptionsForRequest(method, protocol, host, port, path, qs) {

    return {
        method: method,
        url: protocol + '://' + host + ':' + port + path,
        qs: qs,
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    }
}

//</editor-fold>

//<editor-fold desc="Components">
// Get all Components
self.getAllComponents = function (language, accessToken, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }
    const options = buildOptionsForRequest( //TODO: add language to request
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/components',
        {
            lang: language,
            technologies: [CONFIG.TECHNOLOGY_UUID]
        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    request(options, function (e, r, components) {
        const err = logger.logRequestAndResponse(e, options, r, components);
        var tdmComponents = null
        if (components && !err) {
            tdmComponents = mapToTdmComponents(components)
        }
        callback(err, tdmComponents);
    });
};
//</editor-fold>

//<editor-fold desc="Administrate Recipes">
// Get Recipes
self.getRecipesForUser = function (language, userId, accessToken, callback) {

    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata',
        {
            user: userId,
            lang: language
        }
    );

    options.headers.authorization = 'Bearer ' + accessToken;

    request(options, function (e, r, recipes) {
        const err = logger.logRequestAndResponse(e, options, r, recipes);

        var tdmRecipes = null
        if (recipes && !err) {
            tdmRecipes = mapToTdmRecipes(recipes)
        }
        callback(err, tdmRecipes);
    });
};

// Save Recipe
self.saveRecipeForUser = function (token, recipeData, callback) {
    if (typeof(callback) !== 'function') {

        callback = function () {
            logger.info('Callback not registered');
        }
    }

    const options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata',
        {}
    );
    options.headers.authorization = 'Bearer ' + token.accessToken;

    options.body = recipeData;

    request(options, function (e, r, jsonData) {
        const err = logger.logRequestAndResponse(e, options, r, jsonData);

        if (err) {
            return callback(err);
        }
        let recipeId = null;

        if (r.headers['location']) {
            recipeId = r.headers['location'].substr(r.headers['location'].lastIndexOf('/') + 1)
        }

        callback(err, recipeId);
    });
};

//Delete Recipe
self.deleteRecipe = function (token, recipeID, callback) {

    const options = buildOptionsForRequest(
        'DELETE',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata/' + recipeID + '/delete',
        {}
    );
    options.headers.authorization = 'Bearer ' + token.accessToken;

    doRequest(options, callback);
};

self.getAllRecipes = function (language, token, params, callback) {
    if (!params) {
        params = {};
    }

    params['technology'] = CONFIG.TECHNOLOGY_UUID;
    params['lang'] = language;

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata',
        params
    );
    options.headers.authorization = 'Bearer ' + token.accessToken;

    doRequest(options, function (err, recipes) {
        var tdmRecipes = null
        if (recipes && !err) {
            tdmRecipes = mapToTdmRecipes(recipes)
        }
        callback(err, tdmRecipes);
    });
};


self.getAllTechnologyData = function (language, token, params, callback) {
    if (!params) {
        params = {};
    }
    params['lang'] = language;

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata',
        params
    );
    options.headers.authorization = 'Bearer ' + token.accessToken;
    // params['technology'] = "ce7da33b-0885-46b5-8ffe-37a211e3bc9c";
    doRequest(options, function (err, techData) {
        var technologyData = null
        if (techData && !err) {
            technologyData = mapToTechnologyData(techData)
        }
        callback(err, technologyData);
    });
};


self.getImageForId = function (id,token, callback) {



    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/technologydata/' + id + '/image',
        {}
    );
    options.json = false;
    options.encoding = null;
    options.headers.authorization = 'Bearer ' + token.accessToken;
    request(options, function (e, r, data) {
        // logger.debug('Response from MarketplaceCore: ' + JSON.stringify(jsonData));
        if (typeof(callback) !== 'function') {

            callback = function (err, data) {
                logger.warn('Callback not handled by caller');
            };
        }

        if (e) {
            logger.crit(e);

            callback(e);
        }

        if (r && r.statusCode !== 200) {
            const err = {
                status: r.statusCode,
                message: data
            };
            logger.warn('Call not successful: Options: ' + JSON.stringify(options) + ' Error: ' + JSON.stringify(err));
            callback(err);

            return;
        }

        callback(null, {
            imageBuffer: data,
            contentType: r ? r.headers['content-type'] : null
        });
    });
    doRequest(options, function (err, data) {

    });

};
//</editor-fold>

//<editor-fold desc="Dashboard (Public) Reports">
self.getTechnologyDataHistory = function (from, to, token, callback) {

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/reports/technologydata/history',
        {
            from: from,
            to: to,
            technologyuuid: CONFIG.TECHNOLOGY_UUID
        }
    );
    options.headers.authorization = 'Bearer ' + token.accessToken;

    // does not return recipe class
    doRequest(options, callback);
};

self.getTopComponents = function (language, from, to, limit, token, callback) {

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/reports/components/top',
        {
            from: from,
            to: to,
            limit: limit,
            lang: language,
            technologyuuid: CONFIG.TECHNOLOGY_UUID
        }
    );
    options.headers.authorization = 'Bearer ' + token.accessToken;

    doRequest(options, function (err, componentReports) {
        callback(err, componentReports)
    })
};

self.getTopTechnologyData = function (from, to, limit, token, callback) {

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/reports/technologydata/top',
        {
            from: from,
            to: to,
            limit: limit,
            technologyuuid: CONFIG.TECHNOLOGY_UUID
        }
    );

    options.headers.authorization = 'Bearer ' + token.accessToken;

    // does not return recipe class
    doRequest(options, callback);
};

self.getTotalRevenue = function (from, to, detail, token, callback) {

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/reports/revenue',
        {
            from: from,
            to: to,
            detail: detail,
            technologyuuid: CONFIG.TECHNOLOGY_UUID
        }
    );
    options.headers.authorization = 'Bearer ' + token.accessToken;

    doRequest(options, callback);
};
//</editor-fold>

//<editor-fold desc="User (Non-Public) Reports">
// getRevenueForUser
self.getRevenueForUser = function (user, from, to, accessToken, callback) {

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/reports/revenue/user',
        {
            user: user,
            from: from,
            to: to,
            technologyuuid: CONFIG.TECHNOLOGY_UUID
        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    doRequest(options, callback);
};
// getRevenueHistory
self.getRevenueHistory = function (accessToken, from, to, callback) {

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/reports/revenue/technologydata/history',
        {
            from: from,
            to: to,
            technologyuuid: CONFIG.TECHNOLOGY_UUID
        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    doRequest(options, callback);
};
// getTopTechnologyDataForUser
self.getTopTechnologyDataForUser = function (user, accessToken, from, to, limit, token, callback) {

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/reports/technologydata/top',
        {
            from: from,
            to: to,
            limit: limit,
            user: user,
            technologyuuid: CONFIG.TECHNOLOGY_UUID
        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;
    // does not use recipe class
    doRequest(options, callback);
};
//</editor-fold>


self.getCumulatedVaultBalanceForUser = function (user, accessToken, callback) {
    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/vault/users/' + user + '/balance',
        null);
    options.headers.authorization = 'Bearer ' + accessToken;

    doRequest(options, callback);
};

self.getVaultWalletsForUser = function (user, accessToken, callback) {
    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/vault/users/' + user + '/wallets',
        null);
    options.headers.authorization = 'Bearer ' + accessToken;

    doRequest(options, callback);
};
self.getVaultWalletForUserAndWalletId = function (user, walletId, accessToken, callback) {
    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/vault/users/' + user + '/wallets/' + walletId,
        null);
    options.headers.authorization = 'Bearer ' + accessToken;

    doRequest(options, callback);
};


self.createVaultPayoutForUser = function (user, walletId, accessToken, payout, callback) {
    const options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/vault/users/' + user + '/wallets/' + walletId + '/payouts',
        null);
    options.body = payout;
    options.headers.authorization = 'Bearer ' + accessToken;

    doRequest(options, callback);
};

self.checkVaultPayoutForUser = function (user, walletId, accessToken, payout, callback) {
    const options = buildOptionsForRequest(
        'POST',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/vault/users/' + user + '/wallets/' + walletId + '/payouts/check',
        null);
    options.body = payout;
    options.headers.authorization = 'Bearer ' + accessToken;

    doRequest(options, callback);
};

self.getActivatedLicenseCountForUser = function (user, accessToken, callback) {

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/reports/licenses/count',
        {
            activated: true,
            user: user,
            technologyuuid: CONFIG.TECHNOLOGY_UUID
        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    doRequest(options, callback);
};

self.getProtocols = function (eventType, clientId, from, to, limit, accessToken, callback) {

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/protocols',
        {
            eventType: eventType,
            clientId: clientId,
            from: from,
            to: to,
            limit: limit
        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    doRequest(options, callback);
};

self.getLastProtocolForEachClient = function (eventType, from, to, accessToken, callback) {

    const options = buildOptionsForRequest(
        'GET',
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PROTOCOL,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.HOST,
        CONFIG.HOST_SETTINGS.MARKETPLACE_CORE.PORT,
        '/protocols/last',
        {
            eventType: eventType,
            from: from,
            to: to,
        }
    );
    options.headers.authorization = 'Bearer ' + accessToken;

    doRequest(options, callback);
};



module.exports = self;


// --- FUNCTIONS ---
function mapToTdmRecipes(recipes) {
    var tdmRecipes = recipes.map(r => {
        var recipe = {}
        recipe.id = r.technologydatauuid
        recipe.name = r.technologydataname
        recipe.description = r.technologydatadescription
        recipe.licenseFee = r.licensefee
        recipe.program = r.technologydata
        recipe.backgroundColor = r.backgroundcolor
        recipe.components = mapToTdmComponents(r.componentlist)
        recipe.imageRef = r.technologydataimgref
        return recipe
    })
    return tdmRecipes
}

function mapToTechnologyData(technologydata) {
    const techData = technologydata.map(r => {
        var td = {};
        td.id = r.technologydatauuid;
        td.technologyId = r.technologyuuid;
        td.name = r.technologydataname;
        td.description = r.technologydatadescription;
        td.licenseFee = r.licensefee;
        td.program = r.technologydata;
        td.backgroundColor = r.backgroundcolor;
        td.components = mapToTdmComponents(r.componentlist);
        td.imageRef = r.technologydataimgref;
        return td
    });
    return techData
}

function mapToTdmComponents(components) {
    var tdmComponents = components.map(c => {
        var component = {}
        component.id = c.componentuuid
        component.name = c.componentname
        component.displayColor = c.displaycolor
        return component
    })
    return tdmComponents
}

function doRequest(options, callback) {
    request(options, function (e, r, jsonData) {
        logger.debug('Response from MarketplaceCore: ' + JSON.stringify(jsonData));
        if (typeof(callback) !== 'function') {

            callback = function (err, data) {
                logger.warn('Callback not handled by caller');
            };
        }

        if (e) {
            logger.crit(e);

            callback(e);
        }

        if (r && r.statusCode !== 200) {
            const err = {
                status: r.statusCode,
                message: jsonData
            };
            logger.warn('Call not successful: Options: ' + JSON.stringify(options) + ' Error: ' + JSON.stringify(err));
            callback(err);

            return;
        }

        callback(null, jsonData);
    });
}
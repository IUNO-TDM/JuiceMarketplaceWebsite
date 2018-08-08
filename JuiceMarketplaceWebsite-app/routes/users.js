/**
 * Created by beuttlerma on 05.07.17.
 */

const express = require('express');
const router = express.Router();
const marketplaceCore = require('../adapter/marketplace_core_adapter');
const authService = require('../adapter/auth_service_adapter');
const logger = require('../global/logger');
const helper = require('../services/helper_service');
const encryption = require('../services/encryption_service');
const recipeLimitService = require('../services/recipe_limit_service');
const imageService = require('../services/image_service');
const authenticationService = require('../services/authentication_service');

const CONFIG = require('../config/config_loader');

const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/users_schema');
const validation_schema_recipe = require('../schema/recipe_schema');

// router.use('/:id', authenticationService.paramIsEqualToSessionUser('id'));

/**
 * Retrieves the user information for the logged in user
 */
router.get('/me', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {

    authService.getUserInfoForToken(req.user.token.accessToken, function (err, data) {
        if (err) {
            return next(err);
        }

        res.json(data);
    });

});

router.all('/me/*', function (req, res, next) {

    const redirectPath = req.originalUrl.replace('/me/', '/' + req.user.token.user + '/');

    res.redirect(307, redirectPath);
});

router.get('/', validate({
    query: validation_schema.Users_Query,
    body: validation_schema.Empty
}), function (req, res, next) {

    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});

/**
 * Retrieves the user information for a specific user
 */
router.get('/:id', authenticationService.paramIsEqualToSessionUser('id'), validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {

    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});


/**
 * Returns the limit of recipes the user can publish on the marketplace
 */
router.get('/:id/recipes/limit', authenticationService.paramIsEqualToSessionUser('id'), validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    marketplaceCore.getActivatedLicenseCountForUser(req.params['id'], req.user.token.accessToken, function (err, activatedLicenses) {
        if (err) {
            return next(err);
        }

        return res.json({limit: recipeLimitService.calculateRecipeLimit(activatedLicenses)});

    });
});
/**
 * Returns the amount of recipes the user already published on the marketplace
 */
router.get('/:id/recipes/count', authenticationService.paramIsEqualToSessionUser('id'), validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    const language = req.cookies.language;
    marketplaceCore.getRecipesForUser(language, req.params['id'], req.user.token.accessToken, function (err, recipes) {
        if (err) {
            return next(err);
        }
        return res.json({count: recipes.length});
    });
});
/**
 * Saves a recipe for a specific user
 */
router.post('/:id/recipes', authenticationService.paramIsEqualToSessionUser('id'), validate({
    query: validation_schema.Empty,
    body: validation_schema_recipe.Recipe_Body
}), function (req, res, next) {
    // Check if user can still publish recipes or if his limit is reached.
    const language = req.cookies.language;
    marketplaceCore.getRecipesForUser(language, req.params['id'], req.user.token.accessToken, function (err, recipes) {
        if (err) {
            return next(err);
        }
        marketplaceCore.getActivatedLicenseCountForUser(req.params['id'], req.user.token.accessToken, function (err, activatedLicenses) {
            if (err) {
                return next(err);
            }

            const limit = recipeLimitService.calculateRecipeLimit(activatedLicenses);

            if (recipes.length >= limit) {
                logger.info('Recipe limit reached. Only a maximum of ' + limit + ' recipes is allowed per user.');
                res.status(400);
                return res.send('Sie haben bereits ihr Limit von ' + limit + ' Rezepten am Marktplatz erreicht.');
            }

            // Save recipe for user
            const recipe = req.body;

            // recipe information for further processing
            const name = recipe['name'].trim();
            const description = recipe['description'].trim();
            const licenseFee = recipe['licenseFee'];

            // check metadata
            let valid = true;
            let validText;
            if (!name || name.length < 1) {
                logger.warn('Submitted recipe: Name is missing');
                validText = 'Name fehlt.';
                valid = false;
            }
            if (!description || description.length < 1) {
                logger.warn('Submitted recipe: Description is missing');
                validText = 'Beschreibung fehlt.';
                valid = false;
            }
            if (!licenseFee) {
                logger.warn('Submitted recipe: License Fee is missing');
                validText = 'Lizenzgebühr fehlt.';
                valid = false;
            }

            if (!valid) {
                logger.warn('Submitted recipe: Invalid metadata');
                res.status(400);
                return res.send('Ungültige Metadaten: ' + validText);
            }

            // check total amount
            let totalAmount = 0;
            let totalPause = 0;
            const minTotalAmount = 90;
            const maxTotalAmount = 130;
            const maxTotalPause = 5001;
            
            const machineProgram = recipe['program'];
            const lines = machineProgram['recipe']['lines'];
            var ingredients = {};
            lines.forEach(function (line) {
                const components = line['components'];
                totalPause += line['sleep'];
                components.forEach(function (component) {
                    totalAmount += component['amount'];
                    if (component['ingredient']) {
                        ingredients[component['ingredient']] = ingredients[component['ingredient']] + 1;
                    } else {
                        ingredients[component['ingredient']] = 1;
                    }
                });
            });

            const componentIds = Object.keys(ingredients);

            if (totalAmount > maxTotalAmount) {
                logger.warn('Submitted program exceeding max total amount size');
                validText = 'Maximal-Menge (' + maxTotalAmount + ') überschritten';
                valid = false;
            }

            if (totalAmount < minTotalAmount) {
                logger.warn('Submitted program is less than min total amount');
                validText = 'Minimal-Menge (' + minTotalAmount + ') unterschritten';
                valid = false;
            }

            if (totalPause > maxTotalPause) {
                logger.warn('Submitted program exceeding max total pause size');
                validText = 'Maximale Pausenlänge (' + maxTotalPause + ') überschritten';
                valid = false;
            }

            if (!valid) {
                logger.warn('Submitted program not valid.');
                res.status(400);
                return res.send('Ungültiges Rezept: ' + validText);
            }

            let encryptedProgram;
            // Encrypt the recipe using our own encryption before passing it to the marketplace core
            try {
                const machineProgramString = JSON.stringify(machineProgram);
                encryptedProgram = encryption.encryptData(machineProgramString);
            }
            catch (err) {
                return res.sendStatus(500);
            }

            const coreData = {};

            coreData.technologyDataName = name;
            coreData.technologyData = encryptedProgram;
            coreData.technologyDataDescription = description;
            coreData.technologyUUID = CONFIG.TECHNOLOGY_UUID;
            coreData.licenseFee = licenseFee;
            coreData.componentList = componentIds;
            coreData.backgroundColor = recipe.backgroundColor;
            coreData.image = recipe.imageRef ? imageService.loadImage(recipe.imageRef + '.svg'): undefined;

            marketplaceCore.saveRecipeForUser(req.user.token, coreData, function (err, recipeId) {
                if (err && err.statusCode === 409) {
                    res.status(409);
                    return res.send('Ein Rezept mit diesem Namen existiert bereits.')
                }

                if (err) {
                    return next(err);
                }

                const fullUrl = helper.buildFullUrlFromRequest(req);
                res.set('Location', fullUrl + 'recipes/' + recipeId);
                res.sendStatus(201);
            });

        });
    });
});

/**
 * Retrieves the user image
 */
router.get('/:user_id/image', authenticationService.paramIsEqualToSessionUser('user_id'), validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    authService.getImageForUser(req.params['user_id'], req.user.token, function (err, data) {
        if (err) {
            next(err);
            return;
        }

        if (!data) {
            res.sendStatus(404);
            return;
        }

        res.set('Content-Type', data.contentType);
        res.send(data.imageBuffer);
    });
});
router.put('/:user_id/image', authenticationService.paramIsEqualToSessionUser('user_id'), validate({
    query: validation_schema.Empty
}), function (req, res, next) {
    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});


router.use('/:user_id/recipes', authenticationService.paramIsEqualToSessionUser('user_id'), require('./recipes'));
router.use('/:id/reports', authenticationService.paramIsEqualToSessionUser('id'), require('./user_reports'));
router.use('/:id/vault', authenticationService.paramIsEqualToSessionUser('id'), require('./vault'));

module.exports = router;
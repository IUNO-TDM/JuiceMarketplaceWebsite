/**
 * Created by beuttlerma on 05.07.17.
 */

const express = require('express');
const router = express.Router();
const marketplaceCore = require('../adapter/marketplace_core_adapter');
const authService = require('../adapter/auth_service_adapter');
const programConverter = require('../services/program_converter');
const logger = require('../global/logger');
const helper = require('../services/helper_service');
const encryption = require('../services/encryption_service');
const recipeLimit = require('../services/recipe_limit_service');

const CONFIG = require('../config/config_loader');

const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/users_schema');
const validation_schema_recipe = require('../schema/recipe_schema');

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
router.get('/:id', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {

    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});


/**
 * Returns the limit of recipes the user can publish on the marketplace
 */
router.get('/:id/recipes/limit', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    marketplaceCore.getActivatedLicenseCountForUser(req.params['id'], req.user.token.accessToken, function (err, activatedLicenses) {
        if (err) {
            return next(err);
        }

        return res.json({limit: recipeLimit.calculateRecipeLimit(activatedLicenses)});

    });
});
/**
 * Returns the amount of recipes the user already published on the marketplace
 */
router.get('/:id/recipes/count', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    marketplaceCore.getRecipesForUser(req.params['id'], req.user.token.accessToken, function (err, recipes) {
        if (err) {
            return next(err);
        }
        return res.json({count: recipes.length});
    });
});
/**
 * Saves a recipe for a specific user
 */
router.post('/:id/recipes', validate({
    query: validation_schema.Empty,
    body: validation_schema_recipe.Recipe_Body
}), function (req, res, next) {
    logger.debug("[routes/users] Creating following recipe:");
    logger.debug(req.body);
    // Check if user can still publish recipes or if his limit is reached.
    marketplaceCore.getRecipesForUser(req.params['id'], req.user.token.accessToken, function (err, recipes) {
        if (err) {
            return next(err);
        }
        if (recipes.length >= CONFIG.RECIPE_LIMIT_PER_USER) {
            logger.warn('Recipe limit reached for user');
            res.status(400);
            return res.send('Recipe limit reached. Only a maximum of ' + CONFIG.RECIPE_LIMIT_PER_USER + ' recipes is allowed per user.');
        }

        const minPhaseAmount = 10;
        const minTotalAmount = 99;
        const maxTotalAmount = 121;
        const maxTotalPause = 5001;

        // Save recipe for user
        const recipe = req.body;
        const program = recipe['program'];

        // recipe information for further processing
        const title = recipe['title'].trim();
        const description = recipe['description'].trim();
        const licenseFee = recipe['license-fee'];
        const machineProgram = programConverter.convertProgramToMachineProgram(program);
        const machineProgramString = JSON.stringify(machineProgram);

        // check metadata
        var valid = true;
        var validText;
        if (!title || title.length < 1) {
            logger.warn('Submitted recipe: Title is missing');
            validText = 'Titel fehlt.';
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
        var totalAmount = 0;
        var totalPause = 0;

        var lines = machineProgram['recipe']['lines'];
        lines.forEach(function (line) {
            var components = line['components'];
            totalPause += line['sleep'];
            components.forEach(function (component) {
                var amount = component['amount'];
                totalAmount += amount;
            });
        });

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

        const componentsIds = [];
        program['sequences'].forEach(function (sequence) {
            componentsIds.push(sequence['ingredient-id']);
        });

        var encryptedProgram;
        // Encrypt the recipe using our own encryption before passing it to the marketplace core
        try {
            encryptedProgram = encryption.encryptData(machineProgramString);
        }
        catch (err) {
            return res.sendStatus(500);
        }

        const coreData = {};

        coreData.technologyDataName = title;
        coreData.technologyData = encryptedProgram;
        coreData.technologyDataDescription = description;
        coreData.technologyUUID = CONFIG.TECHNOLOGY_UUID;
        coreData.licenseFee = licenseFee * 100000;
        coreData.componentList = componentsIds;

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

/**
 * Retrieves the user image
 */
router.get('/:user_id/image', validate({
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
router.put('/:user_id/image', validate({
    query: validation_schema.Empty
}), function (req, res, next) {
    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});


router.use('/:user_id/recipes', require('./recipes'));
router.use('/:id/reports', require('./user_reports'));
router.use('/:id/vault', require('./vault'));


module.exports = router;
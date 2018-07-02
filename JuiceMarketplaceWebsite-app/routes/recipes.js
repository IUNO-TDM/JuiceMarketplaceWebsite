const express = require('express');
const router = express.Router({mergeParams: true});
const marketplaceCore = require('../adapter/marketplace_core_adapter');
const logger = require('../global/logger');
const helper = require('../services/helper_service');

const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/recipe_schema');

/**
 * get all recipes
 */
router.get('/', validate({
    query: validation_schema.Recipe_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    const components = req.query['components'];
    let createdBy = req.query['createdBy'];
    if(req.params['user_id']){
        createdBy = req.params['user_id'];
    }
    const limit = req.query['limit'];
    const orderedBy = req.query['orderBy'];

    const params = {};

    if (components) {
        params['components'] = components;
    }

    if (createdBy) {
        params['ownerUUID'] = createdBy;
    }

    var language = req.cookies.language;
    marketplaceCore.getAllRecipes(language, req.user.token, params, function (err, recipes) {
        if (err) {
            return next(err);
        }

        switch (orderedBy) {
            case 'alphASC':
                recipes.sort(function(a,b) {
                    const nameA = a.title.toUpperCase(); // ignore upper and lowercase
                    const nameB = b.title.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    // names are equal
                    return 0;
                });
                break;
            case 'alphDESC':
                recipes.sort(function(a,b) {
                    const nameA = a.title.toUpperCase(); // ignore upper and lowercase
                    const nameB = b.title.toUpperCase(); // ignore upper and lowercase
                    if (nameA > nameB) {
                        return -1;
                    }
                    if (nameA < nameB) {
                        return 1;
                    }

                    // names are equal
                    return 0;
                });
                break;
            case 'random':
                recipes = helper.shuffleArray(recipes);
                break;
            case 'ratingASC':
                logger.warn('[routes/recipes] ratingASC not implemented yet');
                break;
            case 'ratingDESC':
                logger.warn('[routes/recipes] ratingDESC not implemented yet');
                break;
            default:
                break;
        }

        if (limit && recipes.length > limit) {
            recipes = recipes.slice(0, limit-1)
        }

        res.send(recipes);
    });

});


router.get('/licenses/count', validate({
    query: validation_schema.License_Count_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});

router.get('/licenses/total', validate({
    query: validation_schema.License_Total_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});

router.get('/licenses/total/history', validate({
    query: validation_schema.License_History_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});

router.get('/:recipe_id', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});

router.put('/:recipe_id', validate({
    query: validation_schema.Empty,
    body: validation_schema.Recipe_Body
}), function (req, res, next) {
    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});

router.delete('/:recipe_id', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    marketplaceCore.deleteRecipe(req.user.token, req.params['recipe_id'], function (err, data) {
        if (err) {
            return next(err);
        }
        res.sendStatus(200);
    });
});

router.get('/:recipe_id/licenses/count', validate({
    query: validation_schema.Recipe_License_Count_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});


router.get('/:recipe_id/licenses/count/history', validate({
    query: validation_schema.Recipe_License_History_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});

router.get('/:recipe_id/image', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});

router.put('/:recipe_id/image', validate({
    query: validation_schema.Empty
}), function (req, res, next) {
    logger.warn('[routes/recipes] NOT IMPLEMENTED YET');
    res.send('NOT IMPLEMENTED YET');
});


module.exports = router;
const express = require('express');
const router = express.Router();
const marketplaceCore = require('../adapter/marketplace_core_adapter');
const authService = require('../adapter/auth_service_adapter');

const Validator = require('express-json-validator-middleware').Validator;
const validator = new Validator({
    allErrors: true
});
const validate = validator.validate;
const validation_schema = require('../schema/recipe_schema');

router.get('/', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {

    authService.getPublicToken(function (err, token) {
        if (err) {
            return next(err);
        }
        const params = {
            lang: req.cookies.language
        };

        marketplaceCore.getAllTechnologyData(
            token, params,
            function (err, data) {
                if (err) {
                    return next(err);
                }

                res.json(data);
            })
    });
});
router.get('/:tech_id', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {

    authService.getPublicToken(function (err, token) {
        if (err) {
            return next(err);
        }

        const params = {
            lang: req.cookies.language
        };

        marketplaceCore.getTechnologyDataById(
            req.params['tech_id'],
            token, params,
            function (err, data) {
                if (err) {
                    return next(err);
                }

                res.json(data);
            })
    });
});

router.get('/:tech_id/image', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {

    authService.getPublicToken((err, token) => {
        marketplaceCore.getImageForId(req.params['tech_id'], token, (err, data) => {
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
    })
});

module.exports = router;
const express = require('express');
const router = express.Router();
const marketplaceCore = require('../adapter/marketplace_core_adapter');
const authService = require('../adapter/auth_service_adapter');

const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/reports_schema');

router.get('/revenue', validate({
    query: validation_schema.Revenue_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    authService.getPublicToken(function (err, token) {
        if (err) {
            return next(err);
        }

        marketplaceCore.getTotalRevenue(
            req.query['from'],
            req.query['to'],
            req.query['detail'],
            token, function (err, data) {
                if (err) {
                    return next(err);
                }

                res.json(data);
            })
    });
});

router.get('/recipes/history', validate({
    query: validation_schema.History_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    authService.getPublicToken(function (err, token) {
        if (err) {
            return next(err);
        }

        marketplaceCore.getTechnologyDataHistory(
            req.query['from'],
            req.query['to'],
            token, function (err, data) {
                if (err) {
                    return next(err);
                }

                res.json(data);
            })
    });
});

router.get('/recipes/top', validate({
    query: validation_schema.Top_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    authService.getPublicToken(function (err, token) {
        if (err) {
            return next(err);
        }

        marketplaceCore.getTopTechnologyData(
            req.query['from'],
            req.query['to'],
            parseInt(req.query['limit']),
            token, function (err, data) {
                if (err) {
                    return next(err);
                }

                res.json(data);
            })
    });
});

router.get('/components/top', validate({
    query: validation_schema.Top_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    var language = req.cookies.language;
    authService.getPublicToken(function (err, token) {
        if (err) {
            return next(err);
        }

        marketplaceCore.getTopComponents(
            language,
            req.query['from'],
            req.query['to'],
            parseInt(req.query['limit']),
            token, function (err, data) {
                if (err) {
                    return next(err);
                }

                res.json(data);
            })
    });
});

module.exports = router;

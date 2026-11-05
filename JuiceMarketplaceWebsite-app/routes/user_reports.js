const express = require('express');
const router = express.Router({mergeParams: true});
const marketplaceCore = require('../adapter/marketplace_core_adapter');

const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/user_reports_schema');

router.get('/recipes/top', validate({
    query: validation_schema.Top_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    var token = req.user.token;

    marketplaceCore.getTopTechnologyDataForUser(
        req.params['id'],
        token['accessToken'],
        req.query['from'],
        req.query['to'],
        parseInt(req.query['limit']),
        token, function (err, recipes) {
            if (err) {
                return next(err);
            }
            res.send(recipes);
        });
});


module.exports = router;

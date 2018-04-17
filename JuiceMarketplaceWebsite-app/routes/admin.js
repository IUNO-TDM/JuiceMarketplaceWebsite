const express = require('express');
const router = express.Router({mergeParams: true});
const marketplaceCore = require('../adapter/marketplace_core_adapter');

const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/admin_schema');

router.get('/protocols', validate({
    query: validation_schema.Protocols_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    const token = req.user.token;

    marketplaceCore.getProtocols(
        req.query['eventType'],
        req.query['clientId'],
        req.query['from'],
        req.query['to'],
        req.query['limit'],
        token['accessToken'],
        function (err, protocols) {
            if (err) {
                return next(err);
            }
            res.json(protocols);
        });
});

router.get('/protocols/last', validate({
    query: validation_schema.Protocols_Last_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    const token = req.user.token;

    marketplaceCore.getLastProtocolForEachClient(
        req.query['eventType'],
        req.query['from'],
        req.query['to'],
        token['accessToken'],
        function (err, protocols) {
            if (err) {
                return next(err);
            }
            res.json(protocols);
        });
});

module.exports = router;
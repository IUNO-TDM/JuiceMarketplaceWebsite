/**
 * Created by beuttlerma on 05.07.17.
 */

const express = require('express');
const router = express.Router();
const authService = require('../adapter/auth_service_adapter');

const CONFIG = require('../config/config_loader');

const Validator = require('express-json-validator-middleware').Validator;
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/clients_schema');

/**
 * Retrieves the user information for a specific user
 */
router.get('/:id', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {

    authService.getClient(req.params['id'], (err, client) => {
        if (err) {
            return next(err);
        }

        res.json(client);
    });
});

module.exports = router;
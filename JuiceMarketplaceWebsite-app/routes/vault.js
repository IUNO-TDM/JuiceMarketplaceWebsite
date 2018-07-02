const express = require('express');
const router = express.Router({mergeParams: true});
const marketplaceCore = require('../adapter/marketplace_core_adapter');
const authenticationService = require('../services/authentication_service');

const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/vault_schema');

router.get('/balance', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    const token = req.user.token;
    marketplaceCore.getCumulatedVaultBalanceForUser(req.params['id'], token['accessToken'], function (err, income) {
        if (err) {
            return next(err);
        }

        if (!income) {
            return res.sendStatus(404);
        }
        res.send(income.toString());
    });
});

router.get('/wallets', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    const token = req.user.token;
    marketplaceCore.getVaultWalletsForUser(req.params['id'], token['accessToken'], function (err, wallets) {
        if (err) {
            return next(err);
        }
        res.send(wallets);
    });
});

router.get('/wallets/:walletId', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    const token = req.user.token;
    marketplaceCore.getVaultWalletForUserAndWalletId(req.params['id'], req.params['walletId'], token['accessToken'], function (err, wallet) {
        if (err) {
            return next(err);
        }
        res.send(wallet);
    });
});

router.post('/wallets/:walletId/payouts', validate({
    query: validation_schema.Empty,
    body: validation_schema.Payout_Body
}), function (req, res, next) {
    const token = req.user.token;
    marketplaceCore.createVaultPayoutForUser(req.params['id'], req.params['walletId'], token['accessToken'], req.body, function (err, payout) {
        if (err) {
            return next(err);
        }
        res.send(payout);
    })
});

router.post('/wallets/:walletId/payouts/check', validate({
    query: validation_schema.Empty,
    body: validation_schema.Payout_Body
}), function (req, res, next) {
    const token = req.user.token;
    marketplaceCore.checkVaultPayoutForUser(req.params['id'], req.params['walletId'], token['accessToken'], req.body, function (err, payoutcheck) {
        if (err) {
            return next(err);
        }
        res.send(payoutcheck);
    })
});


module.exports = router;
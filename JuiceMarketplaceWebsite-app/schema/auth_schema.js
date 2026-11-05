const self = {};

self.Empty = {
    type: 'object',
    properties: {},
    additionalProperties: false
};

// Keycloak adds further parameters (session_state, iss, state, ...)
self.IUNO_Callback_Query = {
    type: 'object',
    properties: {
        code: {
            type: 'string'
        }
    },
    required: ['code'],
    additionalProperties: true
};

module.exports = self;
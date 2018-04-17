/**
 * Created by beuttlerma on 27.03.18.
 */

const self = {};

self.Empty = {
    type: 'object',
    properties: {},
    additionalProperties: false
};

self.Protocols_Query = {
    type: 'object',
    properties: {
        eventType: {
            type: 'string',
            maxLength: 50
        },
        from: {
            type: 'string',
            format: 'date-time'
        },
        to: {
            type: 'string',
            format: 'date-time'
        },
        clientId: {
            type: 'string',
            format: 'uuid'
        },
        limit: {
            type: 'integer'
        }
    },
    additionalProperties: false,
    required: [
        'eventType', 'from', 'to'
    ]
};

self.Protocols_Last_Query = {
    type: 'object',
    properties: {
        eventType: {
            type: 'string',
            maxLength: 50
        },
        from: {
            type: 'string',
            format: 'date-time'
        },
        to: {
            type: 'string',
            format: 'date-time'
        }
    },
    additionalProperties: false,
    required: [
        'eventType', 'from', 'to'
    ]
};

module.exports = self;
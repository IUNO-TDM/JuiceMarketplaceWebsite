/**
 * Created by beuttlerma on 09.02.17.
 */

const self = {};

self.Empty = {
    type: 'object',
    properties: {},
    additionalProperties: false
};

self.Recipe_Query = {
    type: 'object',
    properties: {
        createdBy: {
            type: 'string',
            format: 'uuid'
        },
        orderBy: {
            type: 'string',
            enum: ['alphASC', 'alphDESC', 'random', 'ratingASC', 'ratingDESC']
        },
        limit: {
            type: 'integer',
            minimum: 1
        },
        components: {
            type: 'array',
            items: {
                type: 'string',
                format: 'uuid'
            },
            additionalItems: false
        }
    },
    required: [],
    additionalProperties: false
};

self.Recipe_Image_Body = {
    type: 'object',
    properties: {
        image: {
            type: 'string',
            pattern: '^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$'
        }
    },
    required: ['image'],
    additionalProperties: false
};

self.Recipe_Body = {
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 1,
            maxLength: 250
        },
        description: {
            type: "string",
            minLength: 1,
            maxLength: 30000
        },
        program: {
            type: "object",
            properties: {
                "recipe": {
                    type: "object",
                    properties: {
                        "lines": {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    "sleep": {
                                        type: "integer",
                                        minimum: 0,
                                        maximum: 0
                                    },
                                    "timing": {
                                        type: "integer",
                                        minimum: 2,
                                        maximum: 2
                                    },
                                    "components": {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                "amount": {
                                                    type: "integer",
                                                    minimum: 1,
                                                    maximum: 100
                                                },
                                                "ingredient": {
                                                    type: "string",
                                                    format: "uuid"
                                                }
                                            },
                                            required: ["amount", "ingredient"],
                                            additionalProperties: false
                                        },
                                        maxItems: 8,
                                        additionalItems: false
                                    }
                                },
                                required: ["sleep", "timing", "components"],
                                additionalProperties: false
                            },
                            maxItems: 8,
                            additionalItems: false
                        }
                    },
                    required: ["lines"],
                    additionalProperties: false
                },
            },
            required: ["recipe"],
            additionalProperties: false
        },
        imageRef: {
            type: 'string',
            maxLength: 10,
            minLength: 1
        },
        backgroundColor: {
            type: 'string',
            maxLength: 9,
            pattern: '^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$'
        }
    },
    required: ['name', 'description', 'program'],
    additionalProperties: false
};

module.exports = self;
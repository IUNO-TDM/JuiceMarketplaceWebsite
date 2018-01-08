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

self.License_Count_Query = {
    type: 'object',
    properties: {
        createdBy: {
            type: 'string',
            format: 'uuid'
        },
        components: {
            type: 'array',
            items: {
                type: 'string',
                format: 'uuid'
            },
            additionalItems: false
        },
        orderBy: {
            type: 'string',
            enum: ['alphASC', 'alphDESC', 'random', 'ratingASC', 'ratingDESC']
        },
        startDate: {
            type: 'string',
            format: 'date-time'
        },
        endDate: {
            type: 'string',
            format: 'date-time'
        }
    },
    required: [],
    additionalProperties: false
};

self.License_Total_Query = {
    type: 'object',
    properties: {
        createdBy: {
            type: 'string',
            format: 'uuid'
        },
        components: {
            type: 'array',
            items: {
                type: 'string',
                format: 'uuid'
            },
            additionalItems: false
        },
        startDate: {
            type: 'string',
            format: 'date-time'
        },
        endDate: {
            type: 'string',
            format: 'date-time'
        }
    },
    required: [],
    additionalProperties: false
};

self.License_History_Query = {
    type: 'object',
    properties: {
        createdBy: {
            type: 'string',
            format: 'uuid'
        },
        components: {
            type: 'array',
            items: {
                type: 'string',
                format: 'uuid'
            },
            additionalItems: false
        },
        startDate: {
            type: 'string',
            format: 'date-time'
        },
        endDate: {
            type: 'string',
            format: 'date-time'
        },
        interval: {
            type: 'string',
            enum: ['minute', 'hour', 'day', 'week', 'month', 'year']
        }
    },
    required: [],
    additionalProperties: false
};

self.Recipe_License_Count_Query = {
    type: 'object',
    properties: {
        startDate: {
            type: 'string',
            format: 'date-time'
        },
        endDate: {
            type: 'string',
            format: 'date-time'
        }
    },
    required: [],
    additionalProperties: false
};

self.Recipe_License_History_Query = {
    type: 'object',
    properties: {
        startDate: {
            type: 'string',
            format: 'date-time'
        },
        endDate: {
            type: 'string',
            format: 'date-time'
        },
        interval: {
            type: 'string',
            enum: ['minute', 'hour', 'day', 'week', 'month', 'year']
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
        title: {
            type: "string",
            minLength: 1,
            maxLength: 250
        },
        description: {
            type: "string",
            minLength: 1,
            maxLength: 30000
        },
        "license-fee": {
            type: "integer",
            minimum: 0,
            maximum: 2000
        },
        program: {
            type: "object",
            properties: {
                "amount-per-millisecond": {
                    type: "number",
                    minimum: 0.001,
                    maximum: 1
                },
                sequences: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            "ingredient-id": {
                                type: "string",
                                format: "uuid"
                            },
                            phases: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        start: {
                                            type: "integer",
                                            minimum: 0,
                                            maximum: 1000
                                        },
                                        amount: {
                                            type: "integer",
                                            minimum: 1,
                                            maximum: 1000
                                        },
                                        throughput: {
                                            type: "integer",
                                            minimum: 1,
                                            maximum: 100
                                        }
                                    },
                                    required: ['start', 'amount', 'throughput'],
                                    additionalProperties: false
                                },
                                additionalItems: false
                            }
                        },
                        required: ['ingredient-id', 'phases'],
                        additionalProperties: false
                    }
                }
            },
            required: ['amount-per-millisecond', 'sequences'],
            additionalProperties: false
        }
    },
    required: ['title', 'description', 'license-fee', 'program'],
    additionalProperties: false
};

module.exports = self;
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const logger = require('../global/logger');
const io = require('socket.io-client');
const config = require('../config/config_loader');
const authServer = require('../adapter/auth_service_adapter');

var VisualizationService = function () {
    const self = this;
    this.refreshTokenAndReconnect = function () {
        // authServer.invalidateToken();
        // authServer.getPublicToken(function (err, token) {
        //     if (err) {
        //         logger.warn(err);
        //     }
        //     if (self.socket) {
        //         self.socket.io.opts.extraHeaders = {
        //             Authorization: 'Bearer ' + (token ? token.accessToken : '')
        //         };
        //         self.socket.io.disconnect();
        //         self.socket.connect();
        //     }
        // });
    };
};

var visualization_service = new VisualizationService();
util.inherits(VisualizationService, EventEmitter);

visualization_service.socket = io.connect('http://' + config.HOST_SETTINGS.MARKETPLACE_CORE.HOST
    + ":" + config.HOST_SETTINGS.MARKETPLACE_CORE.PORT + "/visualization", {
    transports: ['websocket'],
    extraHeaders: {},
    autoConnect: false
});

var patch = require('socketio-wildcard')(io.Manager);
patch(visualization_service.socket);

visualization_service.socket.on('connect', function () {
    logger.info("[visualization_service] connected to visualization SocketIO at Marketplace");
});

visualization_service.socket.on('error', function (error) {
    logger.debug("[visualization_service] Error: " + error);

    visualization_service.refreshTokenAndReconnect();
});


visualization_service.socket.on('connect_failed', function (error) {
    logger.debug("[visualization_service] Connection Failed: " + error);
});

visualization_service.socket.on('connect_error', function (error) {
    logger.warn("[visualization_service] Connection Error: " + error);
});

visualization_service.socket.on('reconnect_error', function (error) {
    logger.debug("[visualization_service] Re-Connection Error: " + error);
});

visualization_service.socket.on('reconnect_attempt', function (number) {
    logger.debug("[visualization_service] Re-Connection attempt: " + number);
});

visualization_service.socket.on('disconnect', function () {
    logger.info("[visualization_service] disconnected from visualization SocketIO at Marketplace");
});

visualization_service.socket.on('*', function(event){
    visualization_service.emit('visualization',event.data[0],event.data[1]);
});



visualization_service.socket.open();

module.exports = visualization_service;
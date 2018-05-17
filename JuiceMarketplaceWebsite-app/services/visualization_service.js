const EventEmitter = require('events').EventEmitter;
const util = require('util');
const logger = require('../global/logger');
const io = require('socket.io-client');
const config = require('../config/config_loader');

var VisualizationService = function (token) {

    var self = this;
    this.socket = io.connect('http://' + config.HOST_SETTINGS.MARKETPLACE_CORE.HOST
        + ":" + config.HOST_SETTINGS.MARKETPLACE_CORE.PORT + "/visualization", {
        transports: ['websocket'],
        extraHeaders: {Authorization: 'Bearer ' + (token ? token.accessToken : '')}
    });

    var patch = require('socketio-wildcard')(io.Manager);
    patch(this.socket);

    this.socket.on('connect', function () {
        logger.info("[visualization_service] connected to visualization SocketIO at Marketplace for user " + token.user);
    });

    this.socket.on('error', function (error) {
        logger.debug("[visualization_service] Error for user  " + token.user + " : " + error);
    });
    this.socket.on('connect_failed', function (error) {
        logger.debug("[visualization_service] Connection for user  " + token.user + " :" + error);
    });
    this.socket.on('connect_error', function (error) {
        logger.warn("[visualization_service] Connection Error for user " + token.user + " : " + error);
    });
    this.socket.on('reconnect_error', function (error) {
        logger.debug("[visualization_service] Re-Connection Error for user " + token.user + " : " + error);
    });
    this.socket.on('reconnect_attempt', function (number) {
        logger.debug("[visualization_service] Re-Connection attempt for user " + token.user + " : " + number);
    });
    this.socket.on('disconnect', function () {
        logger.info("[visualization_service] disconnected from visualization SocketIO at Marketplace");
    });
    this.socket.on('*', function (event) {
        if(self.event){
            self.event(event.data[0], event.data[1]);
        }
    });

    this.connect = function () {
        this.socket.open();
    };
    this.disconnect = function () {
        this.socket.close();
    };
    this.event = null;
};


module.exports = VisualizationService;
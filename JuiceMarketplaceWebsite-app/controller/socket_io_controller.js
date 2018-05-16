const logger = require('../global/logger');
const passport_socket_io = require('../oauth/passport_socketio');
// const visualization_service = require('../services/visualization_service');

const passport = require('passport');

function onIOVisualizationConnect(socket) {
    var userId = socket.request.session.passport.user;
    console.log("Your User ID is", userId);
    logger.debug('Client for Visualization Updates connected.' + socket.id);
}

module.exports = function (io) {
    // io.use(function(socket,next){
    //     passport.session(socket.request,{},next);
    // });
    var namespace = io.of('/visualization');

    // Enable bearer token security for websocket server
    namespace.use(passport_socket_io.authorize());
    namespace.on('connection', onIOVisualizationConnect);
    // registerVisualizationEvents(namespace);

};

function registerVisualizationEvents(namespace) {
    // visualization_service.on('*', function (event, data) {
    //     namespace.emit(event, data);
    // })
    // visualization_service.on('visualization', function (event, data ) {
    //     namespace.emit(event, data);
    // })

}
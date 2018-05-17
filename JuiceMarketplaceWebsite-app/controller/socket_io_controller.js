const logger = require('../global/logger');
const passport_socket_io = require('../oauth/passport_socketio');
const VisualizationService = require('../services/visualization_service');

function onIOVisualizationConnect(socket) {
    logger.debug('Client for Visualization Updates connected.' + socket.id);

    const visSocket = new VisualizationService(socket.token);
    visSocket.event = function (event, data) {
        socket.emit(event, data);
    };
    visSocket.connect();

    socket.on('disconnect', function () {
        visSocket.disconnect();
    });
}

module.exports = function (io) {
    var namespace = io.of('/visualization');
    namespace.use(passport_socket_io.authorize());
    namespace.on('connection', onIOVisualizationConnect);
};

module.exports = (server, modules) => {
    server.use(modules.express.static(__dirname + '/dist/'));
};
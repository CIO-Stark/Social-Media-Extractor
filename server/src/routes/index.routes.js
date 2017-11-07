module.exports = (props) => {

    require('./twitter')(props);
    require('./facebook')(props);

    // health
    props.server.get('/', (req, res) => {
        res.send({
            status: true
        });
    });
};
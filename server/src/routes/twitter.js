const source = 'twitter';

module.exports = (props) => {
    //load all users
    props.server.get('/twitter/load', (req, res) => {

        let load = props.helpers.cloudant(props, source).load;
        let loadCrawling = props.helpers.cloudant(props, source).loadCrawling;
        let promises = [];
        promises.push(load());
        promises.push(loadCrawling());
        Promise.all(promises).then(function (response) {
            //array: [0] = load response
            //array: [1] = loadCrawling response

            response[0][0].rows.forEach((entity) => {
                response[1][0].rows.some((crawling) => {
                    if (entity.doc._id === crawling.doc._id) {
                        entity.crawling = true;
                        return true
                    } else {
                        entity.crawling = false;
                    }
                });
            }, this);

            res.send({ status: true, data: response[0][0] });

        }).catch(function (error) {
            console.error(error);
            res.send({ status: false, data: error });
        });
    });

    props.server.post('/twitter/create', (req, res) => {
        let data = props.parsers.twitter.validateCreate(req.body);

        if (data) {
            let create = props.helpers.cloudant(props, source).create;
            create(data).then((response) => {
                res.send({ status: true, data: response });
            }).catch((error) => {
                console.error('Error: ', error);
                res.send({ status: false, data: error });
            });
        } else {
            res.send({ status: false, data: "The request doesn't have entity property, that is required" });
        }

    });

    props.server.put('/twitter/update', (req, res) => {
        let data = props.parsers.twitter.validateUpdate(req.body);

        if (data) {
            let update = props.helpers.cloudant(props, source).create;
            update(data).then((response) => {
                res.send({ status: true, data: response });
            }).catch((error) => {
                console.error('Error: ', error);
                res.send({ status: false, data: error });
            });
        } else {
            res.send({ status: false, data: "" });
        }

    });

    props.server.delete('/twitter/remove', (req, res) => {
        let data = props.parsers.twitter._id_rev(req.body);
        if (data) {
            let remove = props.helpers.cloudant(props, source).remove;
            remove(data).then((response) => {
                res.send({ status: true, data: response });
            }).catch((error) => {
                console.error('Error: ', error);
                res.send({ status: false, data: error });
            });
        } else {
            res.send({ status: false, data: "" });
        }

    });

    props.server.get('/twitter/data/:entity', (req, res) => {
        let entity = req.params.entity;
        let selectors = {
            "selector": {
                "_id": {
                    "$gt": null
                },
                "content": {
                    "$regex": "(?i)" + entity
                }
            }
        };
        let loadData = props.helpers.cloudant(props, source).loadData;
        loadData(selectors).then((response) => {
            res.send({ status: true, data: response });
        }).catch((error) => {
            console.error('Error: ', error);
            res.send({ status: false, data: error });
        });

    });

    props.server.post('/twitter/start', (req, res) => {
        let data = props.parsers.twitter._id(req.body);

        if (data) {
            let parsedData = props.parsers.twitter.startParse(data);
            let start = props.helpers.cloudant(props, source).start;
            start(parsedData).then((response) => {
                res.send({ status: true, data: response });
            }).catch((error) => {
                console.error('Error: ', error);
                res.send({ status: false, data: error });
            });
        } else {
            res.send({ status: false, data: "" });
        }

    });

    props.server.delete('/twitter/stop', (req, res) => {
        let data = props.parsers.twitter._id(req.body);
        if (data) {
            let get = props.helpers.cloudant(props, source).get;
            get(data).then((resp) => {
                data._rev = resp._rev;
                let stop = props.helpers.cloudant(props, source).stop;
                stop(data).then((response) => {
                    res.send({ status: true, data: response });
                }).catch((error) => {
                    console.error('Error: ', error);
                    res.send({ status: false, data: error });
                });
            }).catch((error) => {
                console.error('Error: ', error);
                res.send({ status: false, data: error });
            });
        } else {
            res.send({ status: false, data: "" });
        }

    });

}
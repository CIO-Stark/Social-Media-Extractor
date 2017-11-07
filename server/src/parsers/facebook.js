const myEnv = require('schema')('envIdentifier');

module.exports = function () {
    let validateCreate = (data) => {

        let createSchema = require('../schemas/facebook.create');
        let schema = myEnv.Schema.create(createSchema);

        var validation = schema.validate(data);
        if (validation.errors.length === 0) {
            return validation.instance;
        } else {
            return false
        }
    }

    let validateUpdate = (data) => {

        let createSchema = require('../schemas/facebook.update');
        let schema = myEnv.Schema.create(createSchema);

        var validation = schema.validate(data);
        if (validation.errors.length === 0) {
            return validation.instance;
        } else {
            return false
        }
    }

    let _id_rev = (data) => {

        let createSchema = require('../schemas/facebook._id_rev');
        let schema = myEnv.Schema.create(createSchema);

        var validation = schema.validate(data);
        if (validation.errors.length === 0) {
            return validation.instance;
        } else {
            return false
        }
    }

    let _id = (data) => {

        let createSchema = require('../schemas/facebook._id');
        let schema = myEnv.Schema.create(createSchema);

        var validation = schema.validate(data);
        if (validation.errors.length === 0) {
            return validation.instance;
        } else {
            return false
        }
    }

    let remove_id_rev = (data) => {
        let parsedData = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var element = data[key];
                if (key === '_id') {
                    parsedData[key] = element;
                } else if (key === '_rev') {

                } else {
                    parsedData[key] = element;
                }
            }
        }
        return parsedData
    }


    let startParse = (data) => {
        let parsedData = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var element = data[key];
                if (key === '_id') {
                    parsedData[key] = element;
                }
            }
        }
        parsedData.count = 0;
        return parsedData
    }

    let dataParse = (data) => {
        var parsed = [];
        data.data.data.forEach(function (feed) {
            if (feed.hasOwnProperty("message")) {
                parsed.push({
                    '_id': feed.id,
                    'date': feed.created_time,
                    'page': data.page,
                    'tag': data.entity,
                    'subject': '',
                    'content': feed.message,
                    'author': data.page,
                    'source': 'facebook',
                    'link': "",
                    'id': feed.id,
                    'lang': ""
                });
            }
        });
        return parsed;
    }

    return {
        validateCreate: validateCreate,
        validateUpdate: validateUpdate,
        _id_rev: _id_rev,
        _id: _id,
        remove_id_rev: remove_id_rev,
        startParse: startParse,
        dataParse: dataParse
    };
}
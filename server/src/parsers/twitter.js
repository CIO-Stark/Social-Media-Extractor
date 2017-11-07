const myEnv = require('schema')('envIdentifier');

module.exports = function () {
    let validateCreate = (data) => {

        let createSchema = require('../schemas/twitter.create');
        let schema = myEnv.Schema.create(createSchema);

        var validation = schema.validate(data);
        if (validation.errors.length === 0) {
            return validation.instance;
        } else {
            return false
        }
    }

    let validateUpdate = (data) => {

        let createSchema = require('../schemas/twitter.update');
        let schema = myEnv.Schema.create(createSchema);

        var validation = schema.validate(data);
        if (validation.errors.length === 0) {
            return validation.instance;
        } else {
            return false
        }
    }

    let _id_rev = (data) => {

        let createSchema = require('../schemas/twitter._id_rev');
        let schema = myEnv.Schema.create(createSchema);

        var validation = schema.validate(data);
        if (validation.errors.length === 0) {
            return validation.instance;
        } else {
            return false
        }
    }

    let _id = (data) => {

        let createSchema = require('../schemas/twitter._id');
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

//check if tweet ios retweet
    let checkRetweet = function(text){
        let regex = new RegExp("RT", "g");
        let matches = text.match(regex);
        if(matches !== null){
            return true;
        }
        return false;
    };

    let dataParse = (data) => {
        var parsed = [];
        data.data.statuses.forEach(function (tweet) {
            if (!(tweet.hasOwnProperty('retweeted_status')) && (tweet.in_reply_to_status_id === null)) {
                if (tweet.hasOwnProperty("text") && !checkRetweet(tweet.text)) {
                    parsed.push({
                        '_id': tweet.id_str,
                        'date': tweet.created_at,
                        'tag': data.entity,
                        'subject': '',
                        'content': tweet.text,
                        'author': tweet.user.name,
                        'source': 'twitter',
                        'link': 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
                        'location': tweet.geo,
                        'lang': tweet.lang
                    });
                }
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
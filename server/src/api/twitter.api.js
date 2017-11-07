const OAuth = require('oauth');

const consumerKey = JSON.parse(process.env.TWITTER).consumerKey,
    consumerSecret = JSON.parse(process.env.TWITTER).consumerSecret,
    token = JSON.parse(process.env.TWITTER).token,
    tokenSecret = JSON.parse(process.env.TWITTER).tokenSecret;

let createQuery = props => {
    let query = '';
    if (props.entity) {
        query += 'q=' + encodeURIComponent(props.entity) + '';
    }
    if (props.from !== undefined && props.from !== "") {
        query += encodeURIComponent(' from:') + encodeURIComponent(props.from) + '';
    }
    if (props.lang !== undefined && props.lang !== "") {
        query += '&lang=' + props.lang;
    }
    query += (props.size < 100 && props.size !== 0) ? '&count=' + props.size : '&count=' + 100;
    return query
}


exports.twitterSearch = (props) => {
    let searchFilter = {
        size: props.quantity,
        from: props.profile,
        entity: props.entity,
        lang: props.lang
    };

    let oauth = new OAuth.OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        consumerKey,
        consumerSecret,
        '1.0A',
        null,
        'HMAC-SHA1'
    );
    console.log('https://api.twitter.com/1.1/search/tweets.json?' + createQuery(searchFilter) + '');

    return new Promise((resolve, reject) => {
        oauth.get(
            'https://api.twitter.com/1.1/search/tweets.json?' + createQuery(searchFilter),
            token,
            tokenSecret,
            function (error, data, response) {
                if (error) {
                    reject(error)
                } else {
                    data = JSON.parse(data);
                    resolve(data)
                }
            });
    })
};
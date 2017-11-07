module.exports = (server) => {
    const cloudantService = require('./config/cloudant.config');
    const dbs = JSON.parse(process.env.DBS);

    // app modules
    let cloudant = require('./src/helpers/cloudant');
    const schedule = require('node-schedule');

    //data parsers / validators
    let parserTwitter = require('./src/parsers/twitter');
    let parserFacebook = require('./src/parsers/facebook');

    let props = {
        server: server,
        dbs: dbs,
        helpers: {
            cloudant: cloudant
        },
        modules: {
            cloudant: cloudantService,
            schedule: schedule
        },
        parsers: {
            twitter: parserTwitter(),
            facebook: parserFacebook()
        }
    }

    // crawling services
    let twitterCrawling = require('./src/crawling/twitter.crawling');
    let facebookCrawling = require('./src/crawling/facebook.crawling');
    twitterCrawling(props);
    facebookCrawling(props);

    // set routes
    require('./src/routes/index.routes')(props)

};
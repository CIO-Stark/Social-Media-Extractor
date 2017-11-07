const dbs = JSON.parse(process.env.DBS);
const credentials = JSON.parse(process.env.COUCHDB);

let url = "http://" + credentials.username + ":" + credentials.password + "@" + credentials.url;
let nano = require("nano")(url);//nano:couchdb middleware
let prom = require("nano-promises");

nano = prom(nano);

nano.auth(credentials.username, credentials.password, function (error, response, headers) {
    if (error) {
        console.log("couch auth error", error);
    }
    else {
        // instance = nano({
        //     url: url,
        //     cookie: headers["set-cookie"]
        // });
        // console.log("couch instance loaded", response, headers);
    }
});

for (var source in dbs) {
    if (dbs.hasOwnProperty(source)) {
        var element = dbs[source];
        for (var db in element.dbs) {
            if (element.dbs.hasOwnProperty(db)) {
                let dbName = element.dbs[db];
                nano.db.create(dbName)
                    .then((response) => {
                        console.info('Database ' + dbName + ' has been created', response);
                    })
                    .catch((error) => {
                        console.info('Database ' + dbName + ' already exists', error.reason);
                    })
            }
        }
    }
}

module.exports = nano;
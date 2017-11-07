"use strict";

require('dotenv').config({ silent: true });
const compression = require("compression");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require('express');
const path = require('path');
const cfenv = require('cfenv').getAppEnv();

const server = express();

server.use(cors());
server.use(compression());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json({ limit: "100mb" }));

server.listen(cfenv.port, error => {
    if (error) {
        console.error(error);
    } else {
        console.info(`==> 🌎  Listening on port ${cfenv.port}. Url: ${cfenv.url} `);
    }
});

require("./client/server.js")(server, {
    express: express
});
require("./server/server.js")(server, {
    express: express
});
const source = 'facebook';
const api = require('../api/facebook.api');
let dataDumpster = [];

module.exports = (props) => {
    let schedule = props.modules.schedule;

    let getCrawling = () => {
        return new Promise((resolve, reject) => {
            let entitiesToCrawler = [];
            let crawling = props.helpers.cloudant(props, source).crawling;
            crawling()
                .then((response) => {
                    response[0].rows.forEach((element) => {
                        entitiesToCrawler.push(element);
                    }, this);
                    resolve(entitiesToCrawler);
                })
                .catch((erro) => {
                    console.error('Error: ', error);
                    reject(error);
                });
        });
    }

    let loadEntity = (id) => {
        return new Promise((resolve, reject) => {
            let getEntity = props.helpers.cloudant(props, source).getEntity;
            getEntity(id)
                .then((response) => {
                    resolve(response[0]);
                })
                .catch((erro) => {
                    reject(error);
                });
        });
    }

    let extractData = (filter) => {
        return new Promise((resolve, reject) => {
            api.facebookSearch(filter).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }

    let dbInsert = (feed) => {
        if (feed !== false) {
            let finalArray = [];
            if (feed.length >= 0 && feed.length <= 20000) {
                let counterArrays = 0;
                let counterResto = 0;
                let resto = feed.length % 10;
                let parte = Math.floor(feed.length / 10);
                (function () {
                    for (counterArrays; counterArrays < 10; counterArrays++) {
                        finalArray[counterArrays] = [];
                        for (let counter = 0; counter < parte; counter++) {
                            finalArray[counterArrays].push(feed.pop());
                        }
                    }
                    for (counterResto; counterResto < resto; counterResto++) {
                        finalArray[counterArrays - 1].push(feed.pop());
                    }
                })();
            }
            return new Promise((resolve, reject) => {
                let index = 0;
                let max = finalArray.length;
                for (index; index < max; index++) {
                    (function (indice) {
                        let dataInsert = props.helpers.cloudant(props, source).dataInsert;
                        console.log(finalArray[indice].length);
                        dataInsert(finalArray[indice]).then((response) => {
                            resolve({ status: true, data: response });
                        }).catch((error) => {
                            resolve(error);
                        });
                    })(index);
                }
            });
        }
    }

    let saveData = () => {
        let feedsDbInsert = [];
        let current;
        if (dataDumpster.length > 0) {
            for (let i = 0; i < 3000; i++) {
                current = dataDumpster.pop();
                if (current) {
                    feedsDbInsert.push(current);
                }
                else {
                    break;
                }
            }
            dbInsert(feedsDbInsert)
                .then(response => {
                    console.info(response);
                }).catch(error => {
                    console.error('Error: ', error);
                })
        }
    }

    let validateData = (data) => {
        let dataParsed = props.parsers.facebook.dataParse(data);

        let regex = new RegExp(".*" + data.entity + ".*", "gi");
        let ragexDataArray = [];
        dataParsed.forEach(function (facePosts) {
            if (facePosts.content.match(regex)) {
                ragexDataArray.push(facePosts);
            }
        }, this);

        dataDumpster = dataDumpster.concat(ragexDataArray);
    }


    schedule.scheduleJob('*/15 * * * * *', function () {
        saveData()
    });


    schedule.scheduleJob('30 * * * *', function () {
        getCrawling()
            .then((response) => {
                response.forEach((id) => {
                    loadEntity(id.doc)
                        .then((response) => {
                            response.pages.forEach((page) => {
                                extractData({
                                    entity: response.entity,
                                    quantity: response.quantity,
                                    pages: page
                                })
                                    .then(resp => {
                                        validateData({
                                            entity: response.entity,
                                            page: page,
                                            data: resp
                                        });
                                    })
                                    .catch(err => {
                                        console.error('Error', err);
                                    });
                            })
                        })
                        .catch((erro) => {
                            console.error('Error: ', error);
                        });;
                }, this);
            })
            .catch((error) => {
                console.error('Error: ', error);
            })
    });
}
module.exports = (props, source) => {


    let db = props.dbs[source].dbs.entities,
        dbData = props.dbs[source].dbs.data,
        dbCrawling = props.dbs[source].dbs.crawling,
        cloudant = props.modules.cloudant.use(db),
        cloudantData = props.modules.cloudant.use(dbData),
        cloudantCrawling = props.modules.cloudant.use(dbCrawling);

    return {
        load: () => {
            return new Promise((resolve, reject) => {
                cloudant.list({ include_docs: true })
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
            });
        },
        create: (dataInput) => {
            return new Promise((resolve, reject) => {
                cloudant.insert(dataInput)
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
            });
        },
        update: (dataInput) => {
            return new Promise((resolve, reject) => {
                cloudant.insert(dataInput)
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
            });
        },
        remove: (dataInput) => {
            return new Promise((resolve, reject) => {
                cloudant.destroy(dataInput._id, dataInput._rev)
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
            });
        },
        loadData: (dataInput) => {
            return new Promise((resolve, reject) => {
                cloudantData.find(dataInput)
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
            });
        },
        crawling: () => {
            return new Promise((resolve, reject) => {
                cloudantCrawling.list({ include_docs: true })
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
            });
        },
        get: (dataInput) => {
            return new Promise((resolve, reject) => {
                cloudantCrawling.get(dataInput._id)
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
            });
        },
        getEntity: (dataInput) => {
            return new Promise((resolve, reject) => {
                cloudant.get(dataInput._id)
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
            });
        },
        loadCrawling: () => {
            return new Promise((resolve, reject) => {
                cloudantCrawling.list({ include_docs: true })
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
            });
        },
        start: (dataInput) => {
            return new Promise((resolve, reject) => {
                cloudantCrawling.insert(dataInput)
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
            });
        },
        stop: (dataInput) => {
            return new Promise((resolve, reject) => {
                cloudantCrawling.destroy(dataInput._id, dataInput._rev)
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
            });
        },
        countUpdate: (dataInput) => {
            return new Promise((resolve, reject) => {
                cloudantCrawling.insert(dataInput)
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
            });
        },
        dataInsert: (data) => {
            return new Promise((resolve, reject) => {
                cloudantData.bulk({ docs: data })
                    .then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });
            })
        }
    }
}
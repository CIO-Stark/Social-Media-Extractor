const graph = require('fbgraph');

graph.setAccessToken(process.env.FACEBOOK_ACCESS_TOKEN);
graph.setVersion("2.8");

const params = { fields: "posts" };


let getFBPosts = (page, max, finished, error) => {
    let data = [];
    let counter = 0;
    //recursive func for pagination
    let next = (err, res) => {
        counter++;
        if (counter < max && res.hasOwnProperty("paging")) {
            graph.get(res.paging.next, (err, res) => {
                if (err) {
                    error(err);
                }
                else {
                    res.data.forEach((post) => {
                        data.push(post);
                    });

                    next(err, res);
                }
            });
        }
        else {
            finished(data);
        }
    };
    //start routine
    graph.get(page, params, (err, res) => {
        if (err) {
            error(err);
        }
        else {
            res.posts.data.forEach((post) => {
                data.push(post);
            });
            if (res.posts.paging && res.posts.paging.next) {
                graph.get(res.posts.paging.next, (err, res) => {
                    next(err, res);
                });
            }
            else {
                finished(data);
            }
        }
    });
};

exports.facebookSearch = (props) => {
    let page = props.pages,
        size = props.quantity;

    return new Promise((resolve, reject) => {
        getFBPosts(page, size, (data) => {
            resolve({
                length: data.length,
                data: data
            })
        }, (error) => {
            console.error("getFBPosts error", error);
            reject(error);
        });
    })
};
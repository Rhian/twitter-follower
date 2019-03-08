'use strict';

let TwitterPackage = require('twit');

let Twitter = new TwitterPackage({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

async function follow(screenName) {
    await Twitter.get('followers/list', { screen_name: screenName }, function(err, data, response) {
        let followers = [];
        data.users.forEach(async function(element) {
            if (element.followers_count > 10 && element.following === false && element.follow_request_sent === false) {
                followers.push(element.id_str);
                console.log(`${element.screen_name} has ${element.followers_count} followers`);
            };
        });
        console.log(followers.length);
        followers.forEach(async function(element) {
            Twitter.post('friendships/create', { user_id: element }, function(err, data, response) {
                if (!err) {
                    console.log(`${element} was followed`);
                } else {
                    console.log(err);
                }
            });
        });
    });
};

follow(process.env.SCREEN_NAME);
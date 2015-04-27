var fs = require('fs');
var _ = require('lodash');
var Twit = require('twit');

fs.readFile('./secret.json', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    var T = new Twit(JSON.parse(data));

//    T.get('search/tweets', { q: '%23labour', count: 100 }, function (err, data, response) {
//        if (err) {
//            return console.log(err);
//        }
//        return console.log(_.pluck(data.statuses, 'text'));
//    });

    var stream = T.stream('statuses/filter', {
        track: 'election',
        language: 'en'/*,
        locations: ['-13.44', '62.50', '2.10', '50.15']*/
    });

    stream.on('tweet', function (tweet) {
        var tags = _.pluck(tweet.entities.hashtags, 'text');
        if (!_.isEmpty(tags)) {
            console.log(tags);
            console.log('');
        }
    });
    return undefined;
});

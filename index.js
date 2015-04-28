var fs = require('fs');
var _ = require('lodash');
var Twit = require('twit');

fs.readFile('./secret.json', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    var T = new Twit(JSON.parse(data));

    var parties = ['labour', 'conservative', 'tory', 'tories', 'lib dem', 'greens',
                   'green party', 'tusc', 'snp', 'plaid', 'ukip'];

    var stream = T.stream('statuses/filter', {
        track: parties.join(','),
        language: 'en'/*,
        locations: ['-13.44', '62.50', '2.10', '50.15']*/
    });

    stream.on('tweet', function (tweet) {
        var tags = _.pluck(tweet.entities.hashtags, 'text');
        var matcher = new RegExp('(' + parties.join('|') + ')','gi');
        var party = tweet.text.match(matcher);
        if (party) {
            console.log(_.uniq(_.map(party, function (p) {
                return p.toLowerCase();
            })));
        }
        console.log('');

    });
    return undefined;
});

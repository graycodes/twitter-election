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

    var partyNames = [ 'Labour', 'Conservative', 'SNP', 'Lib Dems', 'Green', 'TUSC', 'Plaid', 'UKIP' ];

    var partyScores = _.map(partyNames, function (p) {
        var o = {};
        return o[p] = 0;
    });
    console.log(partyScores);

    var stream = T.stream('statuses/filter', {
        track: parties.join(','),
        locations: ['-10.93', '49.83', '1.43', '62.86']
    });

    stream.on('tweet', function (tweet) {
        var tags = _.pluck(tweet.entities.hashtags, 'text');
        var matcher = new RegExp('(' + parties.join('|') + ')','gi');
        var party = tweet.text.match(matcher);
        var partiesTweeted;

        if (!party) return;

        partiesTweeted = (_.uniq(_.map(party, function (p) {
            return p.toLowerCase();
        })));

        console.log(partiesTweeted);

    });

    //TODO finish this.
    function storeParties(parties) {//todo fix multiple insert to one party via 2 names
        while (parties.length) {
            var p = parties.pop();
            switch (p) {
                case 'labour':
                    partyScores['Labour']++;
                    break;
                case 'conservative':
                case 'tory':
                case 'tories':
                    partyScores['Conservative']++;
                    break;
                case 'lib dem':
                    partyScores['Lib Dems']++;//?
                    break;
                case 'greens':
                case 'green':
                    partyScores['Green']++;
                
            }
        }
    }

    return undefined;
});

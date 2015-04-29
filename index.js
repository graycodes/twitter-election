var fs = require('fs');
var _ = require('lodash');
var Twit = require('twit');

fs.readFile('./secret.json', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    var T = new Twit(JSON.parse(data));

    var parties = ['labour', 'conservative', 'tory', 'tories', 'lib dem', 'greens',
                   'green party', 'tusc', 'snp', 'plaid', 'ukip'];// TODO: Add liberal democrats

    var partyNames = [ 'labour', 'conservative', 'snp', 'lib dem', 'green', 'tusc', 'plaid', 'ukip' ];
	var fudge = [0,0,0,0,0,0,0,0];

    var partyScores = _.zipObject(partyNames, fudge);

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

        partiesTweeted = cleanTweet(party);

	    storeParties(partiesTweeted);

    });

	setInterval(function() {
		console.log('**************************');
		console.log(partyScores)
		console.log('**************************');
	}, 5000);

	function cleanTweet(party) {
		var uniques = _.uniq(_.map(party, function (p) {
			p = p.replace(/(tory|tories)/i, 'conservative');
			p = p.replace(/(greens|green party)/i, 'green');
			return p.toLowerCase();
		}));

		return uniques;
	}

    function storeParties(parties) {
        while (parties.length) {
            var p = parties.pop();
            partyScores[p]++;
        }
    }

    return undefined;
});

var fs = require('fs');
var Twit = require('twit');

fs.readFile('./secret.json', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);
    console.log(JSON.parse(data));

    var T = new Twit(JSON.parse(data));

    T.get('search/tweets', { q: '%23election2015' }, function (err, data, response) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
    });
});

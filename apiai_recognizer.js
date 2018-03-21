var apiai = require('apiai');

var app = apiai('1b89aa53e1a64b61a950c2d040c7c5de');

module.exports = {
    recognize: function(context, callback) {
        var request = app.textRequest(context.message.text, {
            sessionId: Math.random()
        });

        request.on('response', function(response) {
            var result = response.result;

            callback(null, {
                intent: result.metadata.intentName,
                score: result.score
            });
        });

        request.on('error', function(error) {
            callback(error);
        });

        request.end();
    }
};

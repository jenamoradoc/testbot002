var restify = require('restify');
var builder = require('botbuilder');
var apiaiRecognizer = require('./apiai_recognizer');
var express = require('express');

var app = express();

//connector con bootbuilder
var connector = new builder.ChatConnector({

});

// recepcion y respuesta a mensajes
const bot = new builder.UniversalBot(connector, {
    persistConversationData: true
});

var intents = new builder.IntentDialog( {
    recognizers: [
        apiaiRecognizer
    ],
    intentThreshold: 0.2,
    recognizeOrder: builder.RecognizeOrder.series
});

bot.dialog('/', intents);

intents.matches('ams-welcome',function(session, args){
    var fulfillment = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
    if (fulfillment){
        var speech = fulfillment.entity;
        session.send(speech);
    }else{
        session.send('Sorry...not sure how to respond to that');
    }
});

intents.onDefault(function(session){
    session.send("Sorry...can you please rephrase?");
})


// Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// escuhar mensajes del usario
server.post('/api/messages', connector.listen());

//ping
server.get('/ping', function (req, res, next) {
   res.send('pong' );
   next();
});

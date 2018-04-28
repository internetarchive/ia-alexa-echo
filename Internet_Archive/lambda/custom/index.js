'use strict';

const dashbot = require('dashbot')(constants.DASHBOT_API_KEY).alexa;

var Alexa = require('alexa-sdk');
var constants = require('./constants');
var stateHandlers = require('./stateHandlers');
var audioEventHandlers = require('./audioEventHandlers');

var functions = require('./functions');
exports.handler = dashbot.handler( function (event, context, callback) {

    var alexa = Alexa.handler(event, context);
    alexa.appId = constants.appId;
    alexa.dynamoDBTableName = constants.dynamoDBTableName;
    alexa.registerHandlers(
        stateHandlers.startModeIntentHandlers,
        stateHandlers.playModeIntentHandlers,
        stateHandlers.remoteControllerHandlers,
        stateHandlers.resumeDecisionModeIntentHandlers,
        audioEventHandlers.audioEventHandlersPlayMode,
        audioEventHandlers.audioEventHandlersStartMode,
        audioEventHandlers.audioEventHandlersResumeMode
    );

    if (constants.debug) {
        console.log("\n" + "******************* REQUEST **********************");
        console.log("\n" + JSON.stringify(event, null, 2));
    }
    var audioPlayerInterface = ((((event.context || {}).System || {}).device || {}).supportedInterfaces || {}).AudioPlayer;
    if (audioPlayerInterface === undefined) {
        alexa.emit(':tell', 'Sorry, this skill is not supported on this device');
    } else {
        alexa.execute();
    }
});

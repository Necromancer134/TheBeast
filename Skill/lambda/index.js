/* eslint-disable no-mixed-operators */
/*
  Copyright (c) 2019 Dabble Lab

  Template 3 - Alexa Audio Streaming Example Skill

  For a tutorial on using this template please visit:
  https://dabblelab.com/templates/3-alexa-audio-streaming-example-skill

*/

const Alexa = require('ask-sdk-core');

const STREAMS = [
  {
    token: '1',
    url: 'https://live.wostreaming.net/playlist/fourseasons-wtsaammp3-ibc1.m3u',
    metadata: {
      title: '99.5 The Beast',
      subtitle: 'Brattleboros Rock Station',
      art: {
        sources: [
          {
            contentDescription: 'logo',
            url: 'https://media.socastsrm.com/wordpress/wp-content/blogs.dir/2165/files/2020/09/beast.png',
            widthPixels: 512,
            heightPixels: 512,
          },
        ],
      },
      backgroundImage: {
        sources: [
          {
            contentDescription: 'beast background',
            url: 'https://media.socastsrm.com/wordpress/wp-content/blogs.dir/2165/files/2020/09/beast.png',
            widthPixels: 1200,
            heightPixels: 800,
          },
        ],
      },
    },
  },
];

const PlayStreamIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
      || handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (
          handlerInput.requestEnvelope.request.intent.name === 'PlayStreamIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ResumeIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.LoopOnIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ShuffleOnIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StartOverIntent'
        );
  },
  handle(handlerInput) {
    const stream = STREAMS[0];

    handlerInput.responseBuilder
      .speak(`starting ${stream.metadata.title}`)
      .addAudioPlayerPlayDirective('REPLACE_ALL', stream.url, stream.token, 0, null, stream.metadata);

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'This skill plays an audio stream when it is started. It does not have any additional functionality.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const AboutIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AboutIntent';
  },
  handle(handlerInput) {
    const speechText = 'To continue listening say: resume, or say: stop to stop listening.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.LoopOffIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ShuffleOffIntent'
        );
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ALL')
      .addAudioPlayerStopDirective();

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const PlaybackStoppedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'PlaybackController.PauseCommandIssued'
            || handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStopped';
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ALL')
      .addAudioPlayerStopDirective();

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const PlaybackStartedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStarted';
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ENQUEUED');

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const ExceptionEncounteredRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'System.ExceptionEncountered';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return true;
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(handlerInput.requestEnvelope.request.type);
    return handlerInput.responseBuilder
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    PlayStreamIntentHandler,
    PlaybackStartedIntentHandler,
    CancelAndStopIntentHandler,
    PlaybackStoppedIntentHandler,
    AboutIntentHandler,
    HelpIntentHandler,
    ExceptionEncounteredRequestHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
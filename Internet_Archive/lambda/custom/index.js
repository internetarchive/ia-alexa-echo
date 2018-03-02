'use strict';
var https = require('https');
var http = require('http');
var lastPlayedByUser = {};
var host='archive.org';
var podcastAPIURL = "/advancedsearch.php?q=collection:";
var podcastCityAPIURL = "/advancedsearch.php?q=collection:";
var podcastAPIURLNEW = "/advancedsearch.php?q=";
var SeventyEightsAPIURL = "/advancedsearch.php?q=collection:(georgeblood)+AND+subject:";
var APIURLIdentifier = "/metadata/";
var MusicUrlList = [];
var page = 1;
var counter = 0;
var audioURL;
var year = '';
var typeQuery = false;
var searchBYTitle = false;
var PlayAudioByRandomYear = false;
var PlayAudioByRandomCity = false;
var PlayAudioByRandom = false;
var city = '';
var CityName = 'Los Angeles';
var YearName = '1971';
var used = true;
var collection = '';
var collectionQuery = '';
var title = '';
var APIURL = '';
var APIURLIDENTIFIER = '';
var SeventyEights = false;
var OneGoPlayAudioStatus=false;
var OneGoCollectionRandomPlayAudioStatus=false;
var topicName = '';
var TotalTrack = -1;
var IdentifierCount = 0;
var randomArray=[];
console.log('Start');
exports.handler = function (event, context) {
  var player = new MyAudioPlayer(event, context);
  player.handle();
};

Array.prototype.unique = function () {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

var MyAudioPlayer = function (event, context) {
  this.event = event;
  this.context = context;
};

MyAudioPlayer.prototype.handle = function () {
  var requestType = (this.event.request != undefined) ? this.event.request.type : null;
 // console.log('Support Diatplay');
 // console.log(this.event.context.System.device.supportedInterfaces);
  if (requestType === "LaunchRequest") {
    console.log('LaunchRequest');
    SeventyEights = false;
    this.Welcome();

  }
  else if (requestType === "IntentRequest") {
    var intent = this.event.request.intent;
    if (intent.name === 'Discovery') {
      SeventyEights = false;
      console.log('Discovery');
      this.Discovery();

    }
    else if (intent.name === "PlayAudio") {
      console.log('PlayAudio');
      page = 0;
      TotalTrack = -1;
      IdentifierCount = 0;
      MusicUrlList = [];
      typeQuery = false;
      searchBYTitle = false;
      PlayAudioByRandomYear = false;
      PlayAudioByRandomCity = false;
      PlayAudioByRandom = false;
      OneGoPlayAudioStatus=false;
      counter = 0;
      SeventyEights = false;
      this.play(intent, 0);

    }
    else if (intent.name === "SearchCollection") {
      TotalTrack = -1;
      SeventyEights = false;
      city = '';
      year = '';
      console.log('SearchCollection');
      this.getCollection(intent);
    }
    else if (intent.name === "PlayAudioByCity") {
      console.log('PlayAudioByCity');
      page = 0;
      MusicUrlList = [];
      TotalTrack = -1;
      IdentifierCount = 0;
      typeQuery = false;
      searchBYTitle = false;
      PlayAudioByRandomYear = false;
      PlayAudioByRandomCity = false;
      PlayAudioByRandom = false;
      OneGoPlayAudioStatus=false;
      counter = 0;
      SeventyEights = false;
      this.play(intent, 0);

    }
    else if (intent.name === "PlayAudioByYearCity") {
      page = 0;
      console.log('PlayAudioByYearCity');
      MusicUrlList = [];
      TotalTrack = -1;
      IdentifierCount = 0;
      typeQuery = false;
      searchBYTitle = false;
      PlayAudioByRandomYear = false;
      PlayAudioByRandomCity = false;
      PlayAudioByRandom = false;
      OneGoPlayAudioStatus=false;
      counter = 0;
      SeventyEights = false;
      this.play(intent, 0);

    }
    else if (intent.name === "PlayAudioQuery") {
      console.log('PlayAudioQuery');
      page = 0;
      MusicUrlList = [];
      TotalTrack = -1;
      IdentifierCount = 0;
      typeQuery = false;
      searchBYTitle = true;
      PlayAudioByRandomYear = false;
      PlayAudioByRandomCity = false;
      PlayAudioByRandom = false;
      OneGoPlayAudioStatus=false;
      counter = 0;
      SeventyEights = false;
      this.play(intent, 0);

    }
    else if (intent.name === "PlayAudioByRandomYear") {
      console.log('PlayAudioByRandomYear');
      page = 0;
      TotalTrack = -1;
      IdentifierCount = 0;
      MusicUrlList = [];
      PlayAudioByRandomYear = true;
      PlayAudioByRandomCity = false;
      typeQuery = false;
      searchBYTitle = false;
      PlayAudioByRandom = false;
      OneGoPlayAudioStatus=false;
      counter = 0;
      SeventyEights = false;
      this.play(intent, 0);

    }
    else if (intent.name === "PlayAudioByRandomCity") {
      console.log('PlayAudioByRandomCity');
      page = 0;
      TotalTrack = -1;
      IdentifierCount = 0;
      MusicUrlList = [];
      PlayAudioByRandomYear = false;
      PlayAudioByRandomCity = true;
      typeQuery = false;
      searchBYTitle = false;
      PlayAudioByRandom = false;
      OneGoPlayAudioStatus=false;
      counter = 0;
      SeventyEights = false;
      this.play(intent, 0);

    }
    else if (intent.name === "PlayAudioByRandom") {
      console.log('PlayAudioByRandom');
      page = 0;
      TotalTrack = -1;
      IdentifierCount = 0;
      MusicUrlList = [];
      PlayAudioByRandomYear = false;
      PlayAudioByRandomCity = false;
      OneGoPlayAudioStatus=false;
      PlayAudioByRandom = true;
      typeQuery = false;
      searchBYTitle = false;
      counter = 0;
      SeventyEights = false;
      this.play(intent, 0);

    }
    else if (intent.name === "AMAZON.PauseIntent") {
      console.log('PauseIntent');
      this.stop();
    }
    else if (intent.name === "SeventyEights") {
      console.log('SeventyEights');
      page = 0;
      TotalTrack = -1;
      IdentifierCount = 0;
      MusicUrlList = [];
      typeQuery = false;
      searchBYTitle = false;
      counter = 0;
      SeventyEights = true;
      topicName = '';
      this.playSeventyEights(intent, 0);

    }
    else if (intent.name === "PlaByTopic") {
      console.log('PlaByTopic');
      page = 0;
      TotalTrack = -1;
      IdentifierCount = 0;
      MusicUrlList = [];
      typeQuery = false;
      searchBYTitle = false;
      counter = 0;
      SeventyEights = true;
      this.playSeventyEights(intent, 0);

    }
    else if (intent.name === "AMAZON.HelpIntent") {	
      console.log("HelpIntent");	
      this.help();
    }
    else if (intent.name === "OneGoSeventyEights") {
      console.log('OneGoSeventyEights');
      page = 0;
      TotalTrack = -1;
      IdentifierCount = 0;
      MusicUrlList = [];
      typeQuery = false;
      searchBYTitle = false;
      counter = 0;
      SeventyEights = true;
      this.playSeventyEights(intent, 0);

    }else if (intent.name === "OneGoPlayAudio") {
      console.log('OneGoPlayAudio');
      page = 0;
      TotalTrack = -1;
      IdentifierCount = 0;
      MusicUrlList = [];
      typeQuery = false;
      searchBYTitle = false;
      PlayAudioByRandomYear = false;
      PlayAudioByRandomCity = false;
      PlayAudioByRandom = false;
      OneGoCollectionRandomPlayAudioStatus=false;
      counter = 0;
      SeventyEights = false;
      OneGoPlayAudioStatus=true;
      this.OneGoPlayAudio(intent, 0);

    }else if (intent.name === "OneGoCollectionRandomPlayAudio") {
      console.log('OneGoCollectionRandomPlayAudio');
      page = 0;
      TotalTrack = -1;
      IdentifierCount = 0;
      MusicUrlList = [];
      typeQuery = false;
      searchBYTitle = false;
      PlayAudioByRandomYear = false;
      PlayAudioByRandomCity = false;
      PlayAudioByRandom = false;
      OneGoCollectionRandomPlayAudioStatus=true;
      counter = 0;
      SeventyEights = false;
      OneGoPlayAudioStatus=true;
      this.OneGoPlayAudio(intent, 0);

    }
    else if (intent.name === "AMAZON.NextIntent") {
      console.log('NextIntent');
      if (SeventyEights == true) {
        if (TotalTrack < 0) {
          var response = {
            version: '1.0',
            response: {
              outputSpeech: {
                type: 'SSML',
                ssml: "<speak>Please Select Topic first</speak>",
              },
              card: {
                type: 'Simple',
                title: "Select Topic",
                content: "Please Select Topic first",
              },
              reprompt: {
                outputSpeech: {
                  type: 'SSML',
                  ssml: "<speak>Please Select Topic first</speak>",
                }
              },
              shouldEndSession: false,
              directives: [
                {
                  type: "AudioPlayer.Stop"
                }
              ]
            }
          };
          this.context.succeed(response);

        }
        else {
          counter++;
          if (counter > (TotalTrack - 1) && TotalTrack >= 0) {
            page++;
            typeQuery = true;
          }
          else {
            typeQuery = false;
          }

          this.playSeventyEights(intent, 0);
        }
      }
      else {
        if (TotalTrack == 0) {
          var response = {
            version: '1.0',
            response: {
              outputSpeech: {
                type: 'SSML',
                ssml: "<speak>Please Select City and year first</speak>",
              },
              card: {
                type: 'Simple',
                title: "Select City and Year",
                content: "Please Select City and year first",
              },
              reprompt: {
                outputSpeech: {
                  type: 'SSML',
                  ssml: "<speak>Please Select City and year first</speak>",
                }
              },
              shouldEndSession: false,
              directives: [
                {
                  type: "AudioPlayer.Stop"
                }
              ]
            }
          };
          this.context.succeed(response);


        }
        else {
          counter++;
          if (counter > (TotalTrack - 1) && TotalTrack > 0) {
            page++;
            typeQuery = true;
          }
          else {
            typeQuery = false;
          }
          if(OneGoPlayAudioStatus){
            this.OneGoPlayAudio(intent, 0);
          }else{
            this.play(intent, 0);
          }
          
        }
      }
    }
    else if (intent.name === "AMAZON.PreviousIntent") {
      console.log('PreviousIntent');
      if (SeventyEights == true) {
        if (counter > 0) {
          counter--;
        }
        else {
          counter = 0;
        }
        this.playSeventyEights(intent, 0);
      }
      else {
        if (counter > 0) {
          counter--;
        }
        else {
          counter = 0;
        }
        if(OneGoPlayAudioStatus){
          this.OneGoPlayAudio(intent, 0);
        }else{
          this.play(intent, 0);
        }
      }

    }
    else if (intent.name === "AMAZON.ResumeIntent") {
      console.log('ResumeIntent');
      if (SeventyEights == true) {
        var userId = this.event.context ? this.event.context.System.user.userId : this.event.session.user.userId;

        var lastPlayed = this.loadLastPlayed(userId);
        var offsetInMilliseconds = 0;
        if (lastPlayed !== null) {
          offsetInMilliseconds = lastPlayed.request.offsetInMilliseconds;
        }
        this.playSeventyEights(intent, offsetInMilliseconds);
      }
      else {
        var userId = this.event.context ? this.event.context.System.user.userId : this.event.session.user.userId;

        var lastPlayed = this.loadLastPlayed(userId);
        var offsetInMilliseconds = 0;
        if (lastPlayed !== null) {
          offsetInMilliseconds = lastPlayed.request.offsetInMilliseconds;
        }
        if(OneGoPlayAudioStatus){
          this.OneGoPlayAudio(intent, offsetInMilliseconds);
        }else{
          this.play(intent, offsetInMilliseconds);
        }
        // this.play(intent, offsetInMilliseconds);
      }
    }
    else if (intent.name === 'AMAZON.StopIntent' || intent.name === 'AMAZON.CancelIntent') {
      this.handleSessionEndRequest();
    }
    else {
      this.context.succeed({
        version: "1.0",
        response: {}
      });
    }
  }
  else if (requestType === "AudioPlayer.PlaybackStopped") {
    console.log('PlaybackStopped');
    var userId = this.event.context ? this.event.context.System.user.userId : this.event.session.user.userId;

    this.saveLastPlayed(userId, this.event);
    this.context.succeed({
      version: "1.0",
      response: {}
    });
  }
  else if (requestType === "AudioPlayer.PlaybackStarted") {
    page++;
    typeQuery = true;
    console.log('PlaybackStarted');
    var intentForStart = { name: 'PlaybackStarted' };
    if (SeventyEights == true) {
     // this.playSeventyEights(intentForStart, 0);
      this.context.succeed({
        version: "1.0",
        response: {}
      });
    }
    else {
      //this.play(intent, 0);
      this.context.succeed({
        version: "1.0",
        response: {}
      });
    }
  }
  // else if (requestType === "AudioPlayer.PlaybackFailed") {
  //   console.log('AudioPlayer.PlaybackFailed');
  //   var intent = { name: 'autoNext' };
  //   if (SeventyEights == true) {
  //     this.playSeventyEights(intent, 0);
  //   }
  //   else {
  //     this.play(intent, 0);
  //   }
  // }

  else if (requestType === "AudioPlayer.PlaybackNearlyFinished" || requestType === "AudioPlayer.PlaybackFailed") {
    console.log('PlaybackNearlyFinished');
    // counter++;
    // this.PlayNext(requestType, 0);
    counter++;
    console.log('counter -' + counter);
    console.log('TotalTrack -' + TotalTrack);
    if (counter > TotalTrack) {
      page++;
      typeQuery = true;
      console.log('true');
    }
    else {
      console.log('false');
      typeQuery = false;
    }
    console.log('page -' + page);
    console.log('Type -' + typeQuery);

    var intent = { name: 'autoNext' };
    if (SeventyEights == true) {
      this.playSeventyEights(intent, 0);
    }
    else {
      // this.play(intent, 0);
      if(OneGoPlayAudioStatus){
        this.OneGoPlayAudio(intent, 0);
      }else{
        this.play(intent, 0);
      }

    }


  }

  else if (requestType === "System.ExceptionEncountered") {
    console.log('Error');
    console.log(this.event.request.error);
  }
  else {
    console.log(requestType);
    this.context.succeed({
      version: "1.0",
      response: {}
    });

  }

};


//SeventyEights
MyAudioPlayer.prototype.playSeventyEights = function (intent, offsetInMilliseconds) {
  getAudioPlayListSeventyEights(intent, counter, this, offsetInMilliseconds, function (err, Obj, response) {
    if (!err) {
      Obj.context.succeed(response);
    }
    else {
      Obj.context.succeed(response);
    }
  })
};

function getAudioPlayListSeventyEights(intent, counter, thisOBJ, offsetInMilliseconds, callback) {
  var track = counter + 1;
  if ((MusicUrlList.length > 0 && intent.name != 'SeventyEights' && intent.name !='OneGoSeventyEights' && intent.name != 'PlaByTopic' && typeQuery === false)) {
    if (track > MusicUrlList.length) {
      counter = 0;
      track = counter + 1;
    }
    // console.log('test');
    var trackcounter = counter;
    
    var x = trackcounter;

    audioURL = 'https://archive.org/download/' + MusicUrlList[counter]['identifier'] + '/' + MusicUrlList[counter]['trackName'];
    console.log(intent);
    console.log(audioURL);
    if (intent.name != 'PlaybackStarted') {
      if (intent.name == 'autoNext') {
        var response = {
          version: "1.0",
          response: {
            shouldEndSession: true,
            directives: [
              {
                type: "AudioPlayer.Play",
                playBehavior: "REPLACE_ENQUEUED",
                audioItem: {
                  stream: {
                    url: audioURL,
                    token: MusicUrlList[counter]['identifier'] + counter,
                    //expectedPreviousToken: counter - 1,
                    offsetInMilliseconds: offsetInMilliseconds
                  }
                }
              }
            ]
          }
        };
        console.log(audioURL);
        console.log(counter);
        console.log(offsetInMilliseconds);
        console.log(response);
        return callback(0, thisOBJ, response);
      }
      else {
        var response = {
          version: "1.0",
          response: {
            outputSpeech: {
              type: 'PlainText',
              text: "Playing track - " + MusicUrlList[counter]['title'] + ", "+ MusicUrlList[counter]['coverage']+ ", "+ MusicUrlList[counter]['year']+".",
            },
            card: {
              type: 'Simple',
              title: "Playing track number - " + track,
              content: "Playing track - " + MusicUrlList[counter]['title'] + ", "+ MusicUrlList[counter]['coverage']+ ", "+ MusicUrlList[counter]['year']+".",
            },
            shouldEndSession: true,
            directives: [
              {
                type: "AudioPlayer.Play",
                playBehavior: "REPLACE_ALL",
                audioItem: {
                  stream: {
                    url: audioURL,
                    token: MusicUrlList[counter]['identifier'] + counter,
                    expectedPreviousToken: null,
                    offsetInMilliseconds: offsetInMilliseconds
                  }
                }
              }
            ]
          }
        };
        return callback(0, thisOBJ, response);
      }
    }
    else {
      var response = {
        version: "1.0",
        response: {}
      };
      return callback(0, thisOBJ, response);
    }

  }
  else if (intent.name == 'SeventyEights' || intent.name == 'PlaByTopic' || intent.name =='OneGoSeventyEights' || typeQuery === true) {

    if (intent.name == 'SeventyEights') {
      console.log('into Seventy Eights');
      console.log(intent.name);
      var cardTitle = 'Collection Seventy Eights Has Been Selected.';
      var repromptText = "<speak>Waiting for your responce.<break time='.1s'/>  Please select Topics like Jazz <break time='.5s'/> Instrumental or <break time='.5s'/> Dance</speak>";
      var speechOutput = "<speak>Collection Seventy Eights Has Been Selected.<break time='.1s'/> Please select topics like Jazz <break time='.5s'/> Instrumental or <break time='.5s'/> Dance</speak>";
      var cardOutput = "Collection Seventy Eights Has Been Selected. Please select topics like Jazz, Instrumental or Dance";

      var response = {
        version: '1.0',
        response: {
          outputSpeech: {
            type: 'SSML',
            ssml: speechOutput,
          },
          card: {
            type: 'Simple',
            title: cardTitle,
            content: cardOutput,
          },
          reprompt: {
            outputSpeech: {
              type: 'SSML',
              ssml: repromptText,
            }
          },
          shouldEndSession: false,
        }
      };
      console.log(response);
      return callback(0, thisOBJ, response);

    }
    else if (intent.name == 'PlaByTopic' || typeQuery === true || intent.name =='OneGoSeventyEights') {
      if (intent.name == 'PlaByTopic' || intent.name =='OneGoSeventyEights') {
        topicName = title = intent.slots.TOPIC.value;
      }

      topicName = topicName.replace(" and ", "#");
      topicName = topicName.replace("&", "#");
      topicName = topicName.replace(/ /g, '');
      topicName = topicName.replace("#", " ");
      topicName = topicName.replace(/[^a-zA-Z0-9 ]/g, "");
      
     
      APIURL = SeventyEightsAPIURL + '(' + topicName + ')&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=1&page=' + page + '&indent=yes&output=json';
      var options = {
        host: host,
        path: APIURL,
        method: 'GET',
        headers: {
           "User-Agent" : 'Alexa_Skill_Internet_Archive'
        }
      };
      console.log(options);
      https.get(options, function (res) {
        var body = '';
        res.on('data', function (data) {
          body += data;
        });
        res.on('end', function () {
          var result = JSON.parse(body);
          if (result != null && result['response']['docs'].length > 0) {
            APIURLIDENTIFIER = APIURLIdentifier + result['response']['docs'][0]['identifier'] + '/files';
            var optionsIdentifier = {
              host: host,
              path: APIURLIDENTIFIER,
              method: 'GET',
              headers: {
                  "User-Agent": 'Alexa_Skill_Internet_Archive'
              }
            };
            https.get(optionsIdentifier, function (responce) {
              var bodyIdentifier = '';
              responce.on('data', function (dataIdentifier) {
                bodyIdentifier += dataIdentifier;
              });

              responce.on('end', function () {
                var resultIdentifier = JSON.parse(bodyIdentifier);
                if (resultIdentifier != null && resultIdentifier['result'].length > 0) {
                  var trackNumber = 0;
                  var lastsongsize = '';
                  for (var i = 0; i < resultIdentifier['result'].length; i++) {
                    if (resultIdentifier['result'][i]['format'] == 'VBR MP3' && lastsongsize != resultIdentifier['result'][i]['length']) {
                      lastsongsize = resultIdentifier['result'][i]['length'];
                      if (resultIdentifier['result'][i]['title'] == undefined) {

                        trackNumber = trackNumber + 1;
                        MusicUrlList.push({
                          identifier: result['response']['docs'][0]['identifier'],
                          trackName: resultIdentifier['result'][i]['name'],
                          title: 'Track Number ' + trackNumber,
                          coverage: (result['response']['docs'][0]['coverage'])?result['response']['docs'][0]['coverage']:'Not mentioned',
                          year: (result['response']['docs'][0]['year'])?result['response']['docs'][0]['year']:'Not mentioned',
                        });
                      }
                      else {
                        trackNumber = trackNumber + 1;
                        resultIdentifier['result'][i]['title'] = resultIdentifier['result'][i]['title'].replace(/[^a-zA-Z0-9 ]/g, "");
                        MusicUrlList.push({
                          identifier: result['response']['docs'][0]['identifier'],
                          trackName: resultIdentifier['result'][i]['name'],
                          title: resultIdentifier['result'][i]['title'],
                          coverage: (result['response']['docs'][0]['coverage'])?result['response']['docs'][0]['coverage']:'Coverage Not mentioned',
                          year: (result['response']['docs'][0]['year'])?result['response']['docs'][0]['year']:'Year Not mentioned',
                        });
                      }
                      TotalTrack++;
                    }
                  }
                  // TotalTrack=TotalTrack+MusicUrlList.length-1;
                  // console.log('TrackCount -'+TotalTrack);
                  // console.log('Array Size -'+MusicUrlList.length);
                  var trackcounter = counter;
                  var start = TotalTrack - (MusicUrlList.length - 1);
                  var end = TotalTrack;
                  var x = Math.floor((Math.random() * end) + start);
                  console.log('Track - ' + x);
                  console.log('Start - ' + start);
                  console.log('End - ' + end);
                  trackcounter = x;
                  audioURL = 'https://archive.org/download/' + MusicUrlList[counter]['identifier'] + '/' + MusicUrlList[counter]['trackName'];
                  console.log(audioURL);
                  if (intent.name != 'PlaybackStarted') {
                    if (intent.name == 'autoNext') {
                      var response = {
                        version: "1.0",
                        response: {
                          shouldEndSession: true,
                          directives: [
                            {
                              type: "AudioPlayer.Play",
                              playBehavior: "REPLACE_ENQUEUED",
                              audioItem: {
                                stream: {
                                  url: audioURL,
                                  token: MusicUrlList[counter]['identifier'] + counter,
                                  //expectedPreviousToken: counter - 1,
                                  offsetInMilliseconds: offsetInMilliseconds
                                }
                              }
                          }
                        ]
                        }
                      };
                      return callback(0, thisOBJ, response);
                    }
                    else {
                      var response = {
                        version: "1.0",
                        response: {
                          outputSpeech: {
                            type: 'PlainText',
                            text: "Playing track - " + MusicUrlList[counter]['title'] + ", "+ MusicUrlList[counter]['coverage']+ ", "+ MusicUrlList[counter]['year']+".",
                          },
                          card: {
                            type: 'Standard',
                            title: "Playing track number - " + track,
                            text: "Playing track number - " + track + " " + MusicUrlList[counter]['title']  + ", "+ MusicUrlList[counter]['coverage']+ ", "+ MusicUrlList[counter]['year']+".",
                            // image: {
                            //   "smallImageUrl": "https://archive.org/services/img/"+MusicUrlList[counter]['identifier'],
                            //   "largeImageUrl": "https://archive.org/services/img/"+MusicUrlList[counter]['identifier']
                            // }
                          },
                          shouldEndSession: true,
                          directives: [
                            {
                              type: "AudioPlayer.Play",
                              playBehavior: "REPLACE_ALL",
                              audioItem: {
                                stream: {
                                  url: audioURL,
                                  token: MusicUrlList[counter]['identifier'] + counter,
                                  expectedPreviousToken: null,
                                  offsetInMilliseconds: offsetInMilliseconds
                                }
                              }
                          }
                        ]
                        }
                      };
                      console.log(response);
                      return callback(0, thisOBJ, response);
                    }
                  }
                  else {
                    var response = {
                      version: "1.0",
                      response: {}
                    };
                    return callback(0, thisOBJ, response);
                  }

                }
                else {
                  var cardTitle = 'No Songs Found';
                  var repromptText = "<speak>No songs found. Please select topics like Jazz <break time='.5s'/> Instrumental or <break time='.5s'/> Dance.</speak>";
                  var speechOutput = "<speak>Sorry , No songs found. Please select topics like Jazz <break time='.5s'/> Instrumental or <break time='.5s'/> Dance.</speak>";
                  var cardOutput = "Sorry, No songs found. Please select topics like Jazz, Instrumental or dance.>";
                  var response = {
                    version: '1.0',
                    response: {
                      outputSpeech: {
                        type: 'SSML',
                        ssml: speechOutput,
                      },
                      card: {
                        type: 'Simple',
                        title: cardTitle,
                        content: cardOutput,
                      },
                      reprompt: {
                        outputSpeech: {
                          type: 'SSML',
                          ssml: repromptText,
                        }
                      },
                      shouldEndSession: false,
                    }
                  };
                  return callback(0, thisOBJ, response);
                }

              });
            }).on('error', function (e) {
              var cardTitle = 'Unable to understand your request. Please Try again.';
              var repromptText = '<speak>Waiting for your responce.</speak>';
              var speechOutput = "<speak>Sorry , Unable to understand your request. Please Try again.</speak>";
              var cardOutput = "Sorry, Unable to understand your request. Please Try again.";
              var response = {
                version: '1.0',
                response: {
                  outputSpeech: {
                    type: 'SSML',
                    ssml: speechOutput,
                  },
                  card: {
                    type: 'Simple',
                    title: cardTitle,
                    content: cardOutput,
                  },
                  reprompt: {
                    outputSpeech: {
                      type: 'SSML',
                      ssml: repromptText,
                    }
                  },
                  shouldEndSession: false,
                }
              };
              return callback(0, thisOBJ, response);
            });


          }
          else {
            if (intent.name != 'PlaybackStarted') {
                var cardTitle = 'No Songs Found';
                var repromptText = '<speak>No songs found. Please Try again.</speak>';
                var speechOutput = "<speak>Sorry , No songs found. Please Try again.</speak>";
                var cardOutput = "Sorry, No songs found. Please Try again.";
                var response = {
                  version: '1.0',
                  response: {
                    outputSpeech: {
                      type: 'SSML',
                      ssml: speechOutput,
                    },
                    card: {
                      type: 'Simple',
                      title: cardTitle,
                      content: cardOutput,
                    },
                    reprompt: {
                      outputSpeech: {
                        type: 'SSML',
                        ssml: repromptText,
                      }
                    },
                    shouldEndSession: false,
                  }
                };
                return callback(0, thisOBJ, response);
            }else{
               var response = {
                  version: "1.0",
                  response: {}
                };
                return callback(0, thisOBJ, response);
            }

          }

        });
      }).on('error', function (e) {
         if (intent.name != 'PlaybackStarted') {
              var cardTitle = 'Unable to understand your request. Please Try again.';
              var repromptText = '<speak>Waiting for your responce.</speak>';
              var speechOutput = "<speak>Sorry , Unable to understand your request. Please Try again.</speak>";
              var cardOutput = "Sorry, Unable to understand your request. Please Try again.";
              var response = {
                version: '1.0',
                response: {
                  outputSpeech: {
                    type: 'SSML',
                    ssml: speechOutput,
                  },
                  card: {
                    type: 'Simple',
                    title: cardTitle,
                    content: cardOutput,
                  },
                  reprompt: {
                    outputSpeech: {
                      type: 'SSML',
                      ssml: repromptText,
                    }
                  },
                  shouldEndSession: false,
                }
              };
              return callback(0, thisOBJ, response);
         }else{
           var response = {
              version: "1.0",
              response: {}
            };
            return callback(0, thisOBJ, response);
        }
      });

    }

  }
  else {
    var cardTitle = 'Unable to understand your request.';
    var repromptText = '<speak>Waiting for your responce.</speak>';
  
    var speechOutput = "<speak>Sorry, Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.</speak>";
    var cardOutput = "Sorry, Unable to understand your request. Please Try again. By saying City and Year or Random.";

    var response = {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'SSML',
          ssml: speechOutput,
        },
        card: {
          type: 'Simple',
          title: cardTitle,
          content: cardOutput,
        },
        reprompt: {
          outputSpeech: {
            type: 'SSML',
            ssml: repromptText,
          }
        },
        shouldEndSession: false,
      }
    };
    return callback(0, thisOBJ, response);

  }

}
//SeventyEights

MyAudioPlayer.prototype.PlayNext = function (requestType, offsetInMilliseconds) {
  var track = counter + 1;
  var prevTrack = counter;
  if (MusicUrlList.length > 0) {
    if (track > MusicUrlList.length) {
      counter = 0;
      track = counter + 1;
    }
    var trackcounter = counter;
    if (PlayAudioByRandomYear === true || PlayAudioByRandomCity === true || PlayAudioByRandom === true) {
      var start = TotalTrack - (MusicUrlList.length - 1);
      var end = TotalTrack;
      var x = Math.floor((Math.random() * end) + start);
      console.log('Track - ' + x);
      console.log('Start - ' + start);
      console.log('End - ' + end);
      trackcounter = x;
      audioURL = 'https://archive.org/download/' + MusicUrlList[x]['identifier'] + '/' + MusicUrlList[x]['trackName'];
      if (PlayAudioByRandomYear == true) {
        log("Auto Next Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, 'random', APIURL, function (status) {});
      }
      else if (PlayAudioByRandomCity == true) {
        log("PAuto Next laying Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', year, APIURL, function (status) {});
      }
      else if (PlayAudioByRandom == true) {
        log("Auto Next Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', 'random', APIURL, function (status) {});
      }

    }
    else {
      audioURL = 'https://archive.org/download/' + MusicUrlList[counter]['identifier'] + '/' + MusicUrlList[counter]['trackName'];
      log("Auto Next Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, year, APIURL, function (status) {});
    }
    // console.log('Auto Next -'+audioURL);
    var response = {
      version: "1.0",
      response: {
        shouldEndSession: true,
        directives: [
          {
            type: "AudioPlayer.Play",
            playBehavior: "REPLACE_ENQUEUED",
            audioItem: {
              stream: {
                url: audioURL,
                token: MusicUrlList[trackcounter]['identifier'] + counter,
                // expectedPreviousToken: prevTrack,
                offsetInMilliseconds: offsetInMilliseconds
              }
            }
          }
        ]
      }
    };
    this.context.succeed(response);

  }
  else {
    console.log('Auto Next - Not Found');
    var cardTitle = 'Unable to understand your request.';
    var repromptText = '<speak>Waiting for your responce.Please Try again by saying. City and Year. or <break time=".1s"/>  random.</speak>';
    var speechOutput = "<speak>Sorry , Error Occured.Please Try again. By saying. City and Year. or <break time='.1s'/> random.</speak>";
    var cradOutput = "Sorry, Error Occured Please Try again. By saying City and Year or Random.";

    var response = {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'SSML',
          ssml: speechOutput,
        },
        card: {
          type: 'Simple',
          title: cardTitle,
          content: cradOutput,
        },
        reprompt: {
          outputSpeech: {
            type: 'SSML',
            ssml: repromptText,
          }
        },
        shouldEndSession: true,
      }
    };
    this.context.succeed(response);
  }


};

function getAudioPlayList(intent, counter, thisOBJ, offsetInMilliseconds, callback) {
  if (collection != '' || searchBYTitle) {
    var track = counter + 1;

    if ((MusicUrlList.length > 0 && intent.name != 'PlayAudio' && intent.name != 'PlayAudioByRandom' && intent.name != 'PlayAudioByCity' && intent.name != 'PlayAudioByRandomYear' && intent.name != 'PlayAudioByRandomCity' && intent.name != 'PlayAudioQuery' && typeQuery === false)) {
      if (track > MusicUrlList.length) {
        counter = 0;
        track = counter + 1;
      }
      // console.log('test');
      var trackcounter = counter;
      if (PlayAudioByRandomYear === true || PlayAudioByRandomCity === true || PlayAudioByRandom === true) {
        var x = trackcounter;
        audioURL = 'https://archive.org/download/' + MusicUrlList[x]['identifier'] + '/' + MusicUrlList[x]['trackName'];
        if (PlayAudioByRandomYear == true) {
          log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, 'random', APIURL, function (status) {});
        }
        else if (PlayAudioByRandomCity == true) {
          log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', year, APIURL, function (status) {});
        }
        else if (PlayAudioByRandom == true) {
          log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', 'random', APIURL, function (status) {});
        }

      }
      else {
        audioURL = 'https://archive.org/download/' + MusicUrlList[trackcounter]['identifier'] + '/' + MusicUrlList[trackcounter]['trackName'];
        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, year, APIURL, function (status) {});
      }
      // console.log(intent.name);
      if (intent.name == 'autoNext') {
        var response = {
          version: "1.0",
          response: {
            directives: [
              {
                type: "AudioPlayer.Play",
                playBehavior: "REPLACE_ENQUEUED",
                audioItem: {
                  stream: {
                    url: audioURL,
                    token: MusicUrlList[trackcounter]['identifier'] + counter,
                    //expectedPreviousToken: counter - 1,
                    offsetInMilliseconds: offsetInMilliseconds
                  }
                }
              }
            ],
            shouldEndSession: true
          }
        };
        console.log(audioURL);
        console.log(counter);
        console.log(offsetInMilliseconds);
        return callback(0, thisOBJ, response);
      }
      else {
        var response = {
          version: "1.0",
          response: {
            outputSpeech: {
              type: 'PlainText',
              text: "Playing track - " + MusicUrlList[trackcounter]['title'] + " . ",
            },
            card: {
              type: 'Simple',
              title: "Playing track number - " + track,
              content: "Playing track - " + MusicUrlList[trackcounter]['title'] + " . ",
            },
            shouldEndSession: true,
            directives: [
              {
                type: "AudioPlayer.Play",
                playBehavior: "REPLACE_ALL",
                audioItem: {
                  stream: {
                    url: audioURL,
                    token: MusicUrlList[trackcounter]['identifier'] + counter,
                    expectedPreviousToken: null,
                    offsetInMilliseconds: offsetInMilliseconds
                  }
                }
              }
            ]
          }
        };
        return callback(0, thisOBJ, response);
      }


    }
    else if (intent.name == 'PlayAudio' || intent.name == 'PlayAudioByCity' || intent.name == 'PlayAudioByRandom' || intent.name == 'PlayAudioByRandomYear' || intent.name == 'PlayAudioByRandomCity' || intent.name == 'PlayAudioByYearCity' || intent.name == 'PlayAudioQuery' || typeQuery === true) {

      if (searchBYTitle || intent.name == 'PlayAudioQuery') {
        if (intent.name === 'PlayAudioQuery') {
          title = intent.slots.TITLE.value;
        }
        APIURL = podcastAPIURLNEW + title + '%20AND(mediatype:audio)&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject&fl[]=title&sort[]=downloads desc&rows=1&page=' + page + '&indent=yes&output=json';
      }
      else if (PlayAudioByRandomYear || intent.name == 'PlayAudioByRandomYear') {
        if (intent.name === 'PlayAudioByRandomYear') {
          city = intent.slots.CITY.value
        }
        APIURL = podcastCityAPIURL + collectionQuery + '+AND+coverage:(' + city + ')&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=1&page=' + page + '&indent=yes&output=json';
      }
      else if (PlayAudioByRandom || intent.name == 'PlayAudioByRandom') {
        APIURL = podcastCityAPIURL + collectionQuery + '&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=1&page=' + page + '&indent=yes&output=json';
      }
      else if (PlayAudioByRandomCity || intent.name == 'PlayAudioByRandomCity') {
        if (intent.name === 'PlayAudioByRandomCity') {
          year = intent.slots.YEAR.value;
        }
        APIURL = podcastAPIURL + collectionQuery + '+AND+year:(' + year + ')&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=1&page=' + page + '&indent=yes&output=json';
      }
      else {
        if (used) {
          year = '';
          city = '';
          used = false;
        }

        if (intent.name === 'PlayAudioByYearCity') {
          year = intent.slots.YEAR.value;
          city = intent.slots.CITY.value;

        }
        else if (intent.name === 'PlayAudio') {
          year = intent.slots.YEAR.value;
          APIURL = podcastAPIURL + collectionQuery + '+AND+year:(' + year + ')';

        }
        else if (intent.name === 'PlayAudioByCity') {
          city = intent.slots.CITY.value;
          APIURL = podcastCityAPIURL + collectionQuery + '+AND+coverage%3A(' + city + ')';
        }

        if (year != '' && city != '') {
          APIURL = podcastCityAPIURL + collectionQuery + '+AND+coverage%3A(' + city + ')+AND+year%3A(' + year + ')';
        }
        if (intent.name === 'PlayAudioByCity' || year == '' || city == '') {
          APIURL = APIURL + '&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=1&page=' + page + '&indent=yes&output=json';
        }
        else {
          APIURL = APIURL + '&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=-downloads&rows=1&page=' + page + '&indent=yes&output=json';
        }
      }
      var options = {
        host: host,
        path: APIURL,
        method: 'GET',
        headers: {
            "User-Agent": 'Alexa_Skill_Internet_Archive'
        }
      };
      console.log('APIURL- ' + options);
      https.get(options, function (res) {
        var body = '';
        res.on('data', function (data) {
          body += data;
        });

        res.on('end', function () {
          var result = JSON.parse(body);
          if (result != null && result['response']['docs'].length > 0) {
            if ((intent.name === 'PlayAudioByCity' || intent.name == 'PlayAudio') && (year == '' || city == '')) {
              var YearList = [];
              var YearString = '';
              var CityList = [];
              var CityString = '';
              if (intent.name === 'PlayAudioByCity' && year == '') {
                for (var i = 0; i < result['response']['docs'].length; i++) {
                  YearList.push(result['response']['docs'][i]['year']);
                }
                YearList = YearList.unique();
                YearList = YearList.sort();
                for (var i = 0; i < YearList.length; i++) {
                  YearString = YearString + YearList[i] + '. ';
                }
                var cardTitle = 'Please Select Year.';
                var repromptText = '<speak> Waiting for your responce.</speak>';
                var speechOutput = "<speak> Ok , Available years for City " + city + " are " + YearString + " Please Select year.</speak>";
                var cardOutput = "Ok , Available years for City " + city + " are " + YearString + " Please Select year.";
                log("Ok , Available years for artist: " + collection + " and City: " + city + " are " + YearString, collection, city, year, APIURL, function (status) {});
                var response = {
                  version: '1.0',
                  response: {
                    outputSpeech: {
                      type: 'SSML',
                      ssml: speechOutput,
                    },
                    card: {
                      type: 'Simple',
                      title: cardTitle,
                      content: cardOutput,
                    },
                    reprompt: {
                      outputSpeech: {
                        type: 'SSML',
                        ssml: repromptText,
                      }
                    },
                    shouldEndSession: false,
                  }
                };
                return callback(0, thisOBJ, response);
              }
              else if (intent.name === 'PlayAudio' && city == '') {
                for (var i = 0; i < result['response']['docs'].length; i++) {
                  CityList.push(result['response']['docs'][i]['coverage']);
                }

                CityList = CityList.unique();
                CityList = CityList.sort();
                for (var i = 0; i < CityList.length; i++) {
                  CityString = CityString + CityList[i] + '. ';
                }

                var cardTitle = 'Please Select City.';
                var repromptText = '<speak> Waiting for your responce.</speak>';
                var speechOutput = "<speak>  Ok , Available cities for year " + year + " are " + CityString + ' Please Select city.</speak> ';
                var cardOutput = "Ok , Available cities for year " + year + " are " + CityString + ' Please Select city.';
                log("Ok , Available cities for artist: " + collection + " and  year: " + year + " are " + CityString, collection, city, year, APIURL, function (status) {});
                var response = {
                  version: '1.0',
                  response: {
                    outputSpeech: {
                      type: 'SSML',
                      ssml: speechOutput,
                    },
                    card: {
                      type: 'Simple',
                      title: cardTitle,
                      content: cardOutput,
                    },
                    reprompt: {
                      outputSpeech: {
                        type: 'SSML',
                        ssml: repromptText,
                      }
                    },
                    shouldEndSession: false,
                  }
                };
                return callback(0, thisOBJ, response);
              }

            }
            else if ((intent.name == 'PlayAudioByYearCity') || (city != '' && year != '')) {

              if (intent.name == 'PlayAudioByYearCity' || page == 0) {
                counter = 0;
                MusicUrlList = [];
              }
              if (result['response']['numFound'] < IdentifierCount) {
                used = true;
              }
              else {
                IdentifierCount++;
              }
              //New Https Request for mp3 tracks
              //track=counter+1;
              APIURLIDENTIFIER = APIURLIdentifier + result['response']['docs'][0]['identifier'] + '/files';
              var optionsIdentifier = {
                host: host,
                path: APIURLIDENTIFIER,
                method: 'GET',
                headers: {
                    "User-Agent": 'Alexa_Skill_Internet_Archive'
                }
              };
              console.log(optionsIdentifier);
              https.get(optionsIdentifier, function (responce) {
                var bodyIdentifier = '';
                responce.on('data', function (dataIdentifier) {
                  bodyIdentifier += dataIdentifier;
                });

                responce.on('end', function () {
                  var resultIdentifier = JSON.parse(bodyIdentifier);
                  if (resultIdentifier != null && resultIdentifier['result'].length > 0) {
                    var trackNumber = 0;
                    for (var i = 0; i < resultIdentifier['result'].length; i++) {
                      if (resultIdentifier['result'][i]['format'] == 'VBR MP3') {
                        if (resultIdentifier['result'][i]['title'] == undefined) {
                          trackNumber = trackNumber + 1;
                          MusicUrlList.push({
                            identifier: result['response']['docs'][0]['identifier'],
                            trackName: resultIdentifier['result'][i]['name'],
                            title: 'Track Number ' + trackNumber
                          });
                        }
                        else {
                          resultIdentifier['result'][i]['title'] = resultIdentifier['result'][i]['title'].replace(/[^a-zA-Z0-9 ]/g, "");
                          trackNumber = trackNumber + 1;
                          MusicUrlList.push({
                            identifier: result['response']['docs'][0]['identifier'],
                            trackName: resultIdentifier['result'][i]['name'],
                            title: resultIdentifier['result'][i]['title']
                          });
                        }
                        TotalTrack++;
                      }
                    }
                    console.log('TotalTrack' + TotalTrack);
                    // TotalTrack=TotalTrack+MusicUrlList.length-1;

                    var trackcounter = counter;
                    if (PlayAudioByRandomYear === true || PlayAudioByRandomCity === true || PlayAudioByRandom === true) {
                     
                      var x = trackcounter;
                     
                      audioURL = 'https://archive.org/download/' + MusicUrlList[x]['identifier'] + '/' + MusicUrlList[x]['trackName'];
                      if (PlayAudioByRandomYear == true) {
                        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, 'random', APIURL, function (status) {});
                      }
                      else if (PlayAudioByRandomCity == true) {
                        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', year, APIURL, function (status) {});
                      }
                      else if (PlayAudioByRandom == true) {
                        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', 'random', APIURL, function (status) {});
                      }

                    }
                    else {
                      audioURL = 'https://archive.org/download/' + MusicUrlList[counter]['identifier'] + '/' + MusicUrlList[counter]['trackName'];
                      log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, year, APIURL, function (status) {});
                    }

                    if (intent.name == 'autoNext') {
                      var response = {
                        version: "1.0",
                        response: {
                          shouldEndSession: true,
                          directives: [
                            {
                              type: "AudioPlayer.Play",
                              playBehavior: "REPLACE_ENQUEUED",
                              audioItem: {
                                stream: {
                                  url: audioURL,
                                  token: MusicUrlList[trackcounter]['identifier'] + counter,
                                  //expectedPreviousToken: counter - 1,
                                  offsetInMilliseconds: offsetInMilliseconds
                                }
                              }
                            }
                          ]
                        }
                      };
                      log("Result for Collection: " + collection + " ,City: " + city + " ,Year: " + year, collection, city, year, APIURL, function (status) {});
                      return callback(0, thisOBJ, response);
                    }
                    else {
                      var response = {
                        version: "1.0",
                        response: {
                          outputSpeech: {
                            type: 'PlainText',
                            text: "Playing track - " + MusicUrlList[trackcounter]['title'] + " . ",
                          },
                          card: {
                            type: 'Simple',
                            title: "Playing track number - " + track,
                            content: "Playing track number - " + track + " " + MusicUrlList[trackcounter]['title'] + " . ",
                          },
                          shouldEndSession: true,
                          directives: [
                            {
                              type: "AudioPlayer.Play",
                              playBehavior: "REPLACE_ALL",
                              audioItem: {
                                stream: {
                                  url: audioURL,
                                  token: MusicUrlList[trackcounter]['identifier'] + counter,
                                  expectedPreviousToken: null,
                                  offsetInMilliseconds: offsetInMilliseconds
                                }
                              }
                            }
                          ]
                        }
                      };
                      log("Result for Collection: " + collection + " ,City: " + city + " ,Year: " + year, collection, city, year, APIURL, function (status) {});
                      return callback(0, thisOBJ, response);
                    }




                  }
                  else {
                    var cardTitle = 'No Songs Found';
                    var repromptText = '<speak> No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
                    var speechOutput = "<speak>  Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/> random </speak>";
                    var cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or Random";
                    var response = {
                      version: '1.0',
                      response: {
                        outputSpeech: {
                          type: 'SSML',
                          ssml: speechOutput,
                        },
                        card: {
                          type: 'Simple',
                          title: cardTitle,
                          content: cardOutput,
                        },
                        reprompt: {
                          outputSpeech: {
                            type: 'SSML',
                            ssml: repromptText,
                          }
                        },
                        shouldEndSession: false,
                      }
                    };
                    return callback(0, thisOBJ, response);
                  }

                });
              }).on('error', function (e) {
                var cardTitle = 'Unable to understand your request. ';
                var repromptText = '<speak>Waiting for your responce.Please Try again by select. City and Year. or <break time=".1s"/> random.</speak>';
                var speechOutput = "<speak>Sorry , Unable to understand your request. Please Try again by select. City and Year. or <break time='.1s'/> random.</speak>";
                var cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";
                var response = {
                  version: '1.0',
                  response: {
                    outputSpeech: {
                      type: 'SSML',
                      ssml: speechOutput,
                    },
                    card: {
                      type: 'Simple',
                      title: cardTitle,
                      content: cardOutput,
                    },
                    reprompt: {
                      outputSpeech: {
                        type: 'SSML',
                        ssml: repromptText,
                      }
                    },
                    shouldEndSession: false,
                  }
                };
                return callback(0, thisOBJ, response);
              });

            }
            else if (intent.name == 'PlayAudioQuery' || searchBYTitle) {
              if (intent.name === 'PlayAudioQuery') {

                counter = 0;
                MusicUrlList = [];
                track = counter + 1;
              }

              for (var i = 0; i < result['response']['docs'].length; i++) {
                MusicUrlList.push({
                  identifier: result['response']['docs'][i]['identifier'],
                  trackName: result['response']['docs'][i]['identifier']+ '_vbr.m3u',
                  title: result['response']['docs'][i]['title']
                });
              }

              log("Result for search " + title, collection, null, null, APIURL, function (status) {});
              var trackcounter = counter;
              if (PlayAudioByRandomYear == true || PlayAudioByRandomCity == true || PlayAudioByRandom == true) {
                
                var x = trackcounter;
               
                audioURL = 'https://archive.org/download/' + MusicUrlList[counter]['identifier'] + '/' + MusicUrlList[counter]['trackName'];
                if (PlayAudioByRandomYear == true) {
                  log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, 'random', APIURL, function (status) {});
                }
                else if (PlayAudioByRandomCity == true) {
                  log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', year, APIURL, function (status) {});
                }
                else if (PlayAudioByRandom == true) {
                  log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', 'random', APIURL, function (status) {});
                }

              }
              else {
                audioURL = 'https://archive.org/download/' + MusicUrlList[counter]['identifier'] + '/' + MusicUrlList[counter]['trackName'];
                log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, year, APIURL, function (status) {});
              }

              if (intent.name == 'autoNext') {
                var response = {
                  version: "1.0",
                  response: {
                    shouldEndSession: true,
                    directives: [
                      {
                        type: "AudioPlayer.Play",
                        playBehavior: "REPLACE_ENQUEUED",
                        audioItem: {
                          stream: {
                            url: audioURL,
                            token: MusicUrlList[trackcounter]['identifier'] + counter,
                            //expectedPreviousToken: counter - 1,
                            offsetInMilliseconds: offsetInMilliseconds
                          }
                        }
                        }
                      ]
                  }
                };

                return callback(0, thisOBJ, response);
              }
              else {
                var response = {
                  version: "1.0",
                  response: {
                    outputSpeech: {
                      type: 'PlainText',
                      text: "Playing track - " + MusicUrlList[trackcounter]['title'] + " . ",
                    },
                    card: {
                      type: 'Simple',
                      title: "Playing track number - " + track,
                      content: "Playing track number - " + track + " " + MusicUrlList[trackcounter]['title'] + " . ",
                    },
                    shouldEndSession: true,
                    directives: [
                      {
                        type: "AudioPlayer.Play",
                        playBehavior: "REPLACE_ALL",
                        audioItem: {
                          stream: {
                            url: audioURL,
                            token: MusicUrlList[trackcounter]['identifier'] + counter,
                            expectedPreviousToken: null,
                            offsetInMilliseconds: offsetInMilliseconds
                          }
                        }
                        }
                      ]
                  }
                };

                return callback(0, thisOBJ, response);

              }

            }
            else if (intent.name == 'PlayAudioByRandomYear' || PlayAudioByRandomYear) {
              if (intent.name === 'PlayAudioByRandomYear') {
                counter = 0;
                MusicUrlList = [];
                track = counter + 1;
              }

              APIURLIDENTIFIER = APIURLIdentifier + result['response']['docs'][0]['identifier'] + '/files';
              var optionsIdentifier = {
                host: host,
                path: APIURLIDENTIFIER,
                method: 'GET',
                headers: {
                    "User-Agent": 'Alexa_Skill_Internet_Archive'
                }
              };
              https.get(optionsIdentifier, function (responce) {
                var bodyIdentifier = '';
                responce.on('data', function (dataIdentifier) {
                  bodyIdentifier += dataIdentifier;
                });

                responce.on('end', function () {
                  var resultIdentifier = JSON.parse(bodyIdentifier);
                  if (resultIdentifier != null && resultIdentifier['result'].length > 0) {
                    var trackNumber = 0;
                    for (var i = 0; i < resultIdentifier['result'].length; i++) {
                      if (resultIdentifier['result'][i]['format'] == 'VBR MP3') {
                        if (resultIdentifier['result'][i]['title'] == undefined) {
                          trackNumber = trackNumber + 1;
                          MusicUrlList.push({
                            identifier: result['response']['docs'][0]['identifier'],
                            trackName: resultIdentifier['result'][i]['name'],
                            title: 'Track Number ' + trackNumber
                          });
                        }
                        else {
                          trackNumber = trackNumber + 1;
                          resultIdentifier['result'][i]['title'] = resultIdentifier['result'][i]['title'].replace(/[^a-zA-Z0-9 ]/g, "");
                          MusicUrlList.push({
                            identifier: result['response']['docs'][0]['identifier'],
                            trackName: resultIdentifier['result'][i]['name'],
                            title: resultIdentifier['result'][i]['title']
                          });
                        }
                        TotalTrack++;
                      }
                    }
                    //   TotalTrack=TotalTrack+MusicUrlList.length-1;

                    var trackcounter = counter;
                    if (PlayAudioByRandomYear === true || PlayAudioByRandomCity === true || PlayAudioByRandom === true) {
                      
                      var x = trackcounter;
                     
                      audioURL = 'https://archive.org/download/' + MusicUrlList[x]['identifier'] + '/' + MusicUrlList[x]['trackName'];
                      if (PlayAudioByRandomYear == true) {
                        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, 'random', APIURL, function (status) {});
                      }
                      else if (PlayAudioByRandomCity == true) {
                        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', year, APIURL, function (status) {});
                      }
                      else if (PlayAudioByRandom == true) {
                        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', 'random', APIURL, function (status) {});
                      }

                    }
                    else {
                      audioURL = 'https://archive.org/download/' + MusicUrlList[counter]['identifier'] + '/' + MusicUrlList[counter]['trackName'];
                      log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, year, APIURL, function (status) {});
                    }

                    if (intent.name == 'autoNext') {
                      var response = {
                        version: "1.0",
                        response: {
                          shouldEndSession: true,
                          directives: [
                            {
                              type: "AudioPlayer.Play",
                              playBehavior: "REPLACE_ENQUEUED",
                              audioItem: {
                                stream: {
                                  url: audioURL,
                                  token: MusicUrlList[trackcounter]['identifier'] + counter,
                                  //expectedPreviousToken: counter - 1,
                                  offsetInMilliseconds: offsetInMilliseconds
                                }
                              }
                            }
                          ]
                        }
                      };

                      return callback(0, thisOBJ, response);

                    }
                    else {
                      var response = {
                        version: "1.0",
                        response: {
                          outputSpeech: {
                            type: 'PlainText',
                            text: "Playing track - " + MusicUrlList[trackcounter]['title'] + " . ",
                          },
                          card: {
                            type: 'Simple',
                            title: "Playing track number - " + track,
                            content: "Playing track number - " + track + " " + MusicUrlList[trackcounter]['title'] + " . ",
                          },
                          shouldEndSession: true,
                          directives: [
                            {
                              type: "AudioPlayer.Play",
                              playBehavior: "REPLACE_ALL",
                              audioItem: {
                                stream: {
                                  url: audioURL,
                                  token: MusicUrlList[trackcounter]['identifier'] + counter,
                                  expectedPreviousToken: null,
                                  offsetInMilliseconds: offsetInMilliseconds
                                }
                              }
                            }
                          ]
                        }
                      };

                      return callback(0, thisOBJ, response);
                    }



                  }
                  else {
                    var cardTitle = 'No Songs Found';
                    var repromptText = '<speak>No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
                    var speechOutput = "<speak>Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/> random.</speak>";
                    var cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or Random.";
                    var response = {
                      version: '1.0',
                      response: {
                        outputSpeech: {
                          type: 'SSML',
                          ssml: speechOutput,
                        },
                        card: {
                          type: 'Simple',
                          title: cardTitle,
                          content: cardOutput,
                        },
                        reprompt: {
                          outputSpeech: {
                            type: 'SSML',
                            ssml: repromptText,
                          }
                        },
                        shouldEndSession: false,
                      }
                    };
                    return callback(0, thisOBJ, response);
                  }

                });
              }).on('error', function (e) {
                var cardTitle = 'Unable to understand your request.';
                var repromptText = '<speak>Waiting for your responce. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
                var speechOutput = "<speak>Sorry , Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.</speak>";
                var cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";
                var response = {
                  version: '1.0',
                  response: {
                    outputSpeech: {
                      type: 'SSML',
                      ssml: speechOutput,
                    },
                    card: {
                      type: 'Simple',
                      title: cardTitle,
                      content: cardOutput,
                    },
                    reprompt: {
                      outputSpeech: {
                        type: 'SSML',
                        ssml: repromptText,
                      }
                    },
                    shouldEndSession: false,
                  }
                };
                return callback(0, thisOBJ, response);
              });

            }
            else if (intent.name == 'PlayAudioByRandomCity' || PlayAudioByRandomYear) {
              if (intent.name === 'PlayAudioByRandomCity') {

                counter = 0;
                MusicUrlList = [];
                track = counter + 1;

              }

              APIURLIDENTIFIER = APIURLIdentifier + result['response']['docs'][0]['identifier'] + '/files';
              var optionsIdentifier = {
                host: host,
                path: APIURLIDENTIFIER,
                method: 'GET',
                headers: {
                    "User-Agent": 'Alexa_Skill_Internet_Archive'
                }
              };
              https.get(optionsIdentifier, function (responce) {
                var bodyIdentifier = '';
                responce.on('data', function (dataIdentifier) {
                  bodyIdentifier += dataIdentifier;
                });

                responce.on('end', function () {
                  var resultIdentifier = JSON.parse(bodyIdentifier);
                  if (resultIdentifier != null && resultIdentifier['result'].length > 0) {
                    var trackNumber = 0;
                    for (var i = 0; i < resultIdentifier['result'].length; i++) {
                      if (resultIdentifier['result'][i]['format'] == 'VBR MP3') {
                        if (resultIdentifier['result'][i]['title'] == undefined) {
                          trackNumber = trackNumber + 1;
                          MusicUrlList.push({
                            identifier: result['response']['docs'][0]['identifier'],
                            trackName: resultIdentifier['result'][i]['name'],
                            title: 'Track Number ' + trackNumber
                          });
                        }
                        else {
                          trackNumber = trackNumber + 1;
                          resultIdentifier['result'][i]['title'] = resultIdentifier['result'][i]['title'].replace(/[^a-zA-Z0-9 ]/g, "");
                          MusicUrlList.push({
                            identifier: result['response']['docs'][0]['identifier'],
                            trackName: resultIdentifier['result'][i]['name'],
                            title: resultIdentifier['result'][i]['title']
                          });
                        }
                        TotalTrack++;
                      }
                    }
                    // TotalTrack=TotalTrack+MusicUrlList.length-1;

                    var trackcounter = counter;
                    if (PlayAudioByRandomYear === true || PlayAudioByRandomCity === true || PlayAudioByRandom === true) {
                     
                      var x = trackcounter;
                     
                      audioURL = 'https://archive.org/download/' + MusicUrlList[x]['identifier'] + '/' + MusicUrlList[x]['trackName'];
                      if (PlayAudioByRandomYear == true) {
                        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, 'random', APIURL, function (status) {});
                      }
                      else if (PlayAudioByRandomCity == true) {
                        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', year, APIURL, function (status) {});
                      }
                      else if (PlayAudioByRandom == true) {
                        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', 'random', APIURL, function (status) {});
                      }

                    }
                    else {
                      audioURL = 'https://archive.org/download/' + MusicUrlList[counter]['identifier'] + '/' + MusicUrlList[counter]['trackName'];
                      log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, year, APIURL, function (status) {});
                    }

                    if (intent.name == 'autoNext') {
                      var response = {
                        version: "1.0",
                        response: {
                          shouldEndSession: true,
                          directives: [
                            {
                              type: "AudioPlayer.Play",
                              playBehavior: "REPLACE_ENQUEUED",
                              audioItem: {
                                stream: {
                                  url: audioURL,
                                  token: MusicUrlList[trackcounter]['identifier'] + counter,
                                  //expectedPreviousToken: counter - 1,
                                  offsetInMilliseconds: offsetInMilliseconds
                                }
                              }
                              }
                            ]
                        }
                      };

                      return callback(0, thisOBJ, response);
                    }
                    else {
                      var response = {
                        version: "1.0",
                        response: {
                          outputSpeech: {
                            type: 'PlainText',
                            text: "Playing track - " + MusicUrlList[trackcounter]['title'] + " . ",
                          },
                          card: {
                            type: 'Simple',
                            title: "Playing track number - " + track,
                            content: "Playing track number - " + track + " " + MusicUrlList[trackcounter]['title'] + " . ",
                          },
                          shouldEndSession: true,
                          directives: [
                            {
                              type: "AudioPlayer.Play",
                              playBehavior: "REPLACE_ALL",
                              audioItem: {
                                stream: {
                                  url: audioURL,
                                  token: MusicUrlList[trackcounter]['identifier'] + counter,
                                  expectedPreviousToken: null,
                                  offsetInMilliseconds: offsetInMilliseconds
                                }
                              }
                              }
                            ]
                        }
                      };

                      return callback(0, thisOBJ, response);
                    }
                  }
                  else {
                    var cardTitle = 'No Songs Found';
                    var repromptText = '<speak>No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
                    var speechOutput = "<speak>Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/> random.</speak>";
                    var cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or Random.";
                    var response = {
                      version: '1.0',
                      response: {
                        outputSpeech: {
                          type: 'SSML',
                          ssml: speechOutput,
                        },
                        card: {
                          type: 'Simple',
                          title: cardTitle,
                          content: cardOutput,
                        },
                        reprompt: {
                          outputSpeech: {
                            type: 'SSML',
                            ssml: repromptText,
                          }
                        },
                        shouldEndSession: false,
                      }
                    };
                    return callback(0, thisOBJ, response);
                  }

                });
              }).on('error', function (e) {
                var cardTitle = 'Unable to understand your request.';
                var repromptText = '<speak>Waiting for your responce. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
                var speechOutput = "<speak>Sorry , Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.</speak>";
                var cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";
                var response = {
                  version: '1.0',
                  response: {
                    outputSpeech: {
                      type: 'SSML',
                      ssml: speechOutput,
                    },
                    card: {
                      type: 'Simple',
                      title: cardTitle,
                      content: cardOutput,
                    },
                    reprompt: {
                      outputSpeech: {
                        type: 'SSML',
                        ssml: repromptText,
                      }
                    },
                    shouldEndSession: false,
                  }
                };
                return callback(0, thisOBJ, response);
              });
            }
            else if (intent.name == 'PlayAudioByRandom' || PlayAudioByRandom) {
              if (intent.name === 'PlayAudioByRandom') {

                counter = 0;
                MusicUrlList = [];
                track = counter + 1;
              }

              APIURLIDENTIFIER = APIURLIdentifier + result['response']['docs'][0]['identifier'] + '/files';
              var optionsIdentifier = {
                host: host,
                path: APIURLIDENTIFIER,
                method: 'GET',
                headers: {
                    "User-Agent": 'Alexa_Skill_Internet_Archive'
                }
              };
              https.get(optionsIdentifier, function (responce) {
                var bodyIdentifier = '';
                responce.on('data', function (dataIdentifier) {
                  bodyIdentifier += dataIdentifier;
                });

                responce.on('end', function () {
                  var resultIdentifier = JSON.parse(bodyIdentifier);
                  if (resultIdentifier != null && resultIdentifier['result'].length > 0) {
                    var trackNumber = 0;
                    for (var i = 0; i < resultIdentifier['result'].length; i++) {
                      if (resultIdentifier['result'][i]['format'] == 'VBR MP3') {
                        if (resultIdentifier['result'][i]['title'] == undefined) {

                          trackNumber = trackNumber + 1;
                          MusicUrlList.push({
                            identifier: result['response']['docs'][0]['identifier'],
                            trackName: resultIdentifier['result'][i]['name'],
                            title: 'Track Number ' + trackNumber
                          });
                        }
                        else {
                          trackNumber = trackNumber + 1;
                          resultIdentifier['result'][i]['title'] = resultIdentifier['result'][i]['title'].replace(/[^a-zA-Z0-9 ]/g, "");
                          MusicUrlList.push({
                            identifier: result['response']['docs'][0]['identifier'],
                            trackName: resultIdentifier['result'][i]['name'],
                            title: resultIdentifier['result'][i]['title']
                          });
                        }
                        TotalTrack++;
                      }
                    }
                    // TotalTrack=TotalTrack+MusicUrlList.length-1;
                    // console.log('TrackCount -'+TotalTrack);
                    // console.log('Array Size -'+MusicUrlList.length);
                    var trackcounter = counter;
                    if (PlayAudioByRandomYear === true || PlayAudioByRandomCity === true || PlayAudioByRandom === true) {
                      
                      var x = trackcounter;
                     
                      audioURL = 'https://archive.org/download/' + MusicUrlList[x]['identifier'] + '/' + MusicUrlList[x]['trackName'];
                      if (PlayAudioByRandomYear == true) {
                        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, 'random', APIURL, function (status) {});
                      }
                      else if (PlayAudioByRandomCity == true) {
                        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', year, APIURL, function (status) {});
                      }
                      else if (PlayAudioByRandom == true) {
                        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', 'random', APIURL, function (status) {});
                      }

                    }
                    else {
                      audioURL = 'https://archive.org/download/' + MusicUrlList[counter]['identifier'] + '/' + MusicUrlList[counter]['trackName'];
                      log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, year, APIURL, function (status) {});
                    }

                    if (intent.name == 'autoNext') {

                      var response = {
                        version: "1.0",
                        response: {
                          shouldEndSession: true,
                          directives: [
                            {
                              type: "AudioPlayer.Play",
                              playBehavior: "REPLACE_ENQUEUED",
                              audioItem: {
                                stream: {
                                  url: audioURL,
                                  token: MusicUrlList[trackcounter]['identifier'] + counter,
                                  //expectedPreviousToken: counter - 1,
                                  offsetInMilliseconds: offsetInMilliseconds
                                }
                              }
                              }
                            ]
                        }
                      };

                      return callback(0, thisOBJ, response);
                    }
                    else {
                      var response = {
                        version: "1.0",
                        response: {
                          outputSpeech: {
                            type: 'PlainText',
                            text: "Playing track - " + MusicUrlList[trackcounter]['title'] + " . ",
                          },
                          card: {
                            type: 'Simple',
                            title: "Playing track number - " + track,
                            content: "Playing track number - " + track + " " + MusicUrlList[trackcounter]['title'] + " . ",
                          },
                          shouldEndSession: true,
                          directives: [
                            {
                              type: "AudioPlayer.Play",
                              playBehavior: "REPLACE_ALL",
                              audioItem: {
                                stream: {
                                  url: audioURL,
                                  token: MusicUrlList[trackcounter]['identifier'] + counter,
                                  expectedPreviousToken: null,
                                  offsetInMilliseconds: offsetInMilliseconds
                                }
                              }
                              }
                            ]
                        }
                      };

                      return callback(0, thisOBJ, response);
                    }



                  }
                  else {
                    var cardTitle = 'No Songs Found';
                    var repromptText = '<speak>No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
                    var speechOutput = "<speak>Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/> random.</speak>";
                    var cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or Random.";
                    var response = {
                      version: '1.0',
                      response: {
                        outputSpeech: {
                          type: 'SSML',
                          ssml: speechOutput,
                        },
                        card: {
                          type: 'Simple',
                          title: cardTitle,
                          content: cardOutput,
                        },
                        reprompt: {
                          outputSpeech: {
                            type: 'SSML',
                            ssml: repromptText,
                          }
                        },
                        shouldEndSession: false,
                      }
                    };
                    return callback(0, thisOBJ, response);
                  }

                });
              }).on('error', function (e) {
                var cardTitle = 'Unable to understand your request.';
                var repromptText = '<speak>Waiting for your responce. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
                var speechOutput = "<speak>Sorry , Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.</speak>";
                var cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";
                var response = {
                  version: '1.0',
                  response: {
                    outputSpeech: {
                      type: 'SSML',
                      ssml: speechOutput,
                    },
                    card: {
                      type: 'Simple',
                      title: cardTitle,
                      content: cardOutput,
                    },
                    reprompt: {
                      outputSpeech: {
                        type: 'SSML',
                        ssml: repromptText,
                      }
                    },
                    shouldEndSession: false,
                  }
                };
                return callback(0, thisOBJ, response);
              });
            }


          }
          else {

            if (PlayAudioByRandom) {
              log("Sorry , No result found for command play " + collection + " random  ", collection, 'random', 'random', APIURL, function (status) {});

            }
            else {
              log("Sorry , No result found for command play " + collection + " " + city + " " + year + "   ", collection, city, year, APIURL, function (status) {});
            }
            year = '';
            city = '';
            var cardTitle = 'No Songs Found';
            var repromptText = '<speak>No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
            var speechOutput = "<speak>Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/>  random.</speak>";
            var cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or random.";
            var response = {
              version: '1.0',
              response: {
                outputSpeech: {
                  type: 'SSML',
                  ssml: speechOutput,
                },
                card: {
                  type: 'Simple',
                  title: cardTitle,
                  content: cardOutput,
                },
                reprompt: {
                  outputSpeech: {
                    type: 'SSML',
                    ssml: repromptText,
                  }
                },
                shouldEndSession: false,
              }
            };
            return callback(0, thisOBJ, response);

          }

        });
      }).on('error', function (e) {
        year = '';
        city = '';
        var cardTitle = 'Unable to understand your request.';
        var repromptText = '<speak>Waiting for your responce. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
        var speechOutput = "<speak>Sorry , Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.</speak>";
        var cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";
        var response = {
          version: '1.0',
          response: {
            outputSpeech: {
              type: 'SSML',
              ssml: speechOutput,
            },
            card: {
              type: 'Simple',
              title: cardTitle,
              content: cardOutput,
            },
            reprompt: {
              outputSpeech: {
                type: 'SSML',
                ssml: repromptText,
              }
            },
            shouldEndSession: false,
          }
        };
        return callback(0, thisOBJ, response);
      });
    }
    else {
      var cardTitle = 'Unable to understand your request.';
      var repromptText = '<speak>Waiting for your responce. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
      var speechOutput = "<speak>Sorry, Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.</speak>";
      var cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";

      var response = {
        version: '1.0',
        response: {
          outputSpeech: {
            type: 'SSML',
            ssml: speechOutput,
          },
          card: {
            type: 'Simple',
            title: cardTitle,
            content: cardOutput,
          },
          reprompt: {
            outputSpeech: {
              type: 'SSML',
              ssml: repromptText,
            }
          },
          shouldEndSession: false,
        }
      };
      return callback(0, thisOBJ, response);

    }
  }
  else {
    var cardTitle = 'Please select artist';
    var repromptText = "<speak>Please select an artist by saying.<break time='.5s'/> artist name.<break time='.5s'/> Like The Ditty Bops.<break time='.5s'/> Or  Cowboy Junkies.<break time='.5s'/> Or  GratefulDead.</speak>";
    var speechOutput = "<speak>Please select an artist by saying.<break time='.5s'/> artist name.<break time='.5s'/> Like The Ditty Bops.<break time='.5s'/> Or  Cowboy Junkies.<break time='.5s'/> Or  GratefulDead.</speak>";
    var cardOutput = "Please select an artist by saying Artist name. Like The Ditty Bops, Cowboy Junkies or  GratefulDead.";

    var response = {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'SSML',
          ssml: speechOutput,
        },
        card: {
          type: 'Simple',
          title: cardTitle,
          content: cardOutput,
        },
        reprompt: {
          outputSpeech: {
            type: 'SSML',
            ssml: repromptText,
          }
        },
        shouldEndSession: false,
      }
    };
    return callback(0, thisOBJ, response);
  }
}

function getOneGoPlayAudio(intent, counter, thisOBJ, offsetInMilliseconds, callback) {
    var track = counter + 1;

    if ((MusicUrlList.length > 0 && intent.name != 'OneGoPlayAudio' && intent.name != 'OneGoCollectionRandomPlayAudio' && typeQuery === false)) {
      if (track > MusicUrlList.length) {
        counter = 0;
        track = counter + 1;
      }
      // console.log('test');
      var trackcounter = counter;
      if (OneGoCollectionRandomPlayAudioStatus === true) {
        // var start = TotalTrack - (MusicUrlList.length - 1);
        // var end = TotalTrack;
        // var x = Math.floor((Math.random() * end) + start);
        // console.log('Track - ' + x);
        // console.log('Start - ' + start);
        // console.log('End - ' + end);
        // trackcounter = x;
        var x= trackcounter;
        audioURL = 'https://archive.org/download/' + MusicUrlList[x]['identifier'] + '/' + MusicUrlList[x]['trackName'];
        if (OneGoCollectionRandomPlayAudioStatus == true) {
          log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', 'random', APIURL, function (status) {});
        }

      }else {
        audioURL = 'https://archive.org/download/' + MusicUrlList[trackcounter]['identifier'] + '/' + MusicUrlList[trackcounter]['trackName'];
        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, year, APIURL, function (status) {});
      }
      // console.log(intent.name);
      if (intent.name == 'autoNext') {
        var response = {
          version: "1.0",
          response: {
            directives: [
              {
                type: "AudioPlayer.Play",
                playBehavior: "REPLACE_ENQUEUED",
                audioItem: {
                  stream: {
                    url: audioURL,
                    token: MusicUrlList[trackcounter]['identifier'] + counter,
                    //expectedPreviousToken: counter - 1,
                    offsetInMilliseconds: offsetInMilliseconds
                  }
                }
              }
            ],
            shouldEndSession: true
          }
        };
        console.log(audioURL);
        console.log(counter);
        console.log(offsetInMilliseconds);
        return callback(0, thisOBJ, response);
      }
      else {
        var response = {
          version: "1.0",
          response: {
            outputSpeech: {
              type: 'PlainText',
              text: "Playing track - " + MusicUrlList[trackcounter]['title'] + " . ",
            },
            card: {
              type: 'Simple',
              title: "Playing track number - " + track,
              content: "Playing track - " + MusicUrlList[trackcounter]['title'] + " . ",
            },
            shouldEndSession: true,
            directives: [
              {
                type: "AudioPlayer.Play",
                playBehavior: "REPLACE_ALL",
                audioItem: {
                  stream: {
                    url: audioURL,
                    token: MusicUrlList[trackcounter]['identifier'] + counter,
                    expectedPreviousToken: null,
                    offsetInMilliseconds: offsetInMilliseconds
                  }
                }
              }
            ]
          }
        };
        return callback(0, thisOBJ, response);
      }


    }
    else if (intent.name == 'OneGoPlayAudio'  || typeQuery === true || intent.name == 'OneGoCollectionRandomPlayAudio') {

      if (intent.name == 'OneGoPlayAudio' || intent.name == 'OneGoCollectionRandomPlayAudio') {
          if (OneGoCollectionRandomPlayAudioStatus == false) {
            city = intent.slots.CITY.value
            year = intent.slots.YEAR.value;
          }
          collection = intent.slots.COLLECTION.value;
          var collection_real_name = intent.slots.COLLECTION.value
          if (collection != '' || collection != undefined) {
        
            collectionQuery = '';
            var collectionArray = collection.split(/[ ,]+/);
        
            if (collectionArray.length > 1) {
              collectionQuery = collectionQuery + '(';
        
              for (var i = 1; i < collectionArray.length; i++) {
                collectionQuery = collectionQuery + collectionArray[i];
              }
        
              collectionQuery = collectionQuery + ')+OR+collection:(';
              for (var i = 0; i < collectionArray.length - 1; i++) {
                collectionQuery = collectionQuery + collectionArray[i];
              }
        
              collection = collection.replace(/ /g, '');
              collectionQuery = '(' + collectionQuery + ')+OR+collection:(' + collection + ')+OR+collection:(the' + collection + '))';
            }
            else {
              collection = collection.replace(/ /g, '');
              collectionQuery = '(' + collectionQuery + '(' + collection + ')+OR+collection:(the' + collection + '))';
            }
            
            if (OneGoCollectionRandomPlayAudioStatus == true) {
              
              APIURL = podcastCityAPIURL + collectionQuery + '&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=1&page=' + page + '&indent=yes&output=json';
            }else{
              APIURL = podcastCityAPIURL + collectionQuery + '+AND+coverage%3A(' + city + ')+AND+year%3A(' + year + ')&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=downloads desc&rows=1&page=' + page + '&indent=yes&output=json';
            }
        
         
      }else {
        if (used) {
          year = '';
          city = '';
          used = false;
        }
        if (OneGoCollectionRandomPlayAudioStatus == true) {
          APIURL = podcastCityAPIURL + collectionQuery + '&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=1&page=' + page + '&indent=yes&output=json';
        }else{
          APIURL = podcastCityAPIURL + collectionQuery + '+AND+coverage%3A(' + city + ')+AND+year%3A(' + year + ')&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=-downloads&rows=1&page=' + page + '&indent=yes&output=json';
        }
      }
      console.log('APIURL- ' + APIURL);
      var options= {
        host: host,
        path: APIURL,
        method: 'GET',
        headers: {
            "User-Agent": 'Alexa_Skill_Internet_Archive'
        }
      };
      https.get(options, function (res) {
        var body = '';
        res.on('data', function (data) {
          body += data;
        });

        res.on('end', function () {
          var result = JSON.parse(body);
          if (result != null && result['response']['docs'].length > 0) {
           if ((intent.name == 'OneGoPlayAudio') || (intent.name == 'OneGoCollectionRandomPlayAudio') || (((city != '' && year != '') || OneGoCollectionRandomPlayAudioStatus==true)  && collectionQuery != '')) {

              if (intent.name == 'OneGoPlayAudio' || intent.name == 'OneGoCollectionRandomPlayAudio' || page == 0) {
                counter = 0;
                MusicUrlList = [];
              }
              if (result['response']['numFound'] < IdentifierCount) {
                used = true;
              }
              else {
                IdentifierCount++;
              }
              //New Https Request for mp3 tracks
              //track=counter+1;
              APIURLIDENTIFIER = APIURLIdentifier + result['response']['docs'][0]['identifier'] + '/files';
              var optionsIdentifier= {
                host: host,
                path: APIURLIDENTIFIER,
                method: 'GET',
                headers: {
                    "User-Agent": 'Alexa_Skill_Internet_Archive'
                }
              };
              console.log(optionsIdentifier);
              https.get(optionsIdentifier, function (responce) {
                var bodyIdentifier = '';
                responce.on('data', function (dataIdentifier) {
                  bodyIdentifier += dataIdentifier;
                });

                responce.on('end', function () {
                  var resultIdentifier = JSON.parse(bodyIdentifier);
                  if (resultIdentifier != null && resultIdentifier['result'].length > 0) {
                    var trackNumber = 0;
                    for (var i = 0; i < resultIdentifier['result'].length; i++) {
                      if (resultIdentifier['result'][i]['format'] == 'VBR MP3') {
                        if (resultIdentifier['result'][i]['title'] == undefined) {
                          trackNumber = trackNumber + 1;
                          MusicUrlList.push({
                            identifier: result['response']['docs'][0]['identifier'],
                            trackName: resultIdentifier['result'][i]['name'],
                            title: 'Track Number ' + trackNumber
                          });
                        }
                        else {
                          resultIdentifier['result'][i]['title'] = resultIdentifier['result'][i]['title'].replace(/[^a-zA-Z0-9 ]/g, "");
                          trackNumber = trackNumber + 1;
                          MusicUrlList.push({
                            identifier: result['response']['docs'][0]['identifier'],
                            trackName: resultIdentifier['result'][i]['name'],
                            title: resultIdentifier['result'][i]['title']
                          });
                        }
                        TotalTrack++;
                      }
                    }
                    console.log('TotalTrack' + TotalTrack);
                    // TotalTrack=TotalTrack+MusicUrlList.length-1;

                    var trackcounter = counter;
                    if (OneGoCollectionRandomPlayAudioStatus === true) {
                      var x=trackcounter;
                      console.log(x);
                      audioURL = 'https://archive.org/download/' + MusicUrlList[x]['identifier'] + '/' + MusicUrlList[x]['trackName'];
                      if (OneGoCollectionRandomPlayAudioStatus == true) {
                        log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, 'random', 'random', APIURL, function (status) {});
                      }

                    }else {
                      audioURL = 'https://archive.org/download/' + MusicUrlList[counter]['identifier'] + '/' + MusicUrlList[counter]['trackName'];
                      log("Playing Track URL - " + audioURL + " And Track Name - " + MusicUrlList[trackcounter]['title'], collection, city, year, APIURL, function (status) {});
                    }

                    if (intent.name == 'autoNext') {
                      var response = {
                        version: "1.0",
                        response: {
                          shouldEndSession: true,
                          directives: [
                            {
                              type: "AudioPlayer.Play",
                              playBehavior: "REPLACE_ENQUEUED",
                              audioItem: {
                                stream: {
                                  url: audioURL,
                                  token: MusicUrlList[trackcounter]['identifier'] + counter,
                                  //expectedPreviousToken: counter - 1,
                                  offsetInMilliseconds: offsetInMilliseconds
                                }
                              }
                            }
                          ]
                        }
                      };
                      if (OneGoCollectionRandomPlayAudioStatus == true) {
                        log("Result for Collection: " + collection + " ,City: random ,Year: random", collection, 'random', 'random', APIURL, function (status) {});
                      
                      }else{
                        log("Result for Collection: " + collection + " ,City: " + city + " ,Year: " + year, collection, city, year, APIURL, function (status) {});
                      
                      }
                      return callback(0, thisOBJ, response);
                    }
                    else {
                      var response = {
                        version: "1.0",
                        response: {
                          outputSpeech: {
                            type: 'PlainText',
                            text: "Playing track - " + MusicUrlList[trackcounter]['title'] + " . ",
                          },
                          card: {
                            type: 'Simple',
                            title: "Playing track number - " + track,
                            content: "Playing track number - " + track + " " + MusicUrlList[trackcounter]['title'] + " . ",
                          },
                          shouldEndSession: true,
                          directives: [
                            {
                              type: "AudioPlayer.Play",
                              playBehavior: "REPLACE_ALL",
                              audioItem: {
                                stream: {
                                  url: audioURL,
                                  token: MusicUrlList[trackcounter]['identifier'] + counter,
                                  expectedPreviousToken: null,
                                  offsetInMilliseconds: offsetInMilliseconds
                                }
                              }
                            }
                          ]
                        }
                      };
                      log("Result for Collection: " + collection + " ,City: " + city + " ,Year: " + year, collection, city, year, APIURL, function (status) {});
                      return callback(0, thisOBJ, response);
                    }




                  }
                  else {
                    var cardTitle = 'No Songs Found';
                    var repromptText = '<speak> No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
                    var speechOutput = "<speak>  Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/> random </speak>";
                    var cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or Random";
                    var response = {
                      version: '1.0',
                      response: {
                        outputSpeech: {
                          type: 'SSML',
                          ssml: speechOutput,
                        },
                        card: {
                          type: 'Simple',
                          title: cardTitle,
                          content: cardOutput,
                        },
                        reprompt: {
                          outputSpeech: {
                            type: 'SSML',
                            ssml: repromptText,
                          }
                        },
                        shouldEndSession: false,
                      }
                    };
                    return callback(0, thisOBJ, response);
                  }

                });
              }).on('error', function (e) {
                var cardTitle = 'Unable to understand your request. ';
                var repromptText = '<speak>Waiting for your responce.Please Try again by select. City and Year. or <break time=".1s"/> random.</speak>';
                var speechOutput = "<speak>Sorry , Unable to understand your request. Please Try again by select. City and Year. or <break time='.1s'/> random.</speak>";
                var cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";
                var response = {
                  version: '1.0',
                  response: {
                    outputSpeech: {
                      type: 'SSML',
                      ssml: speechOutput,
                    },
                    card: {
                      type: 'Simple',
                      title: cardTitle,
                      content: cardOutput,
                    },
                    reprompt: {
                      outputSpeech: {
                        type: 'SSML',
                        ssml: repromptText,
                      }
                    },
                    shouldEndSession: false,
                  }
                };
                return callback(0, thisOBJ, response);
              });

            }
          }
          else {

            if (PlayAudioByRandom) {
              log("Sorry , No result found for command play " + collection + " random  ", collection, 'random', 'random', APIURL, function (status) {});

            }
            else {
              log("Sorry , No result found for command play " + collection + " " + city + " " + year + "   ", collection, city, year, APIURL, function (status) {});
            }
            year = '';
            city = '';
            var cardTitle = 'No Songs Found';
            var repromptText = '<speak>No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
            var speechOutput = "<speak>Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/>  random.</speak>";
            var cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or random.";
            var response = {
              version: '1.0',
              response: {
                outputSpeech: {
                  type: 'SSML',
                  ssml: speechOutput,
                },
                card: {
                  type: 'Simple',
                  title: cardTitle,
                  content: cardOutput,
                },
                reprompt: {
                  outputSpeech: {
                    type: 'SSML',
                    ssml: repromptText,
                  }
                },
                shouldEndSession: false,
              }
            };
            return callback(0, thisOBJ, response);

          }

        });
      }).on('error', function (e) {
        year = '';
        city = '';
        var cardTitle = 'Unable to understand your request.';
        var repromptText = '<speak>Waiting for your responce. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
        var speechOutput = "<speak>Sorry , Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.</speak>";
        var cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";
        var response = {
          version: '1.0',
          response: {
            outputSpeech: {
              type: 'SSML',
              ssml: speechOutput,
            },
            card: {
              type: 'Simple',
              title: cardTitle,
              content: cardOutput,
            },
            reprompt: {
              outputSpeech: {
                type: 'SSML',
                ssml: repromptText,
              }
            },
            shouldEndSession: false,
          }
        };
        return callback(0, thisOBJ, response);
      });
      }else {
        var cardTitle = 'Unable to understand your request.';
        var repromptText = '<speak>Waiting for your responce. Please Try again by saying. City and Year. or <break time=".1s"/> random.</speak>';
        var speechOutput = "<speak>Sorry, Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.</speak>";
        var cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";
  
        var response = {
          version: '1.0',
          response: {
            outputSpeech: {
              type: 'SSML',
              ssml: speechOutput,
            },
            card: {
              type: 'Simple',
              title: cardTitle,
              content: cardOutput,
            },
            reprompt: {
              outputSpeech: {
                type: 'SSML',
                ssml: repromptText,
              }
            },
            shouldEndSession: false,
          }
        };
        return callback(0, thisOBJ, response);
  
      }
    }
  
}

MyAudioPlayer.prototype.handleSessionEndRequest = function () {
  var cardTitle = 'Good bye';
  var speechOutput = "<speak>Thanks for rocking with the internet archive’s live music collection!</speak>";
  var cradOutput = "Thanks for rocking with the internet archive’s live music collection!";
  var response = {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'SSML',
        ssml: speechOutput,
      },
      card: {
        type: 'Simple',
        title: cardTitle,
        content: cradOutput,
      },
      shouldEndSession: true,
      directives: [
        {
          type: "AudioPlayer.Stop"
        }
      ]
    }
  };
  this.context.succeed(response);
}

function log(Title, Collection, City, Year, Url, callback) {
  var url = "http://alexa.appunison.in:5557/admin/savelog?identifierName=" + Collection + "&title=" + Title + "&city=" + City + "&year=" + Year + "&url=" + Url + "&resltJson=null";
  console.log(url);
  http.get(url, function (res) {
    var body = '';
    res.on('data', function (data) {
      body += data;
    });
    res.on('end', function () {
      callback(true);

    });
  }).on('error', function (e) {
    callback(true);
  });
}

MyAudioPlayer.prototype.getCollection = function (intent) {
  var CurrentObject = this;
  collection = intent.slots.COLLECTION.value;
  var collection_real_name = intent.slots.COLLECTION.value
  if (collection != '' || collection != undefined) {

    collectionQuery = '';
    var collectionArray = collection.split(/[ ,]+/);

    if (collectionArray.length > 1) {
      collectionQuery = collectionQuery + '(';

      for (var i = 1; i < collectionArray.length; i++) {
        collectionQuery = collectionQuery + collectionArray[i];
      }

      collectionQuery = collectionQuery + ')+OR+collection:(';
      for (var i = 0; i < collectionArray.length - 1; i++) {
        collectionQuery = collectionQuery + collectionArray[i];
      }

      collection = collection.replace(/ /g, '');
      collectionQuery = '('+ collectionQuery + ')+OR+collection:(' + collection + ')+OR+collection:(the' + collection + '))';
    }
    else {
      collection = collection.replace(/ /g, '');
      collectionQuery = '(' + collectionQuery + '('+ collection +')+OR+collection:(the' + collection + '))';
    }

   var checkCollectionUrl = podcastAPIURL + collectionQuery + '&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=-downloads&rows=50&page=0&indent=yes&output=json';
   //  var checkCollectionUrl = podcastAPIURL + '&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=downloads desc&rows=50&page=0&indent=yes&output=json';
    
    var options= {
      host: host,
      path: checkCollectionUrl,
      method: 'GET',
      headers: {
          "User-Agent" : 'Alexa_Skill_Internet_Archive'
      }
    };
    console.log(options);
    https.get(options, function (res) {
      var body = '';
      res.on('data', function (data) {
        body += data;
      });
      CityName = 'Los Angeles';
      YearName = '1971';
      res.on('end', function () {
        var resultCollection = JSON.parse(body);
        console.log(resultCollection['response']['docs'].length);
        if (resultCollection != null && resultCollection['response']['docs'].length > 0) {
          //http to node server collection title city =null year=null url=checkCollectionUrl resultCollection =result
          for (var i = 0; i < resultCollection['response']['docs'].length; i++) {
            if (resultCollection['response']['docs'][i]['coverage'] != '' && resultCollection['response']['docs'][i]['coverage'] != undefined && resultCollection['response']['docs'][i]['year'] != '' && resultCollection['response']['docs'][i]['year'] != undefined) {
              if (resultCollection['response']['docs'][i]['coverage'].includes(",")) {
                var resCity = resultCollection['response']['docs'][i]['coverage'].split(",");
                CityName = resCity[0];
                YearName = resultCollection['response']['docs'][i]['year'];
                break;
              }
            }
          }
          var cardTitle = 'Provide City and Year';
          var repromptText = "<speak>Please tell me what city and year you would like to hear..<break time='.5s'/> for example " + CityName + " " + YearName + "  or <break time='.1s'/>  random.</speak>";
          var cardOutput = collection_real_name + " has been selected. Now, tell me what city and year you would like to hear. for example " + CityName + " " + YearName + " or random.";

          var speechOutput = "<speak>" + collection_real_name + " has been selected.<break time='.5s'/> Now Please select City and Year or <break time='.1s'/>  random. <break time='.5s'/> Like " + CityName + " " + YearName + " or <break time='.1s'/> random.</speak>";
          var response = {
            version: '1.0',
            response: {
              outputSpeech: {
                type: 'SSML',
                ssml: speechOutput,
              },
              card: {
                type: 'Simple',
                title: cardTitle,
                content: cardOutput,
              },
              reprompt: {
                outputSpeech: {
                  type: 'SSML',
                  ssml: repromptText,
                }
              },
              shouldEndSession: false,
            }
          };


          log("The Collection " + collection + " has been selected.", collection, null, null, checkCollectionUrl, function (status) {

          });
          CurrentObject.context.succeed(response);

        }
        else {
          var cardTitle = 'Collection not exists';
          var repromptText = "<speak>" + collection_real_name + " has no song.<break time='.5s'/> Please Try again by saying.<break time='.5s'/> artist name.<break time='.5s'/> Like The Ditty Bops.<break time='.5s'/> Or   Cowboy Junkies.<break time='.5s'/> Or  GratefulDead.</speak>";
          var speechOutput = "<speak>Sorry, " + collection_real_name + " has no song. Please Try again by saying.<break time='.5s'/> artist name.<break time='.5s'/> Like The Ditty Bops.<break time='.5s'/> Or  Cowboy Junkies.<break time='.5s'/> Or GratefulDead.</speak>";
          var cardOutput = "Sorry, " + collection_real_name + " has no song. Please try again by saying ARTIST NAME like The Ditty Bops, Cowboy Junkies Or GratefulDead.";

          var response = {
            version: '1.0',
            response: {
              outputSpeech: {
                type: 'SSML',
                ssml: speechOutput,
              },
              card: {
                type: 'Simple',
                title: cardTitle,
                content: cardOutput,
              },
              reprompt: {
                outputSpeech: {
                  type: 'SSML',
                  ssml: repromptText,
                }
              },
              shouldEndSession: false,
            }
          };
          log("Sorry Collection: " + collection + " has no songs.", collection, null, null, checkCollectionUrl, function (status) {

          });
          collection = '';
          CurrentObject.context.succeed(response);
        }

      });
    }).on('error', function (e) {

      var cardTitle = 'Waiting for your responce.';
      var repromptText = "<speak>Unable to understand your request. Please Try again by saying. artist name. Like  The Ditty Bops.<break time='.5s'/> Or  Cowboy Junkies.<break time='.5s'/> Or GratefulDead.</speak>";
      var speechOutput = "<speak>Sorry , Unable to understand your request. Please Try again by saying. artist name. Like The Ditty Bops.<break time='.5s'/> Or  Cowboy Junkies.<break time='.5s'/> Or GratefulDead.</speak>";
      var cardOutput = "Sorry, unable to understand your request. Please Try again by saying, ARTIST NAME like The Ditty Bops, Cowboy Junkies, Or GratefulDead.";
      var response = {
        version: '1.0',
        response: {
          outputSpeech: {
            type: 'SSML',
            ssml: speechOutput,
          },
          card: {
            type: 'Simple',
            title: cardTitle,
            content: cardOutput,
          },
          reprompt: {
            outputSpeech: {
              type: 'SSML',
              ssml: repromptText,
            }
          },
          shouldEndSession: false,
        }
      };
      log("Sorry, Unable to understand your request for collection: " + collection + " request ", collection, null, null, checkCollectionUrl, function (status) {});
      collection = '';
      CurrentObject.context.succeed(response);
    });
  }
  else {
    var cardTitle = 'Please provide valid artist';
    var repromptText = "<speak>Waiting for your responce.</speak>";
    var speechOutput = "<speak>Please provide a artist name.</speak>";
    var cardOutput = "Please provide a ARTIST NAME.";
    var response = {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'SSML',
          ssml: speechOutput,
        },
        card: {
          type: 'Simple',
          title: cardTitle,
          content: cardOutput,
        },
        reprompt: {
          outputSpeech: {
            type: 'SSML',
            ssml: repromptText,
          }
        },
        shouldEndSession: false,
      }
    };
    CurrentObject.context.succeed(response);
  }
}

MyAudioPlayer.prototype.Discovery = function () {

  var cardTitle = 'Discover more';
  var repromptText = "<speak>Waiting for your responce.<break time='.5s'/> What artist would you like to listen to? <break time='.5s'/>  Like , Disco Biscuits, Hot Buttered Rum, or Keller Williams.</speak>";
  // var speechOutput = "<speak>Welcome To The Internet Archive,<break time='1s'/> Please select a collection by saying.<break time='.5s'/> play Collection name.<break time='.5s'/> like Play The Ditty Bops.<break time='.5s'/> Or  Play Cowboy Junkies.<break time='.5s'/> Or Play GratefulDead.</speak>";
  var cardOutput = "We have more collection like Disco Biscuits, Hot Buttered Rum or Keller Williams.";
  var speechOutput = "<speak>We have more collection.<break time='.5s'/> Like , Disco Biscuits, Hot Buttered Rum, or Keller Williams.</speak>";
  var response = {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'SSML',
        ssml: speechOutput,
      },
      card: {
        type: 'Simple',
        title: cardTitle,
        content: cardOutput,
      },
      reprompt: {
        outputSpeech: {
          type: 'SSML',
          ssml: repromptText,
        }
      },
      shouldEndSession: false,
    }
  };
  this.context.succeed(response);
}

MyAudioPlayer.prototype.Welcome = function () {

  var cardTitle = 'Welcome';
  var repromptText = "<speak>Waiting for your responce.<break time='.5s'/> What artist would you like to listen to? <break time='.5s'/>  For example, the ditty bops, the grateful dead, or the cowboy junkies.</speak>";
  var cardOutput = "Welcome to the live music collection at the Internet Archive. What artist would you like to listen to? For example The Ditty Bops, The Grateful Dead or The Cowboy Junkies.";
  
  var speechOutput = "<speak> <audio src='https://s3.amazonaws.com/gratefulerrorlogs/CrowdNoise.mp3' />  Welcome to the live music collection at the Internet Archive.<break time='.5s'/> What artist would you like to listen to? <break time='.5s'/>  For example, the ditty bops, the grateful dead, or the cowboy junkies.  </speak>";
  //var speechOutput = "<speak>Welcome to the live music collection at the Internet Archive.<break time='.5s'/> What artist would you like to listen to? <break time='.5s'/>  For example, the ditty bops, the grateful dead, or the cowboy junkies. </speak>";
  var response = {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'SSML',
        ssml: speechOutput,
      },
      card: {
        type: 'Simple',
        title: cardTitle,
        content: cardOutput,
      },
      reprompt: {
        outputSpeech: {
          type: 'SSML',
          ssml: repromptText,
        }
      },
      shouldEndSession: false,
    }
  };
  this.context.succeed(response);
}


MyAudioPlayer.prototype.OneGoPlayAudio = function (intent, offsetInMilliseconds) {
  getOneGoPlayAudio(intent, counter, this, offsetInMilliseconds, function (err, Obj, response) {
    if (!err) {
      Obj.context.succeed(response);
    }
    else {
      Obj.context.succeed(response);
    }
  })
};

MyAudioPlayer.prototype.play = function (intent, offsetInMilliseconds) {
  getAudioPlayList(intent, counter, this, offsetInMilliseconds, function (err, Obj, response) {
    if (!err) {
      Obj.context.succeed(response);
    }
    else {
      Obj.context.succeed(response);
    }
  })
};

MyAudioPlayer.prototype.stop = function () {
  var response = {
    version: "1.0",
    response: {
      shouldEndSession: true,
      directives: [
        {
          type: "AudioPlayer.Stop"
        }
      ]
    }
  };
  this.context.succeed(response);
};

MyAudioPlayer.prototype.saveLastPlayed = function (userId, lastPlayed) {
  lastPlayedByUser[userId] = lastPlayed;
};

MyAudioPlayer.prototype.loadLastPlayed = function (userId) {
  var lastPlayed = null;
  if (userId in lastPlayedByUser) {
    lastPlayed = lastPlayedByUser[userId];
  }
  return lastPlayed;
};
MyAudioPlayer.prototype.help = function () {  
  var cardTitle = 'Help is here';
  var repromptText = "<speak>Waiting for your responce.<break time='.5s'/>You can again ask for help</speak>";
  var cardOutput = " Try saying, Alexa,ask internet archive to play genre seventy eight , Where genre can Jazz, Dance,Instrumental etc, or Alexa, ask the internet archive to randomly play or search the Collection/Band Name Where Collection/Band Name can The Grateful Dead, The Ditty Bops, The Cowboy Junkies etc.";
  
  var speechOutput = "<speak> Try saying <break time='.5s'/> Alexa,ask internet archive to play <break time='.2s'/>genre <break time='.2s'/> seventy eight ,<break time='.2s'/> Where genre can Jazz <break time='.2s'/> or <break time='.2s'/> Dance <break time='.2s'/> or <break time='.2s'/>, Instrumental etc,<break time='.4s'/>or <break time='.4s'/> try saying <break time='.5s'/>Alexa, ask the internet archive to randomly play or <break time='.2s'/> search the Collection/Band Name <break time='.3s'/> Where Collection/Band Name can be <break time='.4s'/> The Grateful Dead <break time='.2s'/>or <break time='.2s'/> The Ditty Bops <break time='.2s'/> or <break time='.2s'/> The Cowboy Junkies etc </speak>";
  //var speechOutput = "<speak>Welcome to the live music collection at the Internet Archive.<break time='.5s'/> What artist would you like to listen to? <break time='.5s'/>  For example, the ditty bops, the grateful dead, or the cowboy junkies. </speak>";
  var response = {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'SSML',
        ssml: speechOutput,
      },
      card: {
        type: 'Simple',
        title: cardTitle,
        content: cardOutput,
      },
      reprompt: {
        outputSpeech: {
          type: 'SSML',
          ssml: repromptText,
        }
      },
      shouldEndSession: false,
    }
  };
  this.context.succeed(response);
};


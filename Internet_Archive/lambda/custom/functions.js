'use strict';
var constants = require('./constants');
var https = require('https');
var _ = require('lodash');
var functions = function () {
    return {
        userData: {},
        getAudioPlayList: function () {
            let tempObj = Object.create(this);
            let userId = tempObj.event.context ? tempObj.event.context.System.user.userId : tempObj.event.session.user.userId;
            let deviceId = tempObj.event.context.System.device.deviceId;
            let intent = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'PlaybackController.PauseCommandIssued' || tempObj.event.request.type == 'PlaybackController.PlayCommandIssued' || tempObj.event.request.type == 'PlaybackController.PreviousCommandIssued' || tempObj.event.request.type == 'PlaybackController.NextCommandIssued' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? {name: 'autoNext'} : tempObj.event.request.intent;
            functions.userData[userId][deviceId].MusicUrlList = (functions.userData[userId][deviceId].MusicUrlList == undefined) ? [] : functions.userData[userId][deviceId].MusicUrlList;
            //let offsetInMilliseconds = functions.userData[userId][deviceId].offsetInMilliseconds;
            if (functions.userData[userId][deviceId].collection != null || functions.userData[userId][deviceId].searchBYTitle) {
                let track = functions.userData[userId][deviceId].counter + 1;

                if (intent.name == 'PlayAudio' || intent.name == 'PlayAudioByCity' || intent.name == 'PlayAudioByRandom' || intent.name == 'PlayAudioByRandomYear' || intent.name == 'PlayAudioByRandomCity' || intent.name == 'PlayAudioByCityGB' || intent.name == 'PlayAudioByCityEROPE' || intent.name == 'PlayAudioByCityDE' || intent.name == 'PlayAudioByCityAT' || intent.name == 'PlayAudioByYearCity' || intent.name == 'PlayAudioQuery' || functions.userData[userId][deviceId].typeQuery == true) {

                    if (functions.userData[userId][deviceId].searchBYTitle || intent.name == 'PlayAudioQuery') {
                        if (intent.name === 'PlayAudioQuery') {
                            functions.userData[userId][deviceId].title = intent.slots.TITLE.value;
                        }
                        functions.userData[userId][deviceId].APIURL = constants.podcastAPIURLNEW + functions.userData[userId][deviceId].title + '+AND+format:(MP3)&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&&sort[]=random&rows=1&page=' + functions.userData[userId][deviceId].page + '&indent=yes&output=json';
                    }
                    else if (functions.userData[userId][deviceId].PlayAudioByRandomYear || intent.name == 'PlayAudioByRandomYear') {
                        if (intent.name === 'PlayAudioByRandomYear') {
                            functions.userData[userId][deviceId].city = intent.slots.CITY.value
                        }
                        functions.userData[userId][deviceId].APIURL = constants.podcastCityAPIURL + functions.userData[userId][deviceId].collectionQuery + '+AND+coverage:(' + functions.userData[userId][deviceId].city + ')+AND+format:(MP3)&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=1&page=' + functions.userData[userId][deviceId].page + '&indent=yes&output=json';
                    }
                    else if (functions.userData[userId][deviceId].PlayAudioByRandom || intent.name == 'PlayAudioByRandom') {
                        functions.userData[userId][deviceId].APIURL = constants.podcastCityAPIURL + functions.userData[userId][deviceId].collectionQuery + '+AND+format:(MP3)&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=1&page=' + functions.userData[userId][deviceId].page + '&indent=yes&output=json';
                    }
                    else if (functions.userData[userId][deviceId].PlayAudioByRandomCity || intent.name == 'PlayAudioByRandomCity') {
                        if (intent.name === 'PlayAudioByRandomCity') {
                            functions.userData[userId][deviceId].year = intent.slots.YEAR.value;
                        }
                        functions.userData[userId][deviceId].APIURL = constants.podcastAPIURL + functions.userData[userId][deviceId].collectionQuery + '+AND+year:(' + functions.userData[userId][deviceId].year + ')+AND+format:(MP3)&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=1&page=' + functions.userData[userId][deviceId].page + '&indent=yes&output=json';
                    }
                    else {


                        if (intent.name === 'PlayAudioByYearCity') {
                            functions.userData[userId][deviceId].year = intent.slots.YEAR.value;
                            functions.userData[userId][deviceId].city = intent.slots.CITY.value;

                        }
                        else if (intent.name === 'PlayAudio') {
                            functions.userData[userId][deviceId].year = intent.slots.YEAR.value;
                            functions.userData[userId][deviceId].APIURL = constants.podcastAPIURL + functions.userData[userId][deviceId].collectionQuery + '+AND+year:(' + functions.userData[userId][deviceId].year + ')';

                        }
                        else if (intent.name === 'PlayAudioByCity' || intent.name == 'PlayAudioByCityGB' || intent.name == 'PlayAudioByCityEROPE' || intent.name == 'PlayAudioByCityDE' || intent.name == 'PlayAudioByCityAT') {
                            if (intent.slots.CITY != undefined) {
                                functions.userData[userId][deviceId].city = intent.slots.CITY.value;
                            } else if (intent.slots.CITYAT != undefined) {
                                functions.userData[userId][deviceId].city = intent.slots.CITYAT.value;
                            } else if (intent.slots.CITYDE != undefined) {
                                functions.userData[userId][deviceId].city = intent.slots.CITYDE.value;
                            } else if (intent.slots.CITYEUROPE != undefined) {
                                functions.userData[userId][deviceId].city = intent.slots.CITYEUROPE.value;
                            } else if (intent.slots.CITYGB != undefined) {
                                functions.userData[userId][deviceId].city = intent.slots.CITYGB.value;
                            }
                            functions.userData[userId][deviceId].APIURL = constants.podcastCityAPIURL + functions.userData[userId][deviceId].collectionQuery + '+AND+coverage%3A(' + functions.userData[userId][deviceId].city + ')';
                        }

                        if (functions.userData[userId][deviceId].year != null && functions.userData[userId][deviceId].city != null) {
                            functions.userData[userId][deviceId].APIURL = constants.podcastCityAPIURL + functions.userData[userId][deviceId].collectionQuery + '+AND+coverage%3A(' + functions.userData[userId][deviceId].city + ')+AND+year%3A(' + functions.userData[userId][deviceId].year + ')';
                        }
                        if (intent.name === 'PlayAudioByCity' || intent.name == 'PlayAudioByCityGB' || intent.name == 'PlayAudioByCityEROPE' || intent.name == 'PlayAudioByCityDE' || intent.name == 'PlayAudioByCityAT' || intent.name == 'PlayAudio' || functions.userData[userId][deviceId].year == null || functions.userData[userId][deviceId].city == null) {
                            functions.userData[userId][deviceId].APIURL = functions.userData[userId][deviceId].APIURL + '+AND+format:(MP3)&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=50&page=' + functions.userData[userId][deviceId].page + '&indent=yes&output=json';
                        }
                        else {
                            functions.userData[userId][deviceId].APIURL = functions.userData[userId][deviceId].APIURL + '+AND+format:(MP3)&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=-downloads&rows=1&page=' + functions.userData[userId][deviceId].page + '&indent=yes&output=json';
                        }
                    }
                    let options = {
                        host: constants.host,
                        path: _.replace(functions.userData[userId][deviceId].APIURL, / /g, "%20"),
                        method: 'GET',
                        headers: {
                            "User-Agent": 'Alexa_Skill_Internet_Archive'
                        }
                    };
                    console.log(options);
                    https.get(options, function (res) {
                            let body = '';
                            res.on('data', function (data) {
                                body += data;
                            });

                            res.on('end', function () {
                                if (constants.debug)
                                    console.log(body);
                                let result = JSON.parse(body);
                                if (!isValidJson(body)) {
                                    functions.userData[userId][deviceId].page++;
                                    functions.getAudioPlayList.call(tempObj);
                                } else if (JSON.parse(body)['response']['docs'] == undefined) {
                                    functions.userData[userId][deviceId].page++;
                                    functions.getAudioPlayList.call(tempObj);
                                } else {
                                    if (result != null && result['response']['docs'].length > 0) {
                                        if ((intent.name === 'PlayAudioByCity' || intent.name == 'PlayAudioByCityGB' || intent.name == 'PlayAudioByCityEROPE' || intent.name == 'PlayAudioByCityDE' || intent.name == 'PlayAudioByCityAT' || intent.name == 'PlayAudio') && (functions.userData[userId][deviceId].year == null || functions.userData[userId][deviceId].city == null)) {
                                            let YearList = [];
                                            let YearString = '';
                                            let CityList = [];
                                            let CityString = '';
                                            if ((intent.name === 'PlayAudioByCity' || intent.name == 'PlayAudioByCityGB' || intent.name == 'PlayAudioByCityEROPE' || intent.name == 'PlayAudioByCityDE' || intent.name == 'PlayAudioByCityAT') && functions.userData[userId][deviceId].year == null) {
                                                for (let i = 0; i < result['response']['docs'].length; i++) {
                                                    YearList.push(result['response']['docs'][i]['year']);
                                                }
                                                YearList = _.uniq(YearList).sort();
                                                for (let i = 0; i < YearList.length; i++) {
                                                    YearString = YearString + YearList[i] + '. ';
                                                }
                                                let cardTitle = 'Please Select Year.';
                                                let repromptText = ' Waiting for your response.';
                                                let speechOutput = "Ok , Available years for City " + functions.userData[userId][deviceId].city + " are " + YearString + " Please Select year.";
                                                let cardOutput = "Ok , Available years for City " + functions.userData[userId][deviceId].city + " are " + YearString + " Please Select year.";
                                                tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                tempObj.response.speak(speechOutput).listen(repromptText);
                                                tempObj.emit(':responseReady');
                                            } else if (intent.name === 'PlayAudio' && functions.userData[userId][deviceId].city == null) {
                                                for (let i = 0; i < result['response']['docs'].length; i++) {
                                                    CityList.push(result['response']['docs'][i]['coverage']);
                                                }
                                                CityList = _.uniq(CityList).sort();
                                                for (let i = 0; i < CityList.length; i++) {
                                                    CityString = CityString + CityList[i] + '. ';
                                                }
                                                let cardTitle = 'Please Select City.';
                                                let repromptText = ' Waiting for your response.';
                                                let speechOutput = "  Ok , Available cities for year " + functions.userData[userId][deviceId].year + " are " + CityString + ' Please Select city. ';
                                                let cardOutput = "Ok , Available cities for year " + functions.userData[userId][deviceId].year + " are " + CityString + ' Please Select city.';
                                                tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                tempObj.response.speak(speechOutput).listen(repromptText);
                                                tempObj.emit(':responseReady');
                                            }
                                        } else if ((intent.name == 'PlayAudioByYearCity') || (functions.userData[userId][deviceId].city != null && functions.userData[userId][deviceId].year != null)) {
                                            if ((intent.name == 'PlayAudioByYearCity') && functions.userData[userId][deviceId].page == 1) {
                                                functions.userData[userId][deviceId].MusicUrlList = [];
                                                functions.userData[userId][deviceId].counter = 0;
                                            }
                                            if (functions.userData[userId][deviceId].IdentifierSongsCountTotal > 0) {
                                                if (functions.userData[userId][deviceId].IdentifierSongsCountTotal == functions.userData[userId][deviceId].IdentifierSongsCount + 1) {

                                                    functions.userData[userId][deviceId].IdentifierCount++;
                                                }
                                            }
                                            functions.userData[userId][deviceId].APIURLIDENTIFIER = constants.APIURLIdentifier + result['response']['docs'][0]['identifier'] + '/files';
                                            let optionsIdentifier = {
                                                host: constants.host,
                                                path: functions.userData[userId][deviceId].APIURLIDENTIFIER,
                                                method: 'GET',
                                                headers: {
                                                    "User-Agent": 'Alexa_Skill_Internet_Archive'
                                                }
                                            };
                                            https.get(optionsIdentifier, function (response) {
                                                let bodyIdentifier = '';
                                                response.on('data', function (dataIdentifier) {
                                                    bodyIdentifier += dataIdentifier;
                                                });
                                                response.on('end', function () {
                                                    if (constants.debug)
                                                        console.log(bodyIdentifier);

                                                    if (!isValidJson(bodyIdentifier)) {
                                                        functions.userData[userId][deviceId].page++;
                                                        functions.getAudioPlayList.call(tempObj);
                                                    } else if (JSON.parse(bodyIdentifier)['result'] == undefined) {
                                                        functions.userData[userId][deviceId].page++;
                                                        functions.getAudioPlayList.call(tempObj);
                                                    } else {
                                                        let resultIdentifier = JSON.parse(bodyIdentifier);
                                                        if (resultIdentifier != null && resultIdentifier['result'].length > 0) {
                                                            functions.userData[userId][deviceId].IdentifierSongsCountTotal = 0;
                                                            let lastsongsize = '';
                                                            for (let i = 0; i < resultIdentifier['result'].length; i++) {
                                                                if (( resultIdentifier['result'][i]['format'] == 'MP3' || resultIdentifier['result'][i]['format'] == 'VBR MP3' ) && lastsongsize != resultIdentifier['result'][i]['length']) {
                                                                    lastsongsize = resultIdentifier['result'][i]['length'];
                                                                    if (resultIdentifier['result'][i]['title'] == undefined) {
                                                                        functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                        functions.userData[userId][deviceId].MusicUrlList.push({
                                                                            identifier: result['response']['docs'][0]['identifier'],
                                                                            trackName: resultIdentifier['result'][i]['name'],
                                                                            title: 'Track Number ' + functions.userData[userId][deviceId].IdentifierSongsCountTotal,
                                                                            coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Coverage Not mentioned',
                                                                            year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Year Not mentioned',
                                                                        });
                                                                    }
                                                                    else {
                                                                        resultIdentifier['result'][i]['title'] = _.replace(resultIdentifier['result'][i]['title'], /[^a-zA-Z0-9 ]/g, "");

                                                                        functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                        functions.userData[userId][deviceId].MusicUrlList.push({
                                                                            identifier: result['response']['docs'][0]['identifier'],
                                                                            trackName: resultIdentifier['result'][i]['name'],
                                                                            title: resultIdentifier['result'][i]['title'],
                                                                            coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Coverage Not mentioned',
                                                                            year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Year Not mentioned',
                                                                        });
                                                                    }

                                                                }
                                                            }
                                                            if (functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount] == undefined) {

                                                                functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                                                            }

                                                            if (functions.userData[userId][deviceId].MusicUrlList.length == 0) {
                                                                functions.userData[userId][deviceId].page++;
                                                                functions.getAudioPlayList.call(tempObj);
                                                            } else {
                                                                if (functions.userData[userId][deviceId].PlayAudioByRandomYear === true || functions.userData[userId][deviceId].PlayAudioByRandomCity === true || functions.userData[userId][deviceId].PlayAudioByRandom === true) {


                                                                    functions.userData[userId][deviceId].audioURL = 'https://archive.org/download/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + '/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['trackName'];
                                                                    functions.userData[userId][deviceId].audioURLTitle = functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'];


                                                                } else {
                                                                    functions.userData[userId][deviceId].audioURL = 'https://archive.org/download/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + '/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['trackName'];
                                                                    functions.userData[userId][deviceId].audioURLTitle = functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'];

                                                                }

                                                                if (intent.name == 'autoNext') {
                                                                    let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                                                    tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                    tempObj.emit(':responseReady');


                                                                } else {

                                                                    if (canThrowCard.call(tempObj)) {
                                                                        let cardTitle = "Playing track number - " + track;
                                                                        let cardContent = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                        tempObj.response.cardRenderer(cardTitle, cardContent, null);
                                                                    }
                                                                    let playBehavior = "REPLACE_ALL";
                                                                    if (titleOff.call(tempObj)) {
                                                                        let message = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                        tempObj.response.speak(message).audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                        tempObj.emit(':responseReady');
                                                                    } else {
                                                                        tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                        tempObj.emit(':responseReady');
                                                                    }

                                                                }
                                                            }
                                                        } else {
                                                            let cardTitle = 'No Songs Found';
                                                            let repromptText = ' No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                                                            let speechOutput = "  Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/> random ";
                                                            let cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or Random";
                                                            tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                            tempObj.response.speak(speechOutput).listen(repromptText);
                                                            tempObj.emit(':responseReady');

                                                        }
                                                    }

                                                });
                                            }).on('error', function (e) {
                                                let cardTitle = 'Unable to understand your request. ';
                                                let repromptText = 'Waiting for your response.Please Try again by select. City and Year. or <break time=".1s"/> random.';
                                                let speechOutput = "Sorry , Unable to understand your request. Please Try again by select. City and Year. or <break time='.1s'/> random.";
                                                let cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";
                                                tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                tempObj.response.speak(speechOutput).listen(repromptText);
                                                tempObj.emit(':responseReady');

                                            });

                                        }
                                        else if (intent.name == 'PlayAudioQuery' || functions.userData[userId][deviceId].searchBYTitle) {
                                            if (intent.name === 'PlayAudioQuery') {

                                                functions.userData[userId][deviceId].counter = 0;
                                                functions.userData[userId][deviceId].MusicUrlList = [];
                                                track = functions.userData[userId][deviceId].counter + 1;
                                            }
                                            if (functions.userData[userId][deviceId].IdentifierSongsCountTotal > 0) {
                                                if (functions.userData[userId][deviceId].IdentifierSongsCountTotal == functions.userData[userId][deviceId].IdentifierSongsCount + 1) {
                                                    functions.userData[userId][deviceId].IdentifierCount++;
                                                }
                                            }

                                            functions.userData[userId][deviceId].APIURLIDENTIFIER = constants.APIURLIdentifier + result['response']['docs'][0]['identifier'] + '/files';
                                            let optionsIdentifier = {
                                                host: constants.host,
                                                path: functions.userData[userId][deviceId].APIURLIDENTIFIER,
                                                method: 'GET',
                                                headers: {
                                                    "User-Agent": 'Alexa_Skill_Internet_Archive'
                                                }
                                            };
                                            https.get(optionsIdentifier, function (response) {
                                                let bodyIdentifier = '';
                                                response.on('data', function (dataIdentifier) {
                                                    bodyIdentifier += dataIdentifier;
                                                });

                                                response.on('end', function () {
                                                    if (constants.debug)
                                                        console.log(bodyIdentifier);
                                                    if (!isValidJson(bodyIdentifier)) {
                                                        functions.userData[userId][deviceId].page++;
                                                        functions.getAudioPlayList.call(tempObj);
                                                    } else if (JSON.parse(bodyIdentifier)['result'] == undefined) {
                                                        functions.userData[userId][deviceId].page++;
                                                        functions.getAudioPlayList.call(tempObj);
                                                    } else {
                                                        let resultIdentifier = JSON.parse(bodyIdentifier);
                                                        if (resultIdentifier != null && resultIdentifier['result'].length > 0) {
                                                            functions.userData[userId][deviceId].MusicUrlList = [];
                                                            functions.userData[userId][deviceId].IdentifierSongsCountTotal = 0;
                                                            let lastsongsize = '';
                                                            for (let i = 0; i < resultIdentifier['result'].length; i++) {
                                                                if (( resultIdentifier['result'][i]['format'] == 'MP3' || resultIdentifier['result'][i]['format'] == 'VBR MP3' ) && lastsongsize != resultIdentifier['result'][i]['length']) {
                                                                    lastsongsize = resultIdentifier['result'][i]['length'];
                                                                    if (resultIdentifier['result'][i]['title'] == undefined) {
                                                                        functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                        functions.userData[userId][deviceId].MusicUrlList.push({
                                                                            identifier: result['response']['docs'][0]['identifier'],
                                                                            trackName: resultIdentifier['result'][i]['name'],
                                                                            title: 'Track Number ' + functions.userData[userId][deviceId].IdentifierSongsCountTotal,
                                                                            coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Coverage Not mentioned',
                                                                            year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Year Not mentioned',
                                                                        });
                                                                    }
                                                                    else {
                                                                        functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                        resultIdentifier['result'][i]['title'] = _.replace(resultIdentifier['result'][i]['title'], /[^a-zA-Z0-9 ]/g, "");

                                                                        functions.userData[userId][deviceId].MusicUrlList.push({
                                                                            identifier: result['response']['docs'][0]['identifier'],
                                                                            trackName: resultIdentifier['result'][i]['name'],
                                                                            title: resultIdentifier['result'][i]['title'],
                                                                            coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Coverage Not mentioned',
                                                                            year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Year Not mentioned',
                                                                        });
                                                                    }

                                                                }
                                                            }
                                                            if (functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount] == undefined) {
                                                                functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                                                            }
                                                            if (functions.userData[userId][deviceId].MusicUrlList.length == 0) {
                                                                functions.userData[userId][deviceId].page++;
                                                                functions.getAudioPlayList.call(tempObj);
                                                            } else {
                                                                functions.userData[userId][deviceId].audioURL = 'https://archive.org/download/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + '/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['trackName'];
                                                                functions.userData[userId][deviceId].audioURLTitle = functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'];
                                                                if (intent.name == 'autoNext') {
                                                                    let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                                                    tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                    tempObj.emit(':responseReady');
                                                                } else {
                                                                    if (canThrowCard.call(tempObj)) {
                                                                        let cardTitle = "Playing track number - " + track;
                                                                        let cardContent = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                        tempObj.response.cardRenderer(cardTitle, cardContent, null);
                                                                    }
                                                                    let playBehavior = "REPLACE_ALL";
                                                                    if (titleOff.call(tempObj)) {
                                                                        let message = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                        tempObj.response.speak(message).audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                        tempObj.emit(':responseReady');
                                                                    } else {
                                                                        tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                        tempObj.emit(':responseReady');
                                                                    }
                                                                }

                                                            }
                                                        }
                                                        else {
                                                            let cardTitle = 'No Songs Found';
                                                            let repromptText = 'Waiting for your response. Please Try again by saying. Search Artist Name.';
                                                            let speechOutput = "Sorry , No songs found. Please Try again by saying., Search Artist Name.";
                                                            let cardOutput = "Sorry, No songs found. Please Try again by saying Search Artist Name.";

                                                            tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                            tempObj.response.speak(speechOutput).listen(repromptText);
                                                            tempObj.emit(':responseReady');

                                                        }
                                                    }

                                                });
                                            }).on('error', function (e) {
                                                let cardTitle = 'Unable to understand your request.';
                                                let repromptText = 'Waiting for your response. Please Try again by saying. Search Artist Name.';
                                                let speechOutput = "Sorry , Unable to understand your request. Please Try again by saying. Search Artist Name.";
                                                let cardOutput = "Sorry, Unable to understand your request. Please Try again by saying Search Artist Name.";

                                                tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                tempObj.response.speak(speechOutput).listen(repromptText);
                                                tempObj.emit(':responseReady');

                                            });

                                        }
                                        else if (intent.name == 'PlayAudioByRandomYear' || functions.userData[userId][deviceId].PlayAudioByRandomYear) {
                                            if (intent.name === 'PlayAudioByRandomYear' && functions.userData[userId][deviceId].page == 1) {
                                                functions.userData[userId][deviceId].counter = 0;
                                                functions.userData[userId][deviceId].MusicUrlList = [];
                                                track = functions.userData[userId][deviceId].counter + 1;
                                            }
                                            if (functions.userData[userId][deviceId].IdentifierSongsCountTotal > 0) {
                                                if (functions.userData[userId][deviceId].IdentifierSongsCountTotal == functions.userData[userId][deviceId].IdentifierSongsCount + 1) {
                                                    functions.userData[userId][deviceId].IdentifierCount++;
                                                }
                                            }

                                            functions.userData[userId][deviceId].APIURLIDENTIFIER = constants.APIURLIdentifier + result['response']['docs'][0]['identifier'] + '/files';
                                            let optionsIdentifier = {
                                                host: constants.host,
                                                path: functions.userData[userId][deviceId].APIURLIDENTIFIER,
                                                method: 'GET',
                                                headers: {
                                                    "User-Agent": 'Alexa_Skill_Internet_Archive'
                                                }
                                            };
                                            https.get(optionsIdentifier, function (response) {
                                                let bodyIdentifier = '';
                                                response.on('data', function (dataIdentifier) {
                                                    bodyIdentifier += dataIdentifier;
                                                });

                                                response.on('end', function () {
                                                    if (constants.debug)
                                                        console.log(bodyIdentifier);
                                                    if (!isValidJson(bodyIdentifier)) {
                                                        functions.userData[userId][deviceId].page++;
                                                        functions.getAudioPlayList.call(tempObj);
                                                    } else if (JSON.parse(bodyIdentifier)['result'] == undefined) {
                                                        functions.userData[userId][deviceId].page++;
                                                        functions.getAudioPlayList.call(tempObj);
                                                    } else {
                                                        let resultIdentifier = JSON.parse(bodyIdentifier);
                                                        if (resultIdentifier != null && resultIdentifier['result'].length > 0) {
                                                            functions.userData[userId][deviceId].IdentifierSongsCountTotal = 0;
                                                            let lastsongsize = '';
                                                            for (let i = 0; i < resultIdentifier['result'].length; i++) {
                                                                if (( resultIdentifier['result'][i]['format'] == 'MP3' || resultIdentifier['result'][i]['format'] == 'VBR MP3' ) && lastsongsize != resultIdentifier['result'][i]['length']) {
                                                                    lastsongsize = resultIdentifier['result'][i]['length'];
                                                                    if (resultIdentifier['result'][i]['title'] == undefined) {
                                                                        functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                        functions.userData[userId][deviceId].MusicUrlList.push({
                                                                            identifier: result['response']['docs'][0]['identifier'],
                                                                            trackName: resultIdentifier['result'][i]['name'],
                                                                            title: 'Track Number ' + functions.userData[userId][deviceId].IdentifierSongsCountTotal,
                                                                            coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Coverage Not mentioned',
                                                                            year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Year Not mentioned',
                                                                        });
                                                                    }
                                                                    else {
                                                                        functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                        resultIdentifier['result'][i]['title'] = _.replace(resultIdentifier['result'][i]['title'], /[^a-zA-Z0-9 ]/g, "");

                                                                        functions.userData[userId][deviceId].MusicUrlList.push({
                                                                            identifier: result['response']['docs'][0]['identifier'],
                                                                            trackName: resultIdentifier['result'][i]['name'],
                                                                            title: resultIdentifier['result'][i]['title'],
                                                                            coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Coverage Not mentioned',
                                                                            year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Year Not mentioned',
                                                                        });
                                                                    }

                                                                }
                                                            }
                                                            if (functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount] == undefined) {
                                                                functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                                                            }
                                                            if (functions.userData[userId][deviceId].MusicUrlList.length == 0) {
                                                                functions.userData[userId][deviceId].page++;
                                                                functions.getAudioPlayList.call(tempObj);
                                                            } else {
                                                                if (functions.userData[userId][deviceId].PlayAudioByRandomYear === true || functions.userData[userId][deviceId].PlayAudioByRandomCity === true || functions.userData[userId][deviceId].PlayAudioByRandom === true) {
                                                                    functions.userData[userId][deviceId].audioURL = 'https://archive.org/download/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + '/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['trackName'];
                                                                    functions.userData[userId][deviceId].audioURLTitle = functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'];

                                                                }
                                                                else {
                                                                    functions.userData[userId][deviceId].audioURL = 'https://archive.org/download/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + '/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['trackName'];
                                                                    functions.userData[userId][deviceId].audioURLTitle = functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'];

                                                                }
                                                                if (intent.name == 'autoNext') {
                                                                    let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                                                    tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                    tempObj.emit(':responseReady');
                                                                } else {
                                                                    if (canThrowCard.call(tempObj)) {
                                                                        let cardTitle = "Playing track number - " + track;
                                                                        let cardContent = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                        tempObj.response.cardRenderer(cardTitle, cardContent, null);
                                                                    }
                                                                    let playBehavior = "REPLACE_ALL";
                                                                    if (titleOff.call(tempObj)) {
                                                                        let message = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                        tempObj.response.speak(message).audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                        tempObj.emit(':responseReady');
                                                                    } else {
                                                                        tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                        tempObj.emit(':responseReady');
                                                                    }
                                                                }

                                                            }
                                                        }
                                                        else {
                                                            let cardTitle = 'No Songs Found';
                                                            let repromptText = 'No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                                                            let speechOutput = "Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/> random.";
                                                            let cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or Random.";

                                                            tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                            tempObj.response.speak(speechOutput).listen(repromptText);
                                                            tempObj.emit(':responseReady');

                                                        }
                                                    }

                                                });
                                            }).on('error', function (e) {
                                                let cardTitle = 'Unable to understand your request.';
                                                let repromptText = 'Waiting for your response. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                                                let speechOutput = "Sorry , Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.";
                                                let cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";

                                                tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                tempObj.response.speak(speechOutput).listen(repromptText);
                                                tempObj.emit(':responseReady');

                                            });

                                        }
                                        else if (intent.name == 'PlayAudioByRandomCity' || functions.userData[userId][deviceId].PlayAudioByRandomCity) {
                                            if (intent.name === 'PlayAudioByRandomCity' && functions.userData[userId][deviceId].page == 1) {

                                                functions.userData[userId][deviceId].counter = 0;
                                                functions.userData[userId][deviceId].MusicUrlList = [];
                                                track = functions.userData[userId][deviceId].counter + 1;

                                            }

                                            if (functions.userData[userId][deviceId].IdentifierSongsCountTotal > 0) {
                                                if (functions.userData[userId][deviceId].IdentifierSongsCountTotal == functions.userData[userId][deviceId].IdentifierSongsCount + 1) {

                                                    functions.userData[userId][deviceId].IdentifierCount++;

                                                }
                                            }

                                            functions.userData[userId][deviceId].APIURLIDENTIFIER = constants.APIURLIdentifier + result['response']['docs'][0]['identifier'] + '/files';
                                            let optionsIdentifier = {
                                                host: constants.host,
                                                path: functions.userData[userId][deviceId].APIURLIDENTIFIER,
                                                method: 'GET',
                                                headers: {
                                                    "User-Agent": 'Alexa_Skill_Internet_Archive'
                                                }
                                            };
                                            https.get(optionsIdentifier, function (response) {
                                                let bodyIdentifier = '';
                                                response.on('data', function (dataIdentifier) {
                                                    bodyIdentifier += dataIdentifier;
                                                });

                                                response.on('end', function () {
                                                    if (constants.debug)
                                                        console.log(bodyIdentifier);
                                                    if (!isValidJson(bodyIdentifier)) {
                                                        functions.userData[userId][deviceId].page++;
                                                        functions.getAudioPlayList.call(tempObj);
                                                    } else if (JSON.parse(bodyIdentifier)['result'] == undefined) {
                                                        functions.userData[userId][deviceId].page++;
                                                        functions.getAudioPlayList.call(tempObj);
                                                    } else {
                                                        let resultIdentifier = JSON.parse(bodyIdentifier);
                                                        if (resultIdentifier != null && resultIdentifier['result'].length > 0) {
                                                            functions.userData[userId][deviceId].IdentifierSongsCountTotal = 0;
                                                            let lastsongsize = '';
                                                            for (let i = 0; i < resultIdentifier['result'].length; i++) {
                                                                if (( resultIdentifier['result'][i]['format'] == 'MP3' || resultIdentifier['result'][i]['format'] == 'VBR MP3' ) && lastsongsize != resultIdentifier['result'][i]['length']) {
                                                                    lastsongsize = resultIdentifier['result'][i]['length'];
                                                                    if (resultIdentifier['result'][i]['title'] == undefined) {
                                                                        functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                        functions.userData[userId][deviceId].MusicUrlList.push({
                                                                            identifier: result['response']['docs'][0]['identifier'],
                                                                            trackName: resultIdentifier['result'][i]['name'],
                                                                            title: 'Track Number ' + functions.userData[userId][deviceId].IdentifierSongsCountTotal,
                                                                            coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Coverage Not mentioned',
                                                                            year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Year Not mentioned',
                                                                        });
                                                                    }
                                                                    else {
                                                                        functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                        resultIdentifier['result'][i]['title'] = _.replace(resultIdentifier['result'][i]['title'], /[^a-zA-Z0-9 ]/g, "");
                                                                        functions.userData[userId][deviceId].MusicUrlList.push({
                                                                            identifier: result['response']['docs'][0]['identifier'],
                                                                            trackName: resultIdentifier['result'][i]['name'],
                                                                            title: resultIdentifier['result'][i]['title'],
                                                                            coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Coverage Not mentioned',
                                                                            year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Year Not mentioned',
                                                                        });
                                                                    }

                                                                }
                                                            }
                                                            if (functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount] == undefined) {
                                                                functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                                                            }

                                                            if (functions.userData[userId][deviceId].MusicUrlList.length == 0) {
                                                                functions.userData[userId][deviceId].page++;
                                                                functions.getAudioPlayList.call(tempObj);
                                                            } else {
                                                                if (functions.userData[userId][deviceId].PlayAudioByRandomYear === true || functions.userData[userId][deviceId].PlayAudioByRandomCity === true || functions.userData[userId][deviceId].PlayAudioByRandom === true) {


                                                                    functions.userData[userId][deviceId].audioURL = 'https://archive.org/download/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + '/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['trackName'];
                                                                    functions.userData[userId][deviceId].audioURLTitle = functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'];


                                                                }
                                                                else {
                                                                    functions.userData[userId][deviceId].audioURL = 'https://archive.org/download/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + '/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['trackName'];
                                                                    functions.userData[userId][deviceId].audioURLTitle = functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'];

                                                                }

                                                                if (intent.name == 'autoNext') {
                                                                    let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                                                    tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                    tempObj.emit(':responseReady');

                                                                }
                                                                else {
                                                                    if (canThrowCard.call(tempObj)) {
                                                                        let cardTitle = "Playing track number - " + track;
                                                                        let cardContent = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                        tempObj.response.cardRenderer(cardTitle, cardContent, null);
                                                                    }
                                                                    let playBehavior = "REPLACE_ALL";
                                                                    if (titleOff.call(tempObj)) {
                                                                        let message = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                        tempObj.response.speak(message).audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                        tempObj.emit(':responseReady');
                                                                    } else {
                                                                        tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                        tempObj.emit(':responseReady');
                                                                    }

                                                                }
                                                            }
                                                        } else {
                                                            if (intent.name == 'autoNext') {
                                                                let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                                                tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                tempObj.emit(':responseReady');

                                                            } else {
                                                                let cardTitle = 'No Songs Found';
                                                                let repromptText = 'No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                                                                let speechOutput = "Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/> random.";
                                                                let cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or Random.";
                                                                tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                                tempObj.response.speak(speechOutput).listen(repromptText);
                                                                tempObj.emit(':responseReady');
                                                            }

                                                        }
                                                    }

                                                });
                                            }).on('error', function (e) {
                                                let cardTitle = 'Unable to understand your request.';
                                                let repromptText = 'Waiting for your response. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                                                let speechOutput = "Sorry , Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.";
                                                let cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";
                                                tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                tempObj.response.speak(speechOutput).listen(repromptText);
                                                tempObj.emit(':responseReady');

                                            });
                                        }
                                        else if (intent.name == 'PlayAudioByRandom' || functions.userData[userId][deviceId].PlayAudioByRandom) {
                                            if (intent.name === 'PlayAudioByRandom') {

                                                functions.userData[userId][deviceId].counter = 0;
                                                functions.userData[userId][deviceId].MusicUrlList = [];
                                                track = functions.userData[userId][deviceId].counter + 1;
                                            }

                                            if (functions.userData[userId][deviceId].IdentifierSongsCountTotal > 0) {
                                                if (functions.userData[userId][deviceId].IdentifierSongsCountTotal == functions.userData[userId][deviceId].IdentifierSongsCount + 1) {

                                                    functions.userData[userId][deviceId].IdentifierCount++;

                                                }
                                            }

                                            functions.userData[userId][deviceId].APIURLIDENTIFIER = constants.APIURLIdentifier + result['response']['docs'][0]['identifier'] + '/files';
                                            let optionsIdentifier = {
                                                host: constants.host,
                                                path: functions.userData[userId][deviceId].APIURLIDENTIFIER,
                                                method: 'GET',
                                                headers: {
                                                    "User-Agent": 'Alexa_Skill_Internet_Archive'
                                                }
                                            };
                                            https.get(optionsIdentifier, function (response) {
                                                    let bodyIdentifier = '';
                                                    response.on('data', function (dataIdentifier) {
                                                        bodyIdentifier += dataIdentifier;
                                                    });

                                                    response.on('end', function () {
                                                        if (constants.debug)
                                                            console.log(bodyIdentifier);
                                                        if (!isValidJson(bodyIdentifier)) {
                                                            functions.userData[userId][deviceId].page++;
                                                            functions.getAudioPlayList.call(tempObj);
                                                        } else if (JSON.parse(bodyIdentifier)['result'] == undefined) {
                                                            functions.userData[userId][deviceId].page++;
                                                            functions.getAudioPlayList.call(tempObj);
                                                        } else {
                                                            let resultIdentifier = JSON.parse(bodyIdentifier);
                                                            if (resultIdentifier != null && resultIdentifier['result'].length > 0) {
                                                                functions.userData[userId][deviceId].IdentifierSongsCountTotal = 0;
                                                                let lastsongsize = '';
                                                                for (let i = 0; i < resultIdentifier['result'].length; i++) {
                                                                    if (( resultIdentifier['result'][i]['format'] == 'MP3' || resultIdentifier['result'][i]['format'] == 'VBR MP3' ) && lastsongsize != resultIdentifier['result'][i]['length']) {
                                                                        lastsongsize = resultIdentifier['result'][i]['length'];
                                                                        if (resultIdentifier['result'][i]['title'] == undefined) {

                                                                            functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                            functions.userData[userId][deviceId].MusicUrlList.push({
                                                                                identifier: result['response']['docs'][0]['identifier'],
                                                                                trackName: resultIdentifier['result'][i]['name'],
                                                                                title: 'Track Number ' + functions.userData[userId][deviceId].IdentifierSongsCountTotal,
                                                                                coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Coverage Not mentioned',
                                                                                year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Year Not mentioned',
                                                                            });
                                                                        }
                                                                        else {
                                                                            functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                            resultIdentifier['result'][i]['title'] = _.replace(resultIdentifier['result'][i]['title'], /[^a-zA-Z0-9 ]/g, "");
                                                                            functions.userData[userId][deviceId].MusicUrlList.push({
                                                                                identifier: result['response']['docs'][0]['identifier'],
                                                                                trackName: resultIdentifier['result'][i]['name'],
                                                                                title: resultIdentifier['result'][i]['title'],
                                                                                coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Coverage Not mentioned',
                                                                                year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Year Not mentioned',
                                                                            });
                                                                        }

                                                                    }
                                                                }
                                                                if (functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount] == undefined) {
                                                                    functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                                                                }
                                                                if (functions.userData[userId][deviceId].MusicUrlList.length == 0) {
                                                                    functions.userData[userId][deviceId].page++;
                                                                    functions.getAudioPlayList.call(tempObj);
                                                                } else {
                                                                    if (functions.userData[userId][deviceId].PlayAudioByRandomYear === true || functions.userData[userId][deviceId].PlayAudioByRandomCity === true || functions.userData[userId][deviceId].PlayAudioByRandom === true) {

                                                                        functions.userData[userId][deviceId].audioURL = 'https://archive.org/download/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + '/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['trackName'];
                                                                        functions.userData[userId][deviceId].audioURLTitle = functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'];

                                                                    }
                                                                    else {
                                                                        functions.userData[userId][deviceId].audioURL = 'https://archive.org/download/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + '/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['trackName'];
                                                                        functions.userData[userId][deviceId].audioURLTitle = functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'];

                                                                    }

                                                                    if (intent.name == 'autoNext') {
                                                                        let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                                                        tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                        tempObj.emit(':responseReady');

                                                                    } else {
                                                                        if (canThrowCard.call(tempObj)) {
                                                                            let cardTitle = "Playing track number - " + track;
                                                                            let cardContent = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                            tempObj.response.cardRenderer(cardTitle, cardContent, null);
                                                                        }
                                                                        let playBehavior = "REPLACE_ALL";
                                                                        if (titleOff.call(tempObj)) {
                                                                            let message = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                            tempObj.response.speak(message).audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                            tempObj.emit(':responseReady');
                                                                        } else {
                                                                            tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                            tempObj.emit(':responseReady');
                                                                        }

                                                                    }
                                                                }
                                                            } else {
                                                                if (intent.name == 'autoNext') {
                                                                    let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                                                    tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                    tempObj.emit(':responseReady');

                                                                } else {
                                                                    let cardTitle = 'No Songs Found';
                                                                    let repromptText = 'No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                                                                    let speechOutput = "Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/> random.";
                                                                    let cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or Random.";

                                                                    tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                                    tempObj.response.speak(speechOutput).listen(repromptText);
                                                                    tempObj.emit(':responseReady');
                                                                }
                                                            }
                                                        }

                                                    });
                                                }
                                            ).
                                                on('error', function (e) {
                                                    if (intent.name == 'autoNext') {
                                                        let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                                        tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                        tempObj.emit(':responseReady');

                                                    } else {
                                                        let cardTitle = 'Unable to understand your request.';
                                                        let repromptText = 'Waiting for your response. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                                                        let speechOutput = "Sorry , Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.";
                                                        let cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";

                                                        tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                        tempObj.response.speak(speechOutput).listen(repromptText);
                                                        tempObj.emit(':responseReady');
                                                    }

                                                });
                                        }
                                    }
                                    else {
                                        if (intent.name == 'autoNext') {
                                            let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                            functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                                            functions.userData[userId][deviceId].page = 1;
                                            tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                            tempObj.emit(':responseReady');
                                        } else {

                                            let cardTitle = 'No Songs Found';
                                            let repromptText = 'No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                                            let speechOutput = "Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/>  random.";
                                            let cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or random.";

                                            tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                            tempObj.response.speak(speechOutput).listen(repromptText);
                                            tempObj.emit(':responseReady');
                                        }
                                    }
                                }
                            });
                        }
                    ).
                        on('error', function (e) {
                            if (intent.name == 'autoNext') {
                                let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                                functions.userData[userId][deviceId].page = 1;
                                tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                tempObj.emit(':responseReady');
                            } else {
                                functions.userData[userId][deviceId].year = null;
                                functions.userData[userId][deviceId].city = null;
                                let cardTitle = 'Unable to understand your request.';
                                let repromptText = 'Waiting for your response. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                                let speechOutput = "Sorry , Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.";
                                let cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";

                                tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                tempObj.response.speak(speechOutput).listen(repromptText);
                                tempObj.emit(':responseReady');
                            }

                        });
                }
                else {
                    if (intent.name == 'autoNext') {
                        let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                        functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                        functions.userData[userId][deviceId].page = 1;
                        tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                        tempObj.emit(':responseReady');
                    } else {
                        let cardTitle = 'Unable to understand your request.';
                        let repromptText = 'Waiting for your response. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                        let speechOutput = "Sorry, Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.";
                        let cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";

                        tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                        tempObj.response.speak(speechOutput).listen(repromptText);
                        tempObj.emit(':responseReady');
                    }

                }
            }
            else {
                if (intent.name == 'autoNext') {
                    let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                    functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                    functions.userData[userId][deviceId].page = 1;
                    tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                    tempObj.emit(':responseReady');
                } else {
                    let cardTitle = 'Please select artist';
                    let repromptText = " What artist would you like to listen to? <break time='.5s'/>  For example, The Grateful Dead, The Phil Lesh and Friends or The Disco Biscuits?";
                    let speechOutput = " What artist would you like to listen to? <break time='.5s'/>  For example, The Grateful Dead, The Phil Lesh and Friends or The Disco Biscuits?";
                    let cardOutput = " What artist would you like to listen to?  For example, The Grateful Dead, The Phil Lesh and Friends or The Disco Biscuits?";

                    tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                    tempObj.response.speak(speechOutput).listen(repromptText);
                    tempObj.emit(':responseReady');
                }

            }
        },
        getCollectionLib: function () {

            let tempObj = Object.create(this);
            let userId = tempObj.event.context ? tempObj.event.context.System.user.userId : tempObj.event.session.user.userId;
            let deviceId = tempObj.event.context.System.device.deviceId;

            functions.userData[userId][deviceId].collection = tempObj.event.request.intent.slots.COLLECTION.value;
            let collection_real_name = tempObj.event.request.intent.slots.COLLECTION.value
            if (functions.userData[userId][deviceId].collection != null || functions.userData[userId][deviceId].collection != undefined) {

                functions.userData[userId][deviceId].collectionQuery = '';
                let collectionArray = functions.userData[userId][deviceId].collection.split(/[ ,]+/);

                if (collectionArray.length > 1) {
                    functions.userData[userId][deviceId].collectionQuery = functions.userData[userId][deviceId].collectionQuery + '(';

                    for (let i = 1; i < collectionArray.length; i++) {
                        functions.userData[userId][deviceId].collectionQuery = functions.userData[userId][deviceId].collectionQuery + collectionArray[i];
                    }

                    functions.userData[userId][deviceId].collectionQuery = functions.userData[userId][deviceId].collectionQuery + ')+OR+collection:(';
                    for (let i = 0; i < collectionArray.length - 1; i++) {
                        functions.userData[userId][deviceId].collectionQuery = functions.userData[userId][deviceId].collectionQuery + collectionArray[i];
                    }

                    functions.userData[userId][deviceId].collection = _.replace(functions.userData[userId][deviceId].collection, / /g, '');
                    functions.userData[userId][deviceId].collectionQuery = '(' + functions.userData[userId][deviceId].collectionQuery + ')+OR+collection:(' + functions.userData[userId][deviceId].collection + ')+OR+collection:(the' + functions.userData[userId][deviceId].collection + '))';
                } else {
                    functions.userData[userId][deviceId].collection = _.replace(functions.userData[userId][deviceId].collection, / /g, '');
                    functions.userData[userId][deviceId].collectionQuery = '(' + functions.userData[userId][deviceId].collectionQuery + '(' + functions.userData[userId][deviceId].collection + ')+OR+collection:(the' + functions.userData[userId][deviceId].collection + '))';
                }

                let checkCollectionUrl = constants.podcastAPIURL + functions.userData[userId][deviceId].collectionQuery + '+AND+format:(MP3)&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=-downloads&rows=50&page=0&indent=yes&output=json';

                let options = {
                    host: constants.host,
                    path: checkCollectionUrl,
                    method: 'GET',
                    headers: {
                        "User-Agent": 'Alexa_Skill_Internet_Archive'
                    }
                };

                https.get(options, function (res) {
                    let body = '';
                    res.on('data', function (data) {
                        body += data;
                    });
                    res.on('end', function () {
                        if (constants.debug)
                            console.log(body);
                        let resultCollection = JSON.parse(body);
                        if (constants.debug)
                            console.log(resultCollection['response']['docs'].length);

                        if (resultCollection != null && resultCollection['response']['docs'].length > 0) {
                            //http to node server collection title city =null year=null url=checkCollectionUrl resultCollection =result
                            for (let i = 0; i < resultCollection['response']['docs'].length; i++) {
                                if (resultCollection['response']['docs'][i]['coverage'] != '' && resultCollection['response']['docs'][i]['coverage'] != undefined && resultCollection['response']['docs'][i]['year'] != '' && resultCollection['response']['docs'][i]['year'] != undefined) {
                                    if (resultCollection['response']['docs'][i]['coverage'].includes(",")) {
                                        let resCity = resultCollection['response']['docs'][i]['coverage'].split(",");
                                        functions.userData[userId][deviceId].CityName = resCity[0];
                                        functions.userData[userId][deviceId].YearName = resultCollection['response']['docs'][i]['year'];
                                        break;
                                    }
                                }
                            }
                            let cardTitle = 'Provide City and Year';
                            let repromptText = "Ok! Lets go with " + collection_real_name + ".<break time='.5s'/> Do you have a specific city and year in mind, like <break time='.1s'/>" + functions.userData[userId][deviceId].CityName + " " + functions.userData[userId][deviceId].YearName + ", or would you like me to play something randomly?";
                            let cardOutput = "Ok! Lets go with " + collection_real_name + ". Do you have a specific city and year in mind, like " + functions.userData[userId][deviceId].CityName + " " + functions.userData[userId][deviceId].YearName + ", or would you like me to play something randomly?";
                            let speechOutput = "Ok! Lets go with " + collection_real_name + ".<break time='.5s'/> Do you have a specific city and year in mind, like <break time='.1s'/>" + functions.userData[userId][deviceId].CityName + " " + functions.userData[userId][deviceId].YearName + ", or would you like me to play something randomly?";

                            tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                            tempObj.response.speak(speechOutput).listen(repromptText);
                            tempObj.emit(':responseReady');

                        } else {
                            let cardTitle = 'Collection not exists';
                            let repromptText = "" + collection_real_name + " has no song.<break time='.5s'/>  What artist would you like to listen to? <break time='.5s'/>  For example, The Grateful Dead, The Phil Lesh and Friends or The Disco Biscuits?";
                            let speechOutput = "Sorry, " + collection_real_name + " has no song.  What artist would you like to listen to? <break time='.5s'/>  For example, The Grateful Dead, The Phil Lesh and Friends or The Disco Biscuits?";
                            let cardOutput = "Sorry, " + collection_real_name + " has no song.  What artist would you like to listen to?  For example, The Grateful Dead, The Phil Lesh and Friends or The Disco Biscuits?";

                            functions.userData[userId][deviceId].collection = null;

                            tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                            tempObj.response.speak(speechOutput).listen(repromptText);
                            tempObj.emit(':responseReady');

                        }

                    });
                })
                    .on('error', function (e) {

                        let cardTitle = 'Waiting for your response.';
                        let repromptText = "Unable to understand your request.  What artist would you like to listen to? <break time='.5s'/>  For example, The Grateful Dead, The Phil Lesh and Friends or The Disco Biscuits?";
                        let speechOutput = "Sorry , Unable to understand your request. What artist would you like to listen to? <break time='.5s'/>  For example, The Grateful Dead, The Phil Lesh and Friends or The Disco Biscuits?";
                        let cardOutput = "Sorry, unable to understand your request.  What artist would you like to listen to?  For example, The Grateful Dead, The Phil Lesh and Friends or The Disco Biscuits?";

                        functions.userData[userId][deviceId].collection = null;

                        tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                        tempObj.response.speak(speechOutput).listen(repromptText);
                        tempObj.emit(':responseReady');

                    });
            } else {
                let cardTitle = 'Please provide valid artist';
                let repromptText = "Waiting for your response.";
                let speechOutput = "Please provide a artist name.";
                let cardOutput = "Please provide a ARTIST NAME.";

                tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                tempObj.response.speak(speechOutput).listen(repromptText);
                tempObj.emit(':responseReady');

            }
        },
        DiscoveryLib: function () {
            let tempObj = Object.create(this);
            let userId = tempObj.event.context ? tempObj.event.context.System.user.userId : tempObj.event.session.user.userId;
            let deviceId = tempObj.event.context.System.device.deviceId;

            let cardTitle = 'Discover more';
            let repromptText = "Waiting for your response.<break time='.5s'/> What artist would you like to listen to? <break time='.5s'/>  Like , Disco Biscuits, Hot Buttered Rum, or Keller Williams.";
            let cardOutput = "We have more collection like Disco Biscuits, Hot Buttered Rum or Keller Williams.";
            let speechOutput = "We have more collection.<break time='.5s'/> Like , Disco Biscuits, Hot Buttered Rum, or Keller Williams.";

            tempObj.response.cardRenderer(cardTitle, cardOutput, null);
            tempObj.response.speak(speechOutput).listen(repromptText);
            tempObj.emit(':responseReady');

        },
        getAudioPlayListSeventyEights: function () {

            let tempObj = Object.create(this);
            let userId = tempObj.event.context ? tempObj.event.context.System.user.userId : tempObj.event.session.user.userId;
            let deviceId = tempObj.event.context.System.device.deviceId;

            let intent = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'PlaybackController.PauseCommandIssued' || tempObj.event.request.type == 'PlaybackController.PlayCommandIssued' || tempObj.event.request.type == 'PlaybackController.PreviousCommandIssued' || tempObj.event.request.type == 'PlaybackController.NextCommandIssued' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? {name: 'autoNext'} : tempObj.event.request.intent;
            let offsetInMilliseconds = functions.userData[userId][deviceId].offsetInMilliseconds;
            let track = functions.userData[userId][deviceId].counter + 1;
            if (intent.name == 'SeventyEights' || intent.name == 'PlaByTopic' || intent.name == 'OneGoSeventyEights' || functions.userData[userId][deviceId].typeQuery === true) {

                if (intent.name == 'SeventyEights') {
                    if (constants.debug) {
                        console.log('into Seventy Eights');
                        console.log(intent.name);
                    }
                    let cardTitle = 'Collection Seventy Eights Has Been Selected.';
                    let repromptText = "Waiting for your response.<break time='.1s'/> What genre of music would you like to listen to? Please select a topic like  Jazz <break time='.5s'/> Instrumental or <break time='.5s'/> Dance";
                    let speechOutput = "Seventy Eights - great choice!<break time='.1s'/> What genre of music would you like to listen to? Please select a topic like  Jazz <break time='.5s'/> Instrumental or <break time='.5s'/> Dance";
                    let cardOutput = "Seventy Eights - great choice! What genre of music would you like to listen to? Please select a topic like Jazz, Instrumental, or Dance.";
                    tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                    tempObj.response.speak(speechOutput).listen(repromptText);
                    tempObj.emit(':responseReady');


                } else if (intent.name == 'PlaByTopic' || functions.userData[userId][deviceId].typeQuery === true || intent.name == 'OneGoSeventyEights') {
                    if (intent.name == 'PlaByTopic' || intent.name == 'OneGoSeventyEights') {
                        functions.userData[userId][deviceId].topicName = functions.userData[userId][deviceId].title = intent.slots.TOPIC.value;
                    }

                    functions.userData[userId][deviceId].topicName = _.replace(functions.userData[userId][deviceId].topicName, " and ", "#");
                    functions.userData[userId][deviceId].topicName = _.replace(functions.userData[userId][deviceId].topicName, "&", "#");
                    functions.userData[userId][deviceId].topicName = _.replace(functions.userData[userId][deviceId].topicName, / /g, '');
                    functions.userData[userId][deviceId].topicName = _.replace(functions.userData[userId][deviceId].topicName, "#", " ");
                    functions.userData[userId][deviceId].topicName = _.replace(functions.userData[userId][deviceId].topicName, /[^a-zA-Z0-9 ]/g, "");


                    functions.userData[userId][deviceId].APIURL = constants.SeventyEightsAPIURL + '(' + functions.userData[userId][deviceId].topicName + ')+AND+format:(MP3)&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=1&page=' + functions.userData[userId][deviceId].page + '&indent=yes&output=json';
                    let options = {
                        host: constants.host,
                        path: _.replace(functions.userData[userId][deviceId].APIURL, / /g, "%20"),
                        method: 'GET',
                        headers: {
                            "User-Agent": 'Alexa_Skill_Internet_Archive'
                        }
                    };
                    if (constants.debug)
                        console.log(options);
                    https.get(options, function (res) {
                        var body = '';
                        res.on('data', function (data) {
                            body += data;
                        });
                        res.on('end', function () {
                            if (constants.debug)
                                console.log(body);
                            if (!isValidJson(body)) {
                                functions.userData[userId][deviceId].page++;
                                functions.getAudioPlayList.call(tempObj);
                            } else if (JSON.parse(body)['response']['docs'] == undefined) {
                                functions.userData[userId][deviceId].page++;
                                functions.getAudioPlayList.call(tempObj);
                            } else {
                                var result = JSON.parse(body);
                                if (result != null && result['response']['docs'].length > 0) {
                                    functions.userData[userId][deviceId].APIURLIDENTIFIER = constants.APIURLIdentifier + result['response']['docs'][0]['identifier'] + '/files';
                                    let optionsIdentifier = {
                                        host: constants.host,
                                        path: functions.userData[userId][deviceId].APIURLIDENTIFIER,
                                        method: 'GET',
                                        headers: {
                                            "User-Agent": 'Alexa_Skill_Internet_Archive'
                                        }
                                    };
                                    https.get(optionsIdentifier, function (response) {
                                        var bodyIdentifier = '';
                                        response.on('data', function (dataIdentifier) {
                                            bodyIdentifier += dataIdentifier;
                                        });

                                        response.on('end', function () {
                                            if (constants.debug)
                                                console.log(bodyIdentifier);
                                            if (!isValidJson(bodyIdentifier)) {
                                                functions.userData[userId][deviceId].page++;
                                                functions.getAudioPlayList.call(tempObj);
                                            } else if (JSON.parse(bodyIdentifier)['result'] == undefined) {
                                                functions.userData[userId][deviceId].page++;
                                                functions.getAudioPlayList.call(tempObj);
                                            } else {
                                                var resultIdentifier = JSON.parse(bodyIdentifier);
                                                if (resultIdentifier != null && resultIdentifier['result'].length > 0) {
                                                    functions.userData[userId][deviceId].MusicUrlList = [];
                                                    functions.userData[userId][deviceId].IdentifierSongsCountTotal = 0;
                                                    let lastsongsize = '';
                                                    for (let i = 0; i < resultIdentifier['result'].length; i++) {
                                                        if (( resultIdentifier['result'][i]['format'] == 'MP3' || resultIdentifier['result'][i]['format'] == 'VBR MP3' ) && lastsongsize != resultIdentifier['result'][i]['length']) {
                                                            lastsongsize = resultIdentifier['result'][i]['length'];
                                                            if (resultIdentifier['result'][i]['title'] == undefined) {
                                                                functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                functions.userData[userId][deviceId].MusicUrlList.push({
                                                                    identifier: result['response']['docs'][0]['identifier'],
                                                                    trackName: resultIdentifier['result'][i]['name'],
                                                                    title: 'Track Number ' + functions.userData[userId][deviceId].IdentifierSongsCountTotal,
                                                                    coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Not mentioned',
                                                                    year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Not mentioned',
                                                                });
                                                            }
                                                            else {
                                                                functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                resultIdentifier['result'][i]['title'] = _.replace(resultIdentifier['result'][i]['title'], /[^a-zA-Z0-9 ]/g, "");
                                                                functions.userData[userId][deviceId].MusicUrlList.push({
                                                                    identifier: result['response']['docs'][0]['identifier'],
                                                                    trackName: resultIdentifier['result'][i]['name'],
                                                                    title: resultIdentifier['result'][i]['title'],
                                                                    coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Coverage Not mentioned',
                                                                    year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Year Not mentioned',
                                                                });
                                                            }
                                                            //if (functions.userData[userId][deviceId].IdentifierSongsCountTotal == functions.userData[userId][deviceId].IdentifierSongsCount + 1) {
                                                            //    functions.userData[userId][deviceId].TotalTrack++;
                                                            //}
                                                        }
                                                    }
                                                    if (functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount] == undefined) {
                                                        functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                                                    }
                                                    if (functions.userData[userId][deviceId].MusicUrlList.length == 0) {
                                                        functions.userData[userId][deviceId].page++;
                                                        functions.getAudioPlayListSeventyEights.call(tempObj);
                                                    } else {
                                                        functions.userData[userId][deviceId].audioURL = 'https://archive.org/download/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + '/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['trackName'];
                                                        functions.userData[userId][deviceId].audioURLTitle = functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'];

                                                        if (intent.name == 'autoNext') {
                                                            if (constants.debug) {
                                                                console.log(intent.name);
                                                                console.log(functions.userData[userId][deviceId].audioURL);
                                                            }

                                                            let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                                            tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                            tempObj.emit(':responseReady');
                                                        } else {

                                                            if (canThrowCard.call(tempObj)) {
                                                                let cardTitle = "Playing track number - " + track;
                                                                let cardContent = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                tempObj.response.cardRenderer(cardTitle, cardContent, null);
                                                            }
                                                            let playBehavior = "REPLACE_ALL";
                                                            if (titleOff.call(tempObj)) {
                                                                let message = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                tempObj.response.speak(message).audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                tempObj.emit(':responseReady');
                                                            } else {
                                                                tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                tempObj.emit(':responseReady');
                                                            }
                                                        }
                                                    }

                                                } else {
                                                    if (intent.name == 'autoNext') {
                                                        let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                                        tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                        tempObj.emit(':responseReady');
                                                    } else {
                                                        let cardTitle = 'No Songs Found';
                                                        let repromptText = "No songs found. Please select topics like Jazz <break time='.5s'/> Instrumental or <break time='.5s'/> Dance.";
                                                        let speechOutput = "Sorry , No songs found. Please select topics like Jazz <break time='.5s'/> Instrumental or <break time='.5s'/> Dance.";
                                                        let cardOutput = "Sorry, No songs found. Please select topics like Jazz, Instrumental or dance.>";
                                                        tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                        tempObj.response.speak(speechOutput).listen(repromptText);
                                                        tempObj.emit(':responseReady');
                                                    }

                                                }
                                            }

                                        });
                                    }).on('error', function (e) {
                                        if (intent.name == 'autoNext') {
                                            let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                            tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                            tempObj.emit(':responseReady');
                                        } else {
                                            let cardTitle = 'Unable to understand your request. Please Try again.';
                                            let repromptText = 'Waiting for your response.';
                                            let speechOutput = "Sorry , Unable to understand your request. Please Try again.";
                                            let cardOutput = "Sorry, Unable to understand your request. Please Try again.";
                                            tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                            tempObj.response.speak(speechOutput).listen(repromptText);
                                            tempObj.emit(':responseReady');
                                        }

                                    });


                                } else {
                                    if (intent.name == 'autoNext') {
                                        let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                                        functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                                        functions.userData[userId][deviceId].page = 1;
                                        tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                        tempObj.emit(':responseReady');
                                    } else {
                                        let cardTitle = 'No Songs Found';
                                        let repromptText = 'No songs found. Please Try again.';
                                        let speechOutput = "Sorry , No songs found. Please Try again.";
                                        let cardOutput = "Sorry, No songs found. Please Try again.";
                                        tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                        tempObj.response.speak(speechOutput).listen(repromptText);
                                        tempObj.emit(':responseReady');
                                    }
                                }
                            }
                        });
                    }).on('error', function (e) {
                        if (intent.name == 'autoNext') {
                            let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                            functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                            functions.userData[userId][deviceId].page = 1;
                            tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                            tempObj.emit(':responseReady');
                        } else {
                            let cardTitle = 'Unable to understand your request. Please Try again.';
                            let repromptText = 'Waiting for your response.';
                            let speechOutput = "Sorry , Unable to understand your request. Please Try again.";
                            let cardOutput = "Sorry, Unable to understand your request. Please Try again.";
                            tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                            tempObj.response.speak(speechOutput).listen(repromptText);
                            tempObj.emit(':responseReady');
                        }
                    });
                }
            } else {
                if (intent.name == 'autoNext') {
                    let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                    functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                    functions.userData[userId][deviceId].page = 1;
                    tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                    tempObj.emit(':responseReady');
                } else {
                    let cardTitle = 'Unable to understand your request.';
                    let repromptText = 'Waiting for your response.';

                    let speechOutput = "Sorry, Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.";
                    let cardOutput = "Sorry, Unable to understand your request. Please Try again. By saying City and Year or Random.";
                    tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                    tempObj.response.speak(speechOutput).listen(repromptText);
                    tempObj.emit(':responseReady');
                }


            }

        },
        getOneGoPlayAudio: function () {
            let tempObj = Object.create(this);
            let userId = tempObj.event.context ? tempObj.event.context.System.user.userId : tempObj.event.session.user.userId;
            let deviceId = tempObj.event.context.System.device.deviceId;

            let intent = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'PlaybackController.PauseCommandIssued' || tempObj.event.request.type == 'PlaybackController.PlayCommandIssued' || tempObj.event.request.type == 'PlaybackController.PreviousCommandIssued' || tempObj.event.request.type == 'PlaybackController.NextCommandIssued' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? {name: 'autoNext'} : tempObj.event.request.intent;
            let track = functions.userData[userId][deviceId].counter + 1;
            functions.userData[userId][deviceId].MusicUrlList = (functions.userData[userId][deviceId].MusicUrlList == undefined) ? [] : functions.userData[userId][deviceId].MusicUrlList;
            //if (intent.name == 'OneGoPlayAudio' || functions.userData[userId][deviceId].typeQuery === true || intent.name == 'OneGoCollectionRandomPlayAudio') {

            if (intent.name == 'OneGoPlayAudio' || functions.userData[userId][deviceId].typeQuery === true || intent.name == 'OneGoCollectionRandomPlayAudio') {
                if (functions.userData[userId][deviceId].OneGoCollectionRandomPlayAudioStatus == false) {
                    functions.userData[userId][deviceId].city = intent.slots.CITY.value
                    functions.userData[userId][deviceId].year = intent.slots.YEAR.value;
                }
                if (intent.name == 'OneGoPlayAudio' || intent.name == 'OneGoCollectionRandomPlayAudio') {
                    functions.userData[userId][deviceId].collection = intent.slots.COLLECTION.value;
                }
                if ((intent.name == 'OneGoPlayAudio' || intent.name == 'OneGoCollectionRandomPlayAudio') && (functions.userData[userId][deviceId].collection != null && functions.userData[userId][deviceId].collection != undefined)) {

                    functions.userData[userId][deviceId].collectionQuery = '';
                    let collectionArray = functions.userData[userId][deviceId].collection.split(/[ ,]+/);

                    if (collectionArray.length > 1) {
                        functions.userData[userId][deviceId].collectionQuery = functions.userData[userId][deviceId].collectionQuery + '(';

                        for (let i = 1; i < collectionArray.length; i++) {
                            functions.userData[userId][deviceId].collectionQuery = functions.userData[userId][deviceId].collectionQuery + collectionArray[i];
                        }

                        functions.userData[userId][deviceId].collectionQuery = functions.userData[userId][deviceId].collectionQuery + ')+OR+collection:(';
                        for (let i = 0; i < collectionArray.length - 1; i++) {
                            functions.userData[userId][deviceId].collectionQuery = functions.userData[userId][deviceId].collectionQuery + collectionArray[i];
                        }

                        functions.userData[userId][deviceId].collection = _.replace(functions.userData[userId][deviceId].collection, / /g, '');
                        functions.userData[userId][deviceId].collectionQuery = '(' + functions.userData[userId][deviceId].collectionQuery + ')+OR+collection:(' + functions.userData[userId][deviceId].collection + ')+OR+collection:(the' + functions.userData[userId][deviceId].collection + '))';
                    }
                    else {
                        functions.userData[userId][deviceId].collection = _.replace(functions.userData[userId][deviceId].collection, / /g, '');
                        functions.userData[userId][deviceId].collectionQuery = '(' + functions.userData[userId][deviceId].collectionQuery + '(' + functions.userData[userId][deviceId].collection + ')+OR+collection:(the' + functions.userData[userId][deviceId].collection + '))';
                    }

                    if (functions.userData[userId][deviceId].OneGoCollectionRandomPlayAudioStatus == true) {

                        functions.userData[userId][deviceId].APIURL = constants.podcastCityAPIURL + functions.userData[userId][deviceId].collectionQuery + '+AND+format:(MP3)&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=1&page=' + functions.userData[userId][deviceId].page + '&indent=yes&output=json';
                    } else {
                        functions.userData[userId][deviceId].APIURL = constants.podcastCityAPIURL + functions.userData[userId][deviceId].collectionQuery + '+AND+format:(MP3)+AND+coverage%3A(' + functions.userData[userId][deviceId].city + ')+AND+year%3A(' + functions.userData[userId][deviceId].year + ')&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=-downloads&rows=1&page=' + functions.userData[userId][deviceId].page + '&indent=yes&output=json';
                    }


                } else {

                    if (functions.userData[userId][deviceId].OneGoCollectionRandomPlayAudioStatus == true) {
                        functions.userData[userId][deviceId].APIURL = constants.podcastCityAPIURL + functions.userData[userId][deviceId].collectionQuery + '+AND+format:(MP3)&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=random&rows=1&page=' + functions.userData[userId][deviceId].page + '&indent=yes&output=json';
                    } else {
                        functions.userData[userId][deviceId].APIURL = constants.podcastCityAPIURL + functions.userData[userId][deviceId].collectionQuery + '+AND+coverage%3A(' + functions.userData[userId][deviceId].city + ')+AND+year%3A(' + functions.userData[userId][deviceId].year + ')+AND+format:(MP3)&fl[]=coverage&fl[]=creator&fl[]=description&fl[]=downloads&fl[]=identifier&fl[]=mediatype&fl[]=subject,year,location&fl[]=title&sort[]=-downloads&rows=1&page=' + functions.userData[userId][deviceId].page + '&indent=yes&output=json';
                    }
                }
                if (constants.debug)
                    console.log('APIURL- ' + functions.userData[userId][deviceId].APIURL);
                let options = {
                    host: constants.host,
                    path: _.replace(functions.userData[userId][deviceId].APIURL, / /g, "%20"),
                    method: 'GET',
                    headers: {
                        "User-Agent": 'Alexa_Skill_Internet_Archive'
                    }
                };
                https.get(options, function (res) {
                    let body = '';
                    res.on('data', function (data) {
                        body += data;
                    });

                    res.on('end', function () {
                        if (constants.debug)
                            console.log(body);
                        if (!isValidJson(body)) {
                            functions.userData[userId][deviceId].page++;
                            functions.getAudioPlayList.call(tempObj);
                        } else if (JSON.parse(body)['response']['docs'] == undefined) {
                            functions.userData[userId][deviceId].page++;
                            functions.getAudioPlayList.call(tempObj);
                        } else {
                            let result = JSON.parse(body);
                            if (result != null && result['response']['docs'].length > 0) {
                                if ((intent.name == 'OneGoPlayAudio') || functions.userData[userId][deviceId].typeQuery === true || (intent.name == 'OneGoCollectionRandomPlayAudio') || (((functions.userData[userId][deviceId].city != null && functions.userData[userId][deviceId].year != null) || functions.userData[userId][deviceId].OneGoCollectionRandomPlayAudioStatus == true) && functions.userData[userId][deviceId].collectionQuery != null)) {

                                    if (intent.name == 'OneGoPlayAudio' && intent.name == 'OneGoCollectionRandomPlayAudio' || functions.userData[userId][deviceId].page == 1) {
                                        functions.userData[userId][deviceId].counter = 0;
                                        functions.userData[userId][deviceId].MusicUrlList = [];
                                    }
                                    if (functions.userData[userId][deviceId].IdentifierSongsCountTotal > 0) {
                                        if (functions.userData[userId][deviceId].IdentifierSongsCountTotal == functions.userData[userId][deviceId].IdentifierSongsCount + 1) {


                                            functions.userData[userId][deviceId].IdentifierCount++;

                                        }
                                    }
                                    //New Https Request for mp3 tracks
                                    functions.userData[userId][deviceId].APIURLIDENTIFIER = constants.APIURLIdentifier + result['response']['docs'][0]['identifier'] + '/files';
                                    let optionsIdentifier = {
                                        host: constants.host,
                                        path: functions.userData[userId][deviceId].APIURLIDENTIFIER,
                                        method: 'GET',
                                        headers: {
                                            "User-Agent": 'Alexa_Skill_Internet_Archive'
                                        }
                                    };
                                    if (constants.debug)
                                        console.log(optionsIdentifier);
                                    https.get(optionsIdentifier, function (response) {
                                        let bodyIdentifier = '';
                                        response.on('data', function (dataIdentifier) {
                                            bodyIdentifier += dataIdentifier;
                                        });

                                        response.on('end', function () {
                                            if (constants.debug)
                                                console.log(bodyIdentifier);
                                            if (!isValidJson(bodyIdentifier)) {
                                                functions.userData[userId][deviceId].page++;
                                                functions.getAudioPlayList.call(tempObj);
                                            } else if (JSON.parse(bodyIdentifier)['result'] == undefined) {
                                                functions.userData[userId][deviceId].page++;
                                                functions.getAudioPlayList.call(tempObj);
                                            } else {
                                                let resultIdentifier = JSON.parse(bodyIdentifier);
                                                if (resultIdentifier != null && resultIdentifier['result'].length > 0) {
                                                    functions.userData[userId][deviceId].IdentifierSongsCountTotal = 0;
                                                    let lastsongsize = '';
                                                    for (let i = 0; i < resultIdentifier['result'].length; i++) {
                                                        if (( resultIdentifier['result'][i]['format'] == 'MP3' || resultIdentifier['result'][i]['format'] == 'VBR MP3' ) && lastsongsize != resultIdentifier['result'][i]['length']) {
                                                            lastsongsize = resultIdentifier['result'][i]['length'];
                                                            if (resultIdentifier['result'][i]['title'] == undefined) {
                                                                functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                functions.userData[userId][deviceId].MusicUrlList.push({
                                                                    identifier: result['response']['docs'][0]['identifier'],
                                                                    trackName: resultIdentifier['result'][i]['name'],
                                                                    title: 'Track Number ' + functions.userData[userId][deviceId].IdentifierSongsCountTotal,
                                                                    coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Coverage Not mentioned',
                                                                    year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Year Not mentioned',
                                                                });
                                                            } else {
                                                                resultIdentifier['result'][i]['title'] = _.replace(resultIdentifier['result'][i]['title'], /[^a-zA-Z0-9 ]/g, "");
                                                                functions.userData[userId][deviceId].IdentifierSongsCountTotal = functions.userData[userId][deviceId].IdentifierSongsCountTotal + 1;
                                                                functions.userData[userId][deviceId].MusicUrlList.push({
                                                                    identifier: result['response']['docs'][0]['identifier'],
                                                                    trackName: resultIdentifier['result'][i]['name'],
                                                                    title: resultIdentifier['result'][i]['title'],
                                                                    coverage: (result['response']['docs'][0]['coverage']) ? result['response']['docs'][0]['coverage'] : 'Coverage Not mentioned',
                                                                    year: (result['response']['docs'][0]['year']) ? result['response']['docs'][0]['year'] : 'Year Not mentioned',
                                                                });
                                                            }

                                                        }
                                                    }

                                                    if (functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount] == undefined) {
                                                        functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                                                    }
                                                    if (functions.userData[userId][deviceId].MusicUrlList.length == 0) {
                                                        functions.userData[userId][deviceId].page++;
                                                        functions.getOneGoPlayAudio.call(tempObj);
                                                    } else {
                                                        if (functions.userData[userId][deviceId].OneGoCollectionRandomPlayAudioStatus === true) {

                                                            functions.userData[userId][deviceId].audioURL = 'https://archive.org/download/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + '/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['trackName'];
                                                            functions.userData[userId][deviceId].audioURLTitle = functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'];
                                                        } else {
                                                            functions.userData[userId][deviceId].audioURL = 'https://archive.org/download/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + '/' + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['trackName'];
                                                            functions.userData[userId][deviceId].audioURLTitle = functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'];
                                                        }
                                                        if (intent.name == 'autoNext') {
                                                            let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';
                                                            tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                            tempObj.emit(':responseReady');
                                                        } else {
                                                            if (canThrowCard.call(tempObj)) {
                                                                let cardTitle = "Playing track number - " + track;
                                                                let cardContent = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                tempObj.response.cardRenderer(cardTitle, cardContent, null);
                                                            }
                                                            let playBehavior = "REPLACE_ALL";
                                                            if (titleOff.call(tempObj)) {
                                                                let message = "Playing track - " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['title'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['coverage'] + ", " + functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['year'] + ".";
                                                                tempObj.response.speak(message).audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                tempObj.emit(':responseReady');
                                                            } else {
                                                                tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                                tempObj.emit(':responseReady');
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    if (intent.name == 'autoNext') {
                                                        let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';
                                                        tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                                        tempObj.emit(':responseReady');
                                                    } else {
                                                        let cardTitle = 'No Songs Found';
                                                        let repromptText = ' No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                                                        let speechOutput = "  Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/> random ";
                                                        let cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or Random";
                                                        tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                                        tempObj.response.speak(speechOutput).listen(repromptText);
                                                        tempObj.emit(':responseReady');
                                                    }
                                                }
                                            }
                                        });
                                    }).on('error', function (e) {
                                        if (intent.name == 'autoNext') {
                                            let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';
                                            tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                            tempObj.emit(':responseReady');
                                        } else {
                                            let cardTitle = 'Unable to understand your request. ';
                                            let repromptText = 'Waiting for your response.Please Try again by select. City and Year. or <break time=".1s"/> random.';
                                            let speechOutput = "Sorry , Unable to understand your request. Please Try again by select. City and Year. or <break time='.1s'/> random.";
                                            let cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";
                                            tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                            tempObj.response.speak(speechOutput).listen(repromptText);
                                            tempObj.emit(':responseReady');
                                        }
                                    });

                                }
                            }
                            else {

                                if (intent.name == 'autoNext') {
                                    let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';
                                    functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                                    functions.userData[userId][deviceId].page = 1;
                                    tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                                    tempObj.emit(':responseReady');
                                } else {
                                    let cardTitle = 'No Songs Found';
                                    let repromptText = 'No songs found. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                                    let speechOutput = "Sorry , No songs found. Please Try again by saying. City and Year. or <break time='.1s'/>  random.";
                                    let cardOutput = "Sorry, No songs found. Please Try again by saying City and Year or random.";
                                    tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                                    tempObj.response.speak(speechOutput).listen(repromptText);
                                    tempObj.emit(':responseReady');
                                }
                            }
                        }
                    });
                }).on('error', function (e) {
                    if (intent.name == 'autoNext') {
                        let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                        functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                        functions.userData[userId][deviceId].page = 1;
                        tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                        tempObj.emit(':responseReady');
                    } else {
                        functions.userData[userId][deviceId].collection = null;
                        functions.userData[userId][deviceId].year = null;
                        functions.userData[userId][deviceId].city = null;
                        let cardTitle = 'Unable to understand your request.';
                        let repromptText = 'Waiting for your response. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                        let speechOutput = "Sorry , Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.";
                        let cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";

                        tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                        tempObj.response.speak(speechOutput).listen(repromptText);
                        tempObj.emit(':responseReady');
                    }
                });
            } else {
                if (intent.name == 'autoNext') {
                    let playBehavior = (tempObj.event.request.type == 'AudioPlayer.PlaybackNearlyFinished' || tempObj.event.request.type == 'AudioPlayer.PlaybackFailed') ? 'REPLACE_ENQUEUED' : 'REPLACE_ALL';

                    functions.userData[userId][deviceId].IdentifierSongsCount = 0;
                    functions.userData[userId][deviceId].page = 1;
                    tempObj.response.audioPlayerPlay(playBehavior, functions.userData[userId][deviceId].audioURL, functions.userData[userId][deviceId].MusicUrlList[functions.userData[userId][deviceId].IdentifierSongsCount]['identifier'] + functions.userData[userId][deviceId].counter, null, functions.userData[userId][deviceId].offsetInMilliseconds);
                    tempObj.emit(':responseReady');
                } else {
                    let cardTitle = 'Unable to understand your request.';
                    let repromptText = 'Waiting for your response. Please Try again by saying. City and Year. or <break time=".1s"/> random.';
                    let speechOutput = "Sorry, Unable to understand your request. Please Try again by saying. City and Year. or <break time='.1s'/> random.";
                    let cardOutput = "Sorry, Unable to understand your request. Please Try again by saying City and Year or Random.";
                    tempObj.response.cardRenderer(cardTitle, cardOutput, null);
                    tempObj.response.speak(speechOutput).listen(repromptText);
                    tempObj.emit(':responseReady');
                }

            }
            //}

        }
    }
}();
module.exports = functions;

function titleOff() {
    /*
     * To determine when can a response speach out should be inserted in the response.
     * In response to a PlaybackController Request (remote control events) we cannot issue a response speach ,
     * Thus adding restriction.
     */
    console.log('titleOff');
    console.log(this.event.request.intent);
    console.log(this.attributes);
    if (this.attributes.TITLEOFF != undefined) {
        if (this.attributes.TITLEOFF == true) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

function canThrowCard() {
    /*
     * To determine when can a card should be inserted in the response.
     * In response to a PlaybackController Request (remote control events) we cannot issue a card,
     * Thus adding restriction of request type being "IntentRequest".
     */
    if (this.event.request.type === 'IntentRequest') {
        return true;
    } else {
        return false;
    }
}

function isValidJson(json) {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
}

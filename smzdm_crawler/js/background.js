// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var interval = 30;
var isContinue = true;
var lastTime = new Date().toISOString().slice(0, 10) + " 08:00";

var startUrl = "http://www.smzdm.com/youhui/";
var currentTime = ""

var tmpResult = [];
var MAX_SIZE = 50;

// chrome.runtime.onInstalled.addListener(init);
// chrome.alarms.onAlarm.addListener(onAlarm);
// init();

// chrome.alarms.onAlarm.addListener(function( alarm ) {
//   console.log("Got an alarm!", alarm);
// });


window.addEventListener("load", init, false);

function init() {
	if (localStorage.interval != undefined) {
		interval = parseInt(localStorage.interval)
	} else {
		localStorage.interval = interval;
	}
	if (localStorage.lastTime != undefined) {
		lastTime = localStorage.lastTime
	} else {
		localStorage.lastTime = lastTime;
	}

	// check every XXX milliseconds
	crawl()
	var inter = setInterval(crawl, interval * 60 * 1000);
}

function crawl() {
	isContinue = true
	doIt(startUrl)
	var page = 2
	while (isContinue) {
		doIt(startUrl + "p" + page + "/")
		page += 1
	}
}

function doIt(url) {
	var req = new XMLHttpRequest();
	req.open(
		"GET",
		url,
		false);

	req.setRequestHeader('Access-Control-Allow-Headers', '*');
	req.setRequestHeader('Content-type', 'application/ecmascript');
	req.setRequestHeader('Access-Control-Allow-Origin', '*');
	req.onload = function() {
		var html = jQuery(req.responseText);
		var titles = html.find(".list.list_preferential").find("h2").find("a");
		var pics = html.find(".list.list_preferential").find(".picLeft").find("img");
		var updateTime = html.find(".lrTime");

		var index = [];

		if (formatDate($(updateTime[0]).text()) > currentTime) {
			currentTime = formatDate($(updateTime[0]).text())
		}

		var keywords = localStorage.keywords;
		if (keywords == undefined) {
			keywords = ''
		}else{
                  keywrods=keywords.split(",")
                }
		if (keywords.length == 0 || keywords[0] == '') {
			console.log("print all");
			for (var i = 0; i < titles.length; i++) {
				if (formatDate($(updateTime[i]).text()) > localStorage.lastTime) {
					index.push(i);
				}
			}
		} else {
			console.log("print filtered");
			for (var i = 0; i < titles.length; i++) {
				for (var j = 0; j < keywords.length; j++) {
					if (titles[i].text.includes(keywords[j]) && formatDate($(updateTime[i]).text()) > localStorage.lastTime) {
						console.log("match: "+titles[i].text);
						index.push(i);
						break;
					}
				}
			}
		}

		if (index.length > 0) {
			for (var i = 0; i < index.length; i++) {
				var text = "<tr>";
				text = text + "<td>" + formatDate($(updateTime[index[i]]).text()) + "</td/>"
				text = text + "<td>" + titles[index[i]].outerHTML + "</td/>"
				text = text + "<td>" + pics[index[i]].outerHTML + "</td>" + "</tr>"
					// $("#mybody").append(text)
				tmpResult.push(text);
			}
		}

		if (formatDate($(updateTime[updateTime.length - 1]).text()) < localStorage.lastTime) {
			localStorage.lastTime = currentTime
			isContinue = false;
		}

		if (!isContinue) {
			var tmp = localStorage.result
			var result = [];

			if (tmp != undefined) {
				result = JSON.parse(tmp);
			}

			if (tmpResult.length > 0 && tmpResult[1] != '') {
				showNotification(tmpResult.length)
			}

			for (var a = 0; a < result.length; a++) {
				if (tmpResult.length > MAX_SIZE) {
					break;
				}
				tmpResult.push(result[a])
			}
			localStorage.result = JSON.stringify(tmpResult);
			tmpResult = []
		}
	}
	req.send(null);
}

function showNotification(updates) {
	var time = /(..)(:..)/.exec(new Date()); // The prettyprinted time.
	var hour = time[1] % 12 || 12; // The prettyprinted hour.
	var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
	new Notification(hour + time[2] + ' ' + period, {
		icon: '../image/icon.png',
		body: updates + ' updates!'
	});
}

function formatDate(dateStr) {
	var day = new Date().toISOString().slice(0, 10);
	var year = new Date().toISOString().slice(0, 4);
	if (dateStr.length == 5) {
		return day + " " + dateStr
	} else if (dateStr.length == 11) {
		return year + "-" + dateStr
	} else {
		return dateStr
	}
}

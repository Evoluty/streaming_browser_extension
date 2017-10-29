// Constants
var stream_url = "https://gaming.youtube.com/c/<stream_url>/live";

var twitch_api = "https://api.twitch.tv/kraken/streams/<name_of_account>";
var twitch_key = "<dev_key>";
var twitch_refresh_time = 2;

var youtube_api = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&channelId=<id_youtube_channel>";
var youtube_key = "<dev_key>";
var youtube_schedules_start = "14:00";
var youtube_schedules_stop = "23:00";
var youtube_refresh_time = 30;

var displayNotificationNextTime = null;


function display_notification() {
	var opt = {
		type: "basic",
		title: "Notification title",
		message: "Notification message",
		iconUrl: "icon_notification.png"
	};					
	chrome.notifications.create(null, opt);
}

function set_stream_on() {
	chrome.browserAction.setIcon({path:"icon_live.png"});
	if (displayNotificationNextTime) {
		display_notification();
		displayNotificationNextTime = false;
	}
}

function set_stream_off() {
	chrome.browserAction.setIcon({path:"icon_off.png"});
	displayNotificationNextTime = true;
}

function in_schedules(start, end) {
	var cur_date = new Date();

	var start_date = (new Date()).setHours(youtube_schedules_start.split(":")[0], youtube_schedules_start.split(":")[1]);
	var stop_date = (new Date()).setHours(youtube_schedules_stop.split(":")[0], youtube_schedules_stop.split(":")[1]);

	return (start_date < cur_date && cur_date < stop_date);
}

function poll_twitch() {
	var result = null;
	$.get({
		url: twitch_api,
		dataType : 'json',
		contentType: 'application/json',
		async: false,
		headers : {
			"Client-ID": twitch_key
		},		
	})
	.done(function(data) {
		result = (data.stream != null);
	});
	return result;
}

function poll_youtube() {
	var result = null;
	$.get({
		url: youtube_api,
		dataType : 'json',
		contentType: 'application/json',
		async: false,
		data : {
			"key": youtube_key
		},		
	})
	.done(function(data) {
		result = (data.pageInfo.totalResults != 0)
	});
	return result;
}

function refresh_twitch() {
	if (poll_twitch()) {
		set_stream_on();	
	} else {
		set_stream_off();
	}
}

function refresh_youtube() {
	if (in_schedules(youtube_schedules_start, youtube_schedules_stop) && !poll_twitch()) {
		if (poll_youtube()) {
			set_stream_on();
		} else {
			set_stream_off();
		}
	} 
}

function set_twitch_alarm() {	
	chrome.alarms.create("refresh_twitch", {
		when: Date.now() + 10000, 
		periodInMinutes: twitch_refresh_time
	});
}

function set_youtube_alarm() {
	chrome.alarms.create("refresh_youtube", {
		when: Date.now() + 10000, 
		periodInMinutes: youtube_refresh_time
	});
}

function set_alarm_listener() {
	chrome.alarms.onAlarm.addListener(function(alarm) {
		if (alarm.name == "refresh_twitch") {
			refresh_twitch();
		} else if (alarm.name == "refresh_youtube") {
			refresh_youtube();
		}
	});
}

function set_notification_listener() {
	chrome.notifications.onClicked.addListener(function(notificationId) {
		chrome.tabs.create({
			url: stream_url
		});
		chrome.notifications.clear(notificationId);
	});
}


// Start extension behavior
set_stream_off();

set_notification_listener();
set_alarm_listener();

set_twitch_alarm();
set_youtube_alarm();

# streaming_browser_extension

These extensions allows users to be notified when the streamer is live.  
I made this extension for a friend of mine who stream both on youtube and twitch.

The extension will poll the twitch and the youtube api to check if the stream is online.   
When the stream is online, the user gets a notification and the icon of the extension will change.

The twitch API is quite easy to use but I had troubles with the Youtube one because of requests quotas.  
To deal with that, I had to use schedules for youtube polling and check on twitch before each call to be sure not to use useless quotas. Each request costs 100 credits and I only have 1 million per day which is not enough when polling frequently.

I use synchronous calls which are deprecated to keep things in separates functions.  

To work well, you will need to put 3 PNG images : "icon_live.png", "icon_notification.png", "icon_off.png" but also to set correctly the constants and the manifest.   

The two extensions code are close but the way clicks are handled is different.   
Also, I had to ask one more permission in firefox to allow cross origin requests, which were given 404 without, when contacting the youtube api.

You should be able to get most of the stuff even if you are only streaming on Twitch.   
I tried to keep the js code as readable as possible.

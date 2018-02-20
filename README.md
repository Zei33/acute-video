# Acute Video
Acute Video is an open source and extremely light weight HTML5 video player. 

The goal of acute video is to create a video player that is simple to implement and easy to use HTML5 video player that leverages the full potential of modern browsers.

This project is still in development and much of the functionality has not yet been implemented. The font is imported into the css file from Google Fonts at the moment, this behaviour will be changed later.

Icons are SVGs from [Font Awesome's Free Audio & Video Icon Library](https://fontawesome.com/icons?d=gallery&c=audio-video&m=free).

Check out a live example of acute video [here](https://zeiworld.net/acute-video/)!

## How To Use
Add [acute-video.js](https://github.com/Zei33/acute-video/blob/master/acute-video.js) and [acute-video.css](https://github.com/Zei33/acute-video/blob/master/acute-video.css) to the appropriate directories on your server.

Import the two files into your website's head. Ensure that you reference the correct file locations.
```
<script src="acute-video.js"></script>
<link rel="stylesheet" href="acute-video.css">
```

Insert `<div class="acute-video"></div>` wherever you'd like the video to be located on the page. The `acute-video` class is not a requirement.

To initiate the video element, call `acuteVideo(element, options)` somewhere on the page.

To add a source to the video, call `acuteSource(element, source)` after the video element has been initiated. This function can be called at any point to change the video source.

```
// Wait until the page has finished loading.
document.addEventListener("DOMContentLoaded", function() {

	acuteVideo(".acute-video", {
		"width" : "630px",
		"height" : "360px"
	});

	acuteSource(element, "http://techslides.com/demos/samples/sample.mp4");

});
```

There are many options available with the `acuteVideo()` function to customise the HTML5 player's look and feel. It should be noted that multiple instances of acute video are allowed on the same page, just run `acuteVideo()` on each element you'd like to initiate as a player.

## Priorities

- [X] Play/Pause Button
- [X] Fullscreen Toggle Button
- [X] Scrubber/Playhead
- [X] Textual Playback Indicator
- [ ] Volume Controls
- [ ] Source Controls
- [ ] Subtitle Controls (WebVTT)
- [ ] Cleanup Code
- [ ] Minified and Versioned Code

## Long Term Objectives

- [ ] Improve Implementation Customisability
- [ ] Subtitle Format Converter
- [ ] Improve Browser Compatibility
- [ ] Implement Mobile Compatibility
- [ ] Generate Poster Based On Source
- [ ] Scrubber Thumbnail Preview
- [ ] Time-View Graph With Playhead
- [ ] Support WSS MJPEG Live Feeds

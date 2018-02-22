<!DOCTYPE html>

<html>
	
	<head>
		<title>acute-video</title>
		<script src="acute-icons.js"></script>
		<script src="acute-video.js"></script>
		<link rel="stylesheet" href="acute-video.css">
	</head>
	
	<body>
		
		<div class="acute-video"></div>
		
		<div style="padding:5px;margin:5px 0px 0px 0px;border:1px solid #ffe7c2;background-color:#fff3e0;display:inline-block;font-family:'Quicksand', sans-serif;font-weight:300;border-radius:2px;"><span style="font-weight:400;">Developer's Note:</span> The random subtitles are for testing of the subtitle functionality.</div><br>
		<div style="padding:5px;margin:5px 0px 0px 0px;border:1px solid #ffe7c2;background-color:#fff3e0;display:inline-block;font-family:'Quicksand', sans-serif;font-weight:300;border-radius:2px;"><span style="font-weight:400;">Also Note To Self:</span> Volume slider isn't initiating at the correct volume level. Okay, it's 7am, have a good sleep you mad man.</div>
		
	</body>
	
	<script>
		
		document.addEventListener("DOMContentLoaded", function() {
			
			acuteVideo(".acute-video", {
				"width" : "830px",
				"height" : "467px",
				"autoplay" : false,
				"controlFadeTime" : 2000,
				"title" : "Big Buck Bunny",
				"subtitle" : "Developer Sample Video",
				"barBlur" : false,
				"showSourceButton" : true,
				"showSubtitleButton" : true
			});
			
			acuteSource(".acute-video", "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4");
			
			acuteSubtitle(".acute-video", {
				"label" : "English",
				"kind" : "subtitles",
				"source" : "subtitle.vtt",
				"language" : "en"
			});
	
		});
		
	</script>
	
</html>
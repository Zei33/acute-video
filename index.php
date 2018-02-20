<!DOCTYPE html>

<html>
	
	<head>
		<title>acute-video</title>
		<script src="acute-video.js"></script>
		<link rel="stylesheet" href="acute-video.css">
	</head>
	
	<body>
		
		<div class="acute-video"></div>
		
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
				"kind" : "subtitles",
				"source" : "subtitle.vtt",
				"language" : "en"
			});
	
		});
		
	</script>
	
</html>
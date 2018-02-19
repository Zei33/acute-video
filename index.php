<!DOCTYPE html>

<html>
	
	<head>
		<title>acute-video.js</title>
		<script src="acute-video.js"></script>
		<link rel="stylesheet" href="acute-video.css">
	</head>
	
	<body>
		
		<div class="acute-video av container">
			<div class="av controller">
				<div class="av controller-offset"></div>
				<div class="av scrubber">
					<div class="av playback">
						<div class="av playhead"></div>
					</div>
				</div>
				<div class="av controller-bar"></div>
			</div>
			<video class="av player"></video>
		</div>
		
	</body>
	
	<script>
		
		document.addEventListener("DOMContentLoaded", function() {
			
			element = document.querySelector(".acute-video");
			
			acuteVideo(element, {
				"width" : "630px",
				"height" : "360px",
				"autoplay" : true,
				"controlFadeTime" : 2000,
				"title" : "Sample Video",
				"subtitle" : "3,245 Views",
				"barBlur" : false,
				"showSourceButton" : true,
				"showSubtitleButton" : true
			});
			
			acuteSource(element, "http://techslides.com/demos/samples/sample.mp4");
	
		});
		
	</script>
	
</html>
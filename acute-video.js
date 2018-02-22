Number.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); 
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10 && hours > 0) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return (hours == 0 ? "" : hours+':')+minutes+':'+seconds;
}

var merge = function merge(){
    var destination = {},
        sources = [].slice.call( arguments, 0 );
    sources.forEach(function( source ) {
        var prop;
        for ( prop in source ) {
            if ( prop in destination && Array.isArray( destination[ prop ] ) ) {
                
                // Concat Arrays
                destination[ prop ] = destination[ prop ].concat( source[ prop ] );
                
            } else if ( prop in destination && typeof destination[ prop ] === "object" ) {
                
                // Merge Objects
                destination[ prop ] = merge( destination[ prop ], source[ prop ] );
                
            } else {
                
                // Set new values
                destination[ prop ] = source[ prop ];
                
            }
        }
    });
    return destination;
};

function acuteVideo( target, options ){
	
	var controlsTimer;
	var playheadUpdate;
	
	options = merge({
		"width" : "640px",
		"height" : "360px",
		"autoplay" : false,
		"controlFadeTime" : 2000,
		"title" : "",
		"subtitle" : "",
		"playheadColor" : "#f90",
		"barBlur" : false,
		"controlColor" : "rgba(255,255,255,0.7)",
		"showPlayButton" : true,
		"showFullscreenButton" : true,
		"showScrubBar" : true,
		"showPlaybackTime" : true,
		"showVolumeButton" : true,
		"showSourceButton" : false,
		"showSubtitleButton" : false
	}, options);
	
	var container = document.querySelector(target);
	container.classList.add("av", "container");
	container.innerHTML = '\
	<div class="av controller">\
		<div class="av controller-offset"></div>\
		<div class="av scrubber">\
			<div class="av playback">\
				<div class="av playhead"></div>\
			</div>\
		</div>\
		<div class="av controller-bar">\
			<div class="av controller-left"></div>\
			<div class="av controller-right"></div>\
		</div>\
	</div>\
	<video class="av player"></video>';
	
	var player = document.querySelector(target + " video.av.player");
	var controls = document.querySelector(target + " .av.controller");
	var controlBar = document.querySelector(target + " .av.controller-bar");
	var controlsLeft = document.querySelector(target + " .av.controller-left");
	var controlsRight = document.querySelector(target + " .av.controller-right");
	var controlOffset = document.querySelector(target + " .av.controller-offset");
	var playhead = document.querySelector(target + " .av.playhead");
	var playback = document.querySelector(target + " .av.playback");
	
	player.autoplay = options.autoplay;
	
	container.style.width = options.width;
	container.style.height = options.height;
	
	controlBar.style.color = options.controlColor;
	if (options.barBlur) controlBar.style.setProperty("backdrop-filter", "blur(2px)");
	
	playhead.style.backgroundColor = options.playheadColor;
	
	// Set initial control bar fade timer.
	controlsTimer = setTimeout(function(){
		controls.classList.add("hide");
		player.classList.add("hidden-controls");
	}, options.controlFadeTime);
	
	// Show the control bar when the mouse moves on over the video element and resets the fade timer.
	container.addEventListener("mousemove", function(){
		
		controls.classList.remove("hide");
		player.classList.remove("hidden-controls");
		
		clearTimeout(controlsTimer);
		
		controlsTimer = setTimeout(function(){
			controls.classList.add("hide");
			player.classList.add("hidden-controls");
		}, options.controlFadeTime);
		
	});
	
	container.addEventListener("mouseleave", function(){
		
		clearTimeout(controlsTimer);
		
		controls.classList.add("hide");
		player.classList.add("hidden-controls");
		
	});
	
	// Add a title and/or subtitle if any is set.
	if ((options.title + options.subtitle).length > 0){
		controlOffset.innerHTML = '<div class="av controller-offset-title av-text">' + options.title + '</div><div class="av controller-offset-subtitle av-text">' + options.subtitle + '</div>';
	}else{
		controlOffset.classList.add("hide");
	}
	
	if (options.showPlayButton){
		
		controlsLeft.innerHTML += '<button class="av av-controller-button play">' + putSVG("play") + '</button><button class="av av-controller-button pause" style="display:none">' + putSVG("pause") + '</button></div>';

	}
	
	if (options.showSubtitleButton){
		
		controlsRight.innerHTML += '<button class="av av-controller-button subtitle">' + putSVG("captions") + '</button>';
		controlOffset.innerHTML += '<div class="av subtitle-list"></div>';
		
	}
	
	if (options.showFullscreenButton){
		
		controlsRight.innerHTML += '<button class="av av-controller-button fullscreen">' + putSVG("expand") + '</button><button class="av av-controller-button close-fullscreen" style="display:none">' + putSVG("compress") + '</button>';
		
	}
	
	if (options.showVolumeButton){
		
		controlsLeft.innerHTML += '<div class="av volume-container"><button class="av av-controller-button volume">' + putSVG("volumehigh") + '</button><button class="av av-controller-button unmute" style="display:none;">' + putSVG("volumemute") + '</button><div class="av volume-control"><div class="av volume-bar-outer"><div class="av volume-bar-inner"></div></div></div></div>';
		
	}
	
	if (options.showPlaybackTime){
		
		controlsLeft.innerHTML += '<div class="av playback-time av-text">0:00 / 0:00</div>';
		
	}
	
	if (options.showPlayButton){
		
		var playButton = document.querySelector(target + " button.av.av-controller-button.play");
		var pauseButton = document.querySelector(target + " button.av.av-controller-button.pause");
		
		playButton.addEventListener("click", function(){
			player.play();
			startPlayhead(player, playhead);
			
			playButton.style.display = "none";
			pauseButton.style.display = "inline-block";
		});
		
		pauseButton.addEventListener("click", function(){
			player.pause();
			endPlayhead();
			
			pauseButton.style.display = "none";
			playButton.style.display = "inline-block";
		});
		
	}
	
	if (options.showSubtitleButton){
	
		var subtitleButton = document.querySelector(target + " button.av.av-controller-button.subtitle");
		var subtitleList = document.querySelector(target + " .av.subtitle-list");
		
		subtitleButton.addEventListener("click", function(){
			if (subtitleList.classList.contains("show")){
				subtitleList.classList.remove("show");
			}else{
				setTimeout(function(){
					subtitleList.classList.add("show");
				}, 10);
			}
		});
		
		controls.addEventListener("click", function(e){
			if (subtitleList.classList.contains("show")){
				subtitleList.classList.remove("show");
			}
		});
		
	}
	
	if (options.showFullscreenButton){
		
		var fullscreenButton = document.querySelector(target + " button.av.av-controller-button.fullscreen");
		var closeFullscreenButton = document.querySelector(target + " button.av.av-controller-button.close-fullscreen");
		
		fullscreenButton.addEventListener("click", function(){
			fullscreenButton.style.display = "none";
			closeFullscreenButton.style.display = "inline-block";
			
			if (player.requestFullscreen) {
				container.requestFullscreen();
			} else if (player.webkitRequestFullScreen) {
				container.webkitRequestFullScreen();
			} else if (player.mozRequestFullScreen) {
				container.mozRequestFullScreen();
			} else if (player.msRequestFullscreen) {
				container.msRequestFullscreen();
			}
			
			container.style.width = "100%";
			container.style.height = "100%";

		});
		
		closeFullscreenButton.addEventListener("click", function(){
			closeFullscreenButton.style.display = "none";
			fullscreenButton.style.display = "inline-block";
			
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (player.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (player.msExitFullscreen) {
				document.msExitFullscreen();
			}
			
			container.style.width = options.width;
			container.style.height = options.height;
		});
		
		["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"].forEach(function(event){
			document.addEventListener(event, function(){
				if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement){
					closeFullscreenButton.style.display = "none";
					fullscreenButton.style.display = "inline-block";
					
					container.style.width = options.width;
					container.style.height = options.height;
				}
			});
		});
		
	}
	
	if (options.showVolumeButton){
		
		var volumeButton = document.querySelector(target + " .av.volume");
		var unmuteButton = document.querySelector(target + " .av.unmute");
		var volumeBarOuter = document.querySelector(target + " .av.volume-bar-outer");
		var volumeBarInner = document.querySelector(target + " .av.volume-bar-inner");
		
		volumeButton.addEventListener("click", function(){
			volumeButton.style.display = "none";
			unmuteButton.style.display = "inline-block";
			
			player.muted = true;
		});
		
		unmuteButton.addEventListener("click", function(){
			unmuteButton.style.display = "none";
			volumeButton.style.display = "inline-block";
			
			player.muted = false;
		});
		
		volumeBarOuter.addEventListener("click", function(e){
			
			fraction = ((e.clientX - volumeBarOuter.getBoundingClientRect().left) / window.getComputedStyle(volumeBarOuter).getPropertyValue("width").slice(0, -2));
			volumeBarInner.style.width = (100 * fraction) + "%";
			player.volume = fraction;
			
		});
		
	}
	
	document.querySelectorAll(target + " button.av.av-controller-button").forEach(function(controlButton){
		controlButton.style.color = options.controlColor;
		volumeBarInner.style.backgroundColor = options.controlColor;
	});
	
	player.addEventListener("timeupdate", function(){
		
		if (options.showPlaybackTime){
			
			var playbackTime = document.querySelector(target + " .av.playback-time");
			
			playbackTime.innerHTML = Math.ceil(player.currentTime).toHHMMSS() + " / " + Math.ceil(player.duration).toHHMMSS();
			
		}
	});
	
	playback.addEventListener("click", function(e){
		
		endPlayhead();
		playerPaused = player.paused;
		player.pause();
		playhead.style.transition = "width 10ms linear";
		player.currentTime = player.duration * ((e.clientX - playhead.getBoundingClientRect().left) / window.getComputedStyle(playback).getPropertyValue("width").slice(0, -2));
		playhead.style.width = 100 * ((e.clientX - playhead.getBoundingClientRect().left) / window.getComputedStyle(playback).getPropertyValue("width").slice(0, -2)) + "%";
		setTimeout(function(){
			playhead.style.transition = "width 200ms linear";
			if (!playerPaused){
				startPlayhead(player, playhead);
				player.play();
			}
		}, 10);
		
		
	});
	
}

function acuteSource( target, source ){
	
	var player = document.querySelector(target + " video.av.player");
	
	if (Array.isArray(source)){
		
	}else{
	
		player.src = source;
		setTimeout(function(){
			player.dispatchEvent((new Event("timeupdate")));
		},1000);
	
	}
	
}

function acuteSubtitle( target, source ){
	
	var player = document.querySelector(target + " video.av.player");
	var subtitleList = document.querySelector(target + " .av.subtitle-list");
	
	subtitleList.innerHTML += '<button class="av subtitle-list-button av-text av-nosubtitles" data-track="">No Subtitles</button>';
	
	if (!Array.isArray(source)){
		temp = source;
		source = [];
		source.push(temp);
	}
		
	source.forEach(function(multiSource, multiKey){
		
		player.innerHTML += '<track class="av av-track" kind="' + multiSource.kind + '" src="' + multiSource.source + '" srclang="' + multiSource.language + '" label="' + multiSource.label + '">';
		subtitleList.innerHTML += '<button class="av subtitle-list-button av-text" data-track="' + multiKey + '">' + multiSource.label + '</button>';
		
	});
	
	document.querySelectorAll(target + " .av.subtitle-list-button").forEach(function(subtitleButton){
		
		subtitleButton.addEventListener("click", function(){
			
			for(i=0;i<player.textTracks.length;i++){
				player.textTracks[i].mode = "hidden";
			}
			
			console.log(player.textTracks);
			
			if (!this.classList.contains("av-nosubtitles")){
			
				player.textTracks[this.getAttribute("data-track")].mode = "showing";
			
			}else{
				console.log("Clicked");
			}
			
		});
		
	});
	
}

function startPlayhead( player, playhead ){
	
	playheadUpdate = setInterval(function(){
		
		percent = 100 / ( player.duration / 0.05 ); // Duration of 1 second produces 20%; Duration of 5 seconds produces 4%
		
		playhead.style.width = ((percent * Math.floor(player.currentTime / 0.05))) + "%";
		
	}, 50);
	
}

function endPlayhead(){
	
	clearInterval(playheadUpdate);
	
}
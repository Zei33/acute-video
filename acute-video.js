document.addEventListener("DOMContentLoaded", function(){
	
	
	
});

Number.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
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

var controlsTimer;
var playheadUpdate;

function acuteVideo( target, options ){
	
	options = merge({
		"width" : "640px",
		"height" : "360px",
		"autoplay" : false,
		"controlFadeTime" : 2000,							// Control fade time : time in milliseconds until the control bar fades.
		"title" : "",											// Title : set a title for the video.
		"subtitle" : "",										// Subtitle : set a subtitle for the video.
		"playheadColor" : "#f90",							// Playhead color : set the playhead color.
		"barBlur" : false,									// Bar blur : add a guassian blur to the control bar background.
		"controlColor" : "rgba(255,255,255,0.7)",		// Control color : set control button's color.
		"showPlayButton" : true,							// Play button : toggle video playback.
		"showFullscreenButton" : true,					// Fullscreen button : toggle fullscreen mode.
		"showScrubBar" : true,								// Scrub bar : show video progress and modify playhead position.
		"showPlaybackTime" : true,							// Playback time : a text representation of the playhead position.
		"showVolumeButton" : true,							// Volume button : change video playback volume.
		"showSourceButton" : false,						// Source button : switch between provided source qualities.
		"showSubtitleButton" : false						// Subtitle button : switch between provided subtitle tracks.
	}, options);
	
	target.classList.add("av", "container");
	target.innerHTML = '<div class="av controller"><div class="av controller-offset"></div><div class="av scrubber"><div class="av playback"><div class="av playhead"></div></div></div><div class="av controller-bar"><div class="av controller-left"></div><div class="av controller-right"></div></div></div><video class="av player"></video>';
	
	player = target.querySelector("video.av.player");
	controls = target.querySelector(".av.controller");
	controlBar = target.querySelector(".av.controller-bar");
	controlsLeft = controlBar.querySelector(".av.controller-left");
	controlsRight = controlBar.querySelector(".av.controller-right");
	controlOffset = target.querySelector(".av.controller-offset");
	playhead = target.querySelector(".av.playhead");
	playback = target.querySelector(".av.playback");
	
	player.autoplay = options.autoplay;
	
	target.style.width = options.width;
	target.style.height = options.height;
	
	controlBar.style.color = options.controlColor;
	if (options.barBlur) controlBar.style.setProperty("backdrop-filter", "blur(2px)");
	
	playhead.style.backgroundColor = options.playheadColor;
	
	// Set initial control bar fade timer.
	controlsTimer = setTimeout(function(){
		controls.classList.add("hide");
	}, options.controlFadeTime);
	
	// Show the control bar when the mouse moves on over the video element and resets the fade timer.
	target.addEventListener("mousemove", function(){
		
		controls.classList.remove("hide");
		
		clearTimeout(controlsTimer);
		
		controlsTimer = setTimeout(function(){
			controls.classList.add("hide");
		}, options.controlFadeTime);
		
	});
	
	target.addEventListener("mouseleave", function(){
		
		clearTimeout(controlsTimer);
		
		controls.classList.add("hide");
		
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
	
	if (options.showFullscreenButton){
		
		controlsRight.innerHTML += '<button class="av av-controller-button fullscreen">' + putSVG("expand") + '</button><button class="av av-controller-button close-fullscreen" style="display:none">' + putSVG("compress") + '</button>';
		
	}
	
	if (options.showPlaybackTime){
		
		controlsLeft.innerHTML += '<div class="av playback-time av-text">0:00 / 0:00</div>';
		
	}
	
	if (options.showPlayButton){
		
		playButton = target.querySelector("button.av.av-controller-button.play");
		pauseButton = target.querySelector("button.av.av-controller-button.pause");
		
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
	
	if (options.showFullscreenButton){
		
		fullscreenButton = target.querySelector("button.av.av-controller-button.fullscreen");
		closeFullscreenButton = target.querySelector("button.av.av-controller-button.close-fullscreen");
		
		fullscreenButton.addEventListener("click", function(){
			fullscreenButton.style.display = "none";
			closeFullscreenButton.style.display = "inline-block";
		});
		
		closeFullscreenButton.addEventListener("click", function(){
			closeFullscreenButton.style.display = "none";
			fullscreenButton.style.display = "inline-block";
		});
		
	}
	
	controlBar.querySelectorAll("button.av.av-controller-button").forEach(function(controlButton){
		controlButton.style.color = options.controlColor;
	});
	
	player.addEventListener("timeupdate", function(){
		
		if (options.showPlaybackTime){
			
			playbackTime = controlsLeft.querySelector(".av.playback-time");
			
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
	
	if (typeof source == "string"){
	
		target.querySelector("video.av.player").src = source;
	
	}else{
		
		// An array of sources.
		
	}
	
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

function putSVG( type ){
	
	dictionary = {
		expand : 'M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z',
		compress : 'M436 192H312c-13.3 0-24-10.7-24-24V44c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v84h84c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm-276-24V44c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v84H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24zm0 300V344c0-13.3-10.7-24-24-24H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-84h84c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12H312c-13.3 0-24 10.7-24 24v124c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12z',
		play : 'M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z',
		pause : 'M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z'
	};
	
	return '<svg aria-hidden="true" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="' + dictionary[type] + '"></path></svg>';
	
}
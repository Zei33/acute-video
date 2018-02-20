document.addEventListener("DOMContentLoaded", function(){
	
	
	
});

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
	
	var container = document.querySelector(target);
	container.classList.add("av", "container");
	container.innerHTML = '<div class="av controller"><div class="av controller-offset"></div><div class="av scrubber"><div class="av playback"><div class="av playhead"></div></div></div><div class="av controller-bar"><div class="av controller-left"></div><div class="av controller-right"></div></div></div><video class="av player"></video>';
	
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
	
	if (Array.isArray(source)){
		
	}else{
		
		player.innerHTML += '<track kind="' + source.kind + '" src="' + source.source + '" srclang="' + source.language + '" default>';
		console.log(player.textTracks[0]);
		player.textTracks[0].mode = "showing";
		
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
		pause : 'M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z',
		volumehigh : 'M256 88.017v335.964c0 21.438-25.943 31.998-40.971 16.971L126.059 352H24c-13.255 0-24-10.745-24-24V184c0-13.255 10.745-24 24-24h102.059l88.971-88.954c15.01-15.01 40.97-4.49 40.97 16.971zm182.056-77.876C422.982.92 403.283 5.668 394.061 20.745c-9.221 15.077-4.473 34.774 10.604 43.995C468.967 104.063 512 174.983 512 256c0 73.431-36.077 142.292-96.507 184.206-14.522 10.072-18.129 30.01-8.057 44.532 10.076 14.528 30.016 18.126 44.531 8.057C529.633 438.927 576 350.406 576 256c0-103.244-54.579-194.877-137.944-245.859zM480 256c0-68.547-36.15-129.777-91.957-163.901-15.076-9.22-34.774-4.471-43.994 10.607-9.22 15.078-4.471 34.774 10.607 43.994C393.067 170.188 416 211.048 416 256c0 41.964-20.62 81.319-55.158 105.276-14.521 10.073-18.128 30.01-8.056 44.532 6.216 8.96 16.185 13.765 26.322 13.765a31.862 31.862 0 0 0 18.21-5.709C449.091 377.953 480 318.938 480 256zm-96 0c0-33.717-17.186-64.35-45.972-81.944-15.079-9.214-34.775-4.463-43.992 10.616s-4.464 34.775 10.615 43.992C314.263 234.538 320 244.757 320 256a32.056 32.056 0 0 1-13.802 26.332c-14.524 10.069-18.136 30.006-8.067 44.53 10.07 14.525 30.008 18.136 44.53 8.067C368.546 316.983 384 287.478 384 256z',
		volumelow : 'M256 88.017v335.964c0 21.438-25.943 31.998-40.971 16.971L126.059 352H24c-13.255 0-24-10.745-24-24V184c0-13.255 10.745-24 24-24h102.059l88.971-88.954c15.01-15.01 40.97-4.49 40.97 16.971zM384 256c0-33.717-17.186-64.35-45.972-81.944-15.079-9.214-34.775-4.463-43.992 10.616s-4.464 34.775 10.615 43.992C314.263 234.538 320 244.757 320 256a32.056 32.056 0 0 1-13.802 26.332c-14.524 10.069-18.136 30.006-8.067 44.53 10.07 14.525 30.008 18.136 44.53 8.067C368.546 316.983 384 287.478 384 256z',
		volumeoff : 'M256 88.017v335.964c0 21.438-25.943 31.998-40.971 16.971L126.059 352H24c-13.255 0-24-10.745-24-24V184c0-13.255 10.745-24 24-24h102.059l88.971-88.954c15.01-15.01 40.97-4.49 40.97 16.971z',
		volumemute : 'M219.845 98.213l27.184-27.167C262.04 56.036 288 66.556 288 88.017v62.623l-68.155-52.427zm195.889 150.684c-2.233-30.88-18.956-58.492-45.706-74.842-13.987-8.547-31.941-5.071-41.824 7.51l87.53 67.332zM436.665 64.74C500.967 104.063 544 174.983 544 256a223.67 223.67 0 0 1-14.854 80.137l52.417 40.321C598.735 339.19 608 298.184 608 256c0-103.244-54.579-194.877-137.944-245.859-15.074-9.221-34.773-4.473-43.995 10.604-9.221 15.077-4.473 34.774 10.604 43.995zm-50.009 81.961C425.067 170.188 448 211.048 448 256c0 5.676-.39 11.301-1.128 16.849l55.604 42.772A191.69 191.69 0 0 0 512 256c0-68.547-36.15-129.777-91.957-163.901-15.076-9.22-34.774-4.471-43.994 10.607-9.22 15.078-4.471 34.775 10.607 43.995zM90.232 160H56c-13.255 0-24 10.745-24 24v144c0 13.255 10.745 24 24 24h102.059l88.97 88.951c15.028 15.028 40.971 4.467 40.971-16.97V312.129L90.232 160zm360.889 277.607c-1.205.871-2.403 1.75-3.627 2.599-14.522 10.072-18.129 30.01-8.057 44.532 10.076 14.528 30.016 18.125 44.531 8.057a289.026 289.026 0 0 0 19.578-14.861l-52.425-40.327zm-71.629-55.099c-1.263 7.875.389 16.229 5.294 23.3 6.216 8.96 16.185 13.765 26.322 13.765 4.387 0 8.8-.923 12.959-2.776l-44.575-34.289zm255.53 107.442c8.071-10.493 6.123-25.54-4.356-33.63L48.389 4.978c-10.506-8.082-25.574-6.116-33.656 4.39L4.978 22.05c-8.082 10.506-6.116 25.574 4.39 33.656l582.208 451.29c10.505 8.111 25.598 6.156 33.69-4.364l9.756-12.682z'
	};
	
	viewBox = {
		expand : '0 0 448 512',
		compress : '0 0 448 512',
		play : '0 0 448 512',
		pause : '0 0 448 512',
		volumehigh : '0 0 576 512',
		volumelow : '0 0 384 512',
		volumeoff : '0 0 256 512',
		volumemute : '10 0 640 512'
	}
	
	return '<svg aria-hidden="true" role="img" viewBox="' + viewBox[type] + '"><path fill="currentColor" d="' + dictionary[type] + '"></path></svg>';
	
}
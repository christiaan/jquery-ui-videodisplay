# jQuery UI videodisplay
jQuery-ui-videodisplay aims to have a small flexible API but still powerfull enough to build a full blown videoplayer.
Control the different video technologies (flash, silverlight and HTML5) all with the exact same API.
Completely clean of any “player” UI components giving you control over how the UI should look like.
Mix with other jQuery UI components like slider and button to create a video player completely to your liking.
Leverage native browser mouse events like you would on any DOM node with use of the clickcatcher div that is on top of the display.

# API

## scale(type)
Set the scaling and returns self allowing chaining.
If not given any arguments it returns the current scale.
Works for Flash and Silverlight, html can only use ‘showAll’.
One of the following options:
'exactFit'
Makes the entire Display content visible in the specified area without trying to preserve the original aspect ratio. Distortion can occur.
'noBorder'
Scales the Display content to fill the specified area, without distortion but possibly with some cropping, while maintaining the original aspect ratio of the application.
'noScale'
makes the size of the Display content fixed, so that it remains unchanged even as the size of the player window changes. Cropping may occur if the player window is smaller than the Display content.
'showAll'
Makes the entire Flash content visible in the specified area without distortion while maintaining the original aspect ratio of the. Borders can appear on two sides of the application.

## buffer(time)
Sets the amount of time in seconds the display should buffer and return self alowing chaining.
If time is omitted this method returns the current amount of seconds that will be buffered.

## time(sec)
Seeks to the given time in the video. When not given an argument returns the elapsed time.

## volume(vol)
Sets the volume which should be a value between 0 and 1. Returns the current volume when no argument is given.

## src(url)
Tells the display to open the given url. When not given an argument it returns the current set url.

## play()
Start playing the video file. Only works when there is a src set of course!

## pause()
Pauses playing the video file. If you want to “stop” the video call pause().time(0).

## toggle()
Toggles between play and pause.

## fullscreen(toggle)
Make the display go fullscreen or exit fullscreen depending on the value of toggle.
When toggle is true it enters fullscreen, for false it exits fullscreen.
When ommiting toggle it returns the current fullscreen state.

# Options
All callback functions receive two parameters, first the event object and secondly the display object.

## ready
Callback function which is called when the display is ready to receive commands.
To automatically start playing you can call ui.src(“movie.mp4”).play();

## error
Callback function which is called when an error occurs in the display for example when trying to open a video which isn’t supported by the display.

## play
Callback function that is issued when the display starts playing.

## pause
Callback function when the display gets paused.

## ended
Callback function when the display stops playing because the end of the video is reached.

## durationchange
Callback function that is issued when the duration for the video is changed.
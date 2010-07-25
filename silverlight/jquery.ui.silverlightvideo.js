(function($, sl){
	$.widget("ui.silverlightvideo", {
		options: {
			xaml : "silverlight/jquery.ui.silverlightvideo.xaml"
		},
		_create : function() {
			var o = this.options,
			el = this.element,
			clickCatcher = $('<div>', {"class" : "ui-videodisplay-clickcatcher"});

			this._playing = false;
			this._old_contents = el.contents();
			el.empty();

			sl.createObjectEx({
				source : o.xaml,
				parentElement : el[0],
				properties : {
					width : el.width(),
					height : el.height(),
					version :'1.0',
					inplaceInstallPrompt : true,
					windowless : "true",
					background : "transparent"
				},
				events:{
					onLoad: function(_, ui, canvas) {
						ui.canvas = canvas;
						ui.video = canvas.findName("Video");
						ui.video.AutoPlay = true;
						ui.video.AddEventListener("CurrentStateChanged", ui._getCallback("state"));
						ui.video.AddEventListener("MediaEnded", ui._getCallback("ended"));
						ui.video.AddEventListener("BufferingProgressChanged", ui._getCallback("buffer"));
						ui.video.AddEventListener("DownloadProgressChanged", ui._getCallback("download"));
						ui._trigger("ready", null, ui);
					},
					onError: this._getCallback("error")
				},
				context : this
			});

			el.find("object, embed").addClass("ui-videodisplay-object");
			el.append(clickCatcher);
		},
		destroy : function() {
			$(this.canvas).remove();
			this.element.contents(this._old_contents);
		},
		_getCallback : function(event) {
			var callback = $.proxy(this, "_callback");
			return function() {
				setTimeout(function() {
					callback(event);
				}, 0);
			};
		},
		_callback : function(event) {
			switch (event) {
				case "error":
					this._trigger("error", null, this);
					break;
				case "state":
					switch (this.video.CurrentState) {
						case "Opening" :
						case "Buffering" :
						case "Playing" :
						case "Paused" :
						case "Stopped" :
						case "Closed" :
							this._setDuration(this._timeSpanToSec(this.video.NaturalDuration));
							break;
					}
					break;
				case "ended":
					this._playing = false;
					this._trigger("ended", null, this);
					break;
			}
		},
		_setDuration : function(duration) {
			var old = this.duration;
			this.duration = duration;
			if (old !== this.duration) {
				this._trigger("durationchange", null, this);
			}
		},
		_scaleTrans : {
			'exactFit' : 'Fill',
			'noBorder' : 'UniformToFill',
			'noScale' : 'None',
			'showAll' : 'Uniform'
		},
		scale : function(scale) {
			if (arguments.length === 0) {
				return this._scaleTrans[this.video.Stretch];
			}
			this.video.Stretch = this._scaleTrans[scale];
			return this;
		},
		_secToTimeSpan : function(sec) {
			return [
				Math.floor(sec / 3600), // Hours
				Math.floor(sec % 3600 / 60), // Minutes
				Math.round(sec % 60 * 10) / 10 // Seconds
			].join(":");
		},
		_timeSpanToSec : function(span) {
			// Silverlight 3 compatibility
			if (span.TotalSeconds) {
				return span.TotalSeconds;
			}
			return span.Seconds;
		},
		buffer : function(time) {
			if (arguments.length === 0) {
				return this._timeSpanToSec(this.video.BufferingTime);
			}
			this.video.BufferingTime = this._secToTimeSpan(time);
			return this;
		},
		time : function(time) {
			if (arguments.length === 0) {
				return this._timeSpanToSec(this.video.Position);
			}
			this.video.Position = this._secToTimeSpan(time);
			return this;
		},
		volume : function(vol) {
			if (arguments.length === 0) {
				return this.video.Volume;
			}
			this.video.Volume = vol;
			return this;
		},
		src : function(source) {
			if (arguments.length === 0) {
				return this.video.Source;
			}
			this.video.Source = source;
			return this;
		},
		play : function() {
			this.video.Play();
			this.video.AutoPlay = true;
			this._playing = true;
			this._trigger("play", null, this);
			return this;
		},
		pause : function() {
			this.video.Pause();
			this.video.AutoPlay = false;
			this._playing = false;
			this._trigger("pause", null, this);
			return this;
		},
		toggle : function() {
			return this._playing ? this.pause() : this.play();
		},
		fullscreen : function(toggle) {
			if (arguments.length === 0) {
				return !!this.canvas.getHost().content.FullScreen;
			}
			this.canvas.getHost().content.FullScreen = toggle;
			return this;
		}
	});

})(jQuery, Silverlight);

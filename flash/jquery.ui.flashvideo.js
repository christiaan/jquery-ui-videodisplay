(function($, swfobject) {
	var id = 1;

	$.widget("ui.flashvideo", {
		options : {
			swf : "flash/JqueryUiFlashvideo.swf"
		},
		_create : function() {
			var o = this.options,
			el = this.element,
			clickCatcher = $('<div>', {"class" : "ui-videodisplay-clickcatcher"});

			this._videoid = "ui_flash_video_" + id;
			this._playing = false;
			this._callback = "flashvideocb_" + id;
			this._old_contents = el.contents();
			el.empty();
			id += 1;

			el.append($('<div>', {id : this._videoid}));
			el.append(clickCatcher);

			// register the callback in the global scope so flash can reach it
			window[this._callback] = this._getFlashCallback();

			swfobject.embedSWF(
				o.swf,
				this._videoid,
				el.width(),
				el.height(),
				"9.0.0",
				null,
				{// Flash vars
					callback : this._callback
				},
				{// params
					allowScriptAcces : "always",
					allowFullScreen : "true",
					wmode : "transparent"
				},
				{"class" : "ui-videodisplay-object"}
			);
		},
		destroy : function() {
			$(this.video).remove();
			this.element.contents(this._old_contents);
			if (this._callback && window[this._callback]) {
				try {
					delete window[this._callback];
				} catch (e) {}
			}

			this._trigger("destroy", null, this);
		},
		/*
		_setOption : function(option, value) {
			$.Widget.prototype._setOption.apply(this, arguments);
		},
		 //*/
		_getFlashCallback : function() {
			var callback = $.proxy(this, "_flashCallback");
			return function(event) {
				setTimeout(function() {
					callback(event);
				}, 0);
			};
		},
		_flashCallback : function(event) {
			switch (event) {
				case "ready":
					this.video = document.getElementById(this._videoid);
					this._trigger("ready", null, this);
					break;

				case "ended":
					this._playing = false;
					this._trigger("ended", null, this);
					break;

				case "loadedmetadata":
					this.duration = this.video.duration();
					this._trigger("durationchange", null, this);
					break;
				
				case "error":
					this._trigger("error", null, this);
					break;
			}
		},
		_srcRelativeToSwf : function(source) {
			if (0 === source.indexOf("/") || source.match(/^\w*:\/\//)) {
				return source;
			}
			var slashes = [];
			slashes.length = this.options.swf.split("/").length;
			return slashes.join("../") + source;
		},
		scale : function(scale) {
			if (arguments.length === 0) {
				return this.video.scale();
			}
			this.video.scale(scale);
			return this;
		},
		buffer : function(time) {
			if (arguments.length === 0) {
				return this.video.buffer();
			}
			this.video.buffer(time);
			return this;
		},
		time : function(time) {
			if (arguments.length === 0) {
				return this.video.time();
			}
			this.video.time(time);
			return this;
		},
		volume : function(vol) {
			if (arguments.length === 0) {
				return this.video.volume();
			}
			this.video.volume(vol);
			return this;
		},
		src : function(source) {
			if (arguments.length === 0) {
				return this._src;
				//return this.video.src();
			}
			source = this._srcRelativeToSwf(source);
			this._src = source;
			this.video.src(source);
			return this;
		},
		play : function() {
			this.video.play();
			this._playing = true;
			this._trigger("play", null, this);
			return this;
		},
		pause : function() {
			this.video.pause();
			this._playing = false;
			this._trigger("pause", null, this);
			return this;
		},
		toggle : function() {
			return this._playing ? this.pause() : this.play();
		},
		fullscreen : function(toggle) {
			if (arguments.length === 0) {
				return this.video.fullscreen();
			}
			this.video.fullscreen(toggle);
			return this;
		}
	});

})(jQuery, swfobject);

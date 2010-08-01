(function($){
	$.widget("ui.htmlvideo", {
		options: {
			
		},
		_create : function() {
			var self = this,
			o = this.options,
			el = this.element,
			clickCatcher = $('<div>', {"class" : "ui-videodisplay-clickcatcher"});

			this._playing = false;
			this._old_contents = el.contents();
			el.empty();
			this.$video = $('<video></video>', {"class": "ui-videodisplay-object", height: el.height(), width: el.width()});
			this.video = this.$video[0];

			if(typeof this.video.canPlayType === 'undefined') {
				throw new Error("Browser doesn't support html video tag");
			}

			this.$video.bind("ended", function() {
				self._playing = false;
				self._trigger("ended", null, self);
			}).bind("loadedmetadata", function() {
				self.duration = this.duration;
				self._trigger("durationchange", null, self);
			});
			el.append(this.video);
			el.append(clickCatcher);


			this._trigger("ready", null, this);
		},
		destroy : function() {
			$(this.video).remove();
			this.element.contents(this._old_contents);
		},
		scale : function(scale) {

		},
		buffer : function(time) {

		},
		time : function(time) {
			if (arguments.length === 0) {
				return this.video.currentTime;
			}
			this.video.currentTime = time;
			return this;
		},
		volume : function(vol) {
			if (arguments.length === 0) {
				return this.video.volume;
			}
			this.video.volume = vol;
			return this;
		},
		src : function(source) {
			if (arguments.length === 0) {
				return this.$video.attr("src");
			}
			this.$video.attr("src", source);
			return this;
		},
		fullscreen : function(toggle) {

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
		}
	});
})(jQuery);
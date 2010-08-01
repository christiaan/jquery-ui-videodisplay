package
{
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.display.StageDisplayState;
	import flash.display.StageScaleMode;
	import flash.display.StageAlign;
	import flash.events.*;
	import flash.external.ExternalInterface;
	import flash.media.Sound;
	import flash.media.SoundTransform;
	import flash.media.Video;
	import flash.net.NetConnection;
	import flash.net.NetStream;

	[SWF(width="800", height="600", backgroundColor="#000", frameRate="40")]
	public class JqueryUiFlashvideo extends Sprite
	{
		/**
		 * @var String the callback in the global scope that will be called
		 */
		private var callback:String;

		private var connection:NetConnection;
		private var stream:NetStream;
		private var video:Video;
		private var sound:SoundTransform;
		private var duration:Number = 0;
		private var source:String;

		public function JqueryUiFlashvideo() {
			callback = root.loaderInfo.parameters.callback;
			scale(StageScaleMode.NO_SCALE);

			connection = new NetConnection();
			connection.addEventListener(SecurityErrorEvent.SECURITY_ERROR,
				securityErrorHandler);
			connection.connect(null);

			stream = new NetStream(connection);
			stream.checkPolicyFile = true;
			stream.client = {onMetaData : metaDataHandler};
			stream.addEventListener(NetStatusEvent.NET_STATUS,
				netStatusHandler);
			stream.addEventListener(AsyncErrorEvent.ASYNC_ERROR,
				errorHandler);
			stream.addEventListener(IOErrorEvent.IO_ERROR,
				errorHandler);

			sound = new SoundTransform(1, 0);
			stream.soundTransform = sound;

			video = new Video();
			video.width = stage.stageWidth;
			video.height = stage.stageHeight;
			video.attachNetStream(stream);
			addChild(video);

			if (ExternalInterface.available) {
				ExternalInterface.marshallExceptions = true;

				ExternalInterface.addCallback("scale", scale);
				ExternalInterface.addCallback("buffer", buffer);
				ExternalInterface.addCallback("time", time);
				ExternalInterface.addCallback("duration", getDuration);
				ExternalInterface.addCallback("src", src);
				ExternalInterface.addCallback("volume", volume);
				ExternalInterface.addCallback("playVideo", play);
				ExternalInterface.addCallback("pause", pause);
				ExternalInterface.addCallback("fullscreen", fullscreen);

				_trigger("ready");
			} else {
				trace("ExternalInterface not available");
			}
		}

		public function scale(mode:String = ""):String {
			if (arguments.length === 1) {
				stage.scaleMode = arguments[0];
				stage.align = StageAlign.TOP_LEFT;
			}
			return stage.scaleMode;
		}

		public function buffer(time:Number = 0):Number {
			if (arguments.length === 1) {
				stream.bufferTime = time;
			}
			return stream.bufferTime;
		}

		public function time(time:Number = 0):Number {
			if (arguments.length === 1) {
				stream.seek(time);
			}
			return stream.time;
		}

		public function getDuration():Number {
			return duration;
		}

		public function volume(vol:Number = 0):Number {
			if (arguments.length === 1) {
				sound.volume = vol;
				stream.soundTransform = sound;
			}
			return sound.volume;
		}

		public function src(src:String = ""):String {
			if (arguments.length === 1) {
				source = src;
				stream.play(source);
				stream.pause();
			}
			return source;
		}

		public function play():void {
			stream.resume();
		}

		public function pause():void {
			stream.pause();
		}

		public function fullscreen(toggle:Boolean = false):Boolean {
			if (arguments.length === 1) {
				stage.displayState = toggle ?
					StageDisplayState.FULL_SCREEN : StageDisplayState.NORMAL;
			}
			return stage.displayState === StageDisplayState.FULL_SCREEN;
		}

		private function _trigger(event:String):void {
			ExternalInterface.call(callback, event);
		}

		private function metaDataHandler(data:Object):void {
			var width:Number  = data.width  > 0 ? data.width  : video.videoWidth,
			height:Number = data.height > 0 ? data.height : video.videoHeight;

			duration = data.duration;

			video.width = width;
			video.height = height;

			_trigger("loadedmetadata");
		}

		private function netStatusHandler(event:NetStatusEvent):void {
			switch (event.info.code) {
				case "NetStream.Play.Stop":
				_trigger("ended");
  				break;
				case "NetStream.Play.StreamNotFound":
					trace("Unable to locate video");
				case "NetStream.Play.Failed":
					_trigger("error");
					break;
			}
		}

		private function securityErrorHandler(event:SecurityErrorEvent):void {
			trace("securityErrorHandler: " + event);
		}

		private function errorHandler(event:ErrorEvent):void {
			trace("errorHandler: " + event);
		}
	}
}
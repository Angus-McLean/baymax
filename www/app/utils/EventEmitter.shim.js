(function (context) {

	var indexOf;

	if (typeof Array.prototype.indexOf === 'function') {
		indexOf = function (haystack, needle) {
			return haystack.indexOf(needle);
		};
	} else {
		indexOf = function (haystack, needle) {
			var i = 0, length = haystack.length, idx = -1, found = false;

			while (i < length && !found) {
				if (haystack[i] === needle) {
					idx = i;
					found = true;
				}

				i++;
			}

			return idx;
		};
	};


	/* Polyfill EventEmitter. */
	class EventEmitter {
		constructor () {
			EventEmitter.events.set(this, {});
		}
	}
	context.EventEmitter = EventEmitter;

	EventEmitter.events = new WeakMap();

	EventEmitter.prototype.on = function (event, listener) {
		if (typeof EventEmitter.events.get(this)[event] !== 'object') {
			EventEmitter.events.get(this)[event] = [];
		}

		EventEmitter.events.get(this)[event].push(listener);
	};

	EventEmitter.prototype.removeListener = function (event, listener) {
		var idx;

		if (typeof EventEmitter.events.get(this)[event] === 'object') {
			idx = indexOf(EventEmitter.events.get(this)[event], listener);

			if (idx > -1) {
				EventEmitter.events.get(this)[event].splice(idx, 1);
			}
		}
	};

	EventEmitter.prototype.emit = function (event) {
		var i, listeners, length, args = [].slice.call(arguments, 1);

		if (typeof EventEmitter.events.get(this)[event] === 'object') {
			listeners = EventEmitter.events.get(this)[event].slice();
			length = listeners.length;

			for (i = 0; i < length; i++) {
				listeners[i].apply(this, args);
			}
		}
	};

	EventEmitter.prototype.once = function (event, listener) {
		this.on(event, function g () {
			this.removeListener(event, g);
			listener.apply(this, arguments);
		});
	};


	angular.module('utils')
	.constant('EventEmitter', EventEmitter);

})(this);

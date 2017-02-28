(function () {

	angular.module('bots.TimeTracker')
		.factory('TimeTrackerActions', TimeTrackerFactory);

	TimeTrackerFactory.$inject = ['Baymax', 'TimeTrackerObject', 'SearchService'];

	function TimeTrackerFactory (Baymax, TimeTrackerObject, SearchService) {

		/*
		action : TimeTracker.create
		params : duration, text, time-period
		 */
		function create(baymaxReqObj) {
			var params = processTimingParams(baymaxReqObj.result.parameters, {
				endTime : Date.now()
			});
			return createRecord(params);
		}

		function start(baymaxReqObj) {
			var params = processTimingParams(baymaxReqObj.result.parameters, {
				startTime : Date.now()
			});
			return createRecord(params);
		}

		function createRecord(params) {
			var homeworkObjectProm = TimeTrackerObject.create(params);
			return homeworkObjectProm.then(function (firebaseObject) {

				var homeworkObject = TimeTrackerObject.db.records.$getRecord(firebaseObject.$id);
				Baymax.context.setGlobalContext(homeworkObject);

				return homeworkObject;
			});
		}

		function stop(params) {
			var runningTimers = getActiveTimers();
			if(!params.text) {
				var proms = runningTimers.map(function (rec) {
					return rec.$class().stop();
				});
				return Promise.all(proms);
			} else {
				var results = SearchService.defaultSearch(runningTimers, params.text, {
					keys : [
						'doc.text'
					]
				});

				if(results && results.length){
					return Promise.resolve(results[0].$class().stop());
				} else {
					 return Promise.reject('No running timers found with that search term');
				}
			}
		}

		function createNewEntry() {

		}

		function processTimingParams(params, defaults) {

			var results = {};
			angular.extend(results, params, defaults);

			delete results['time-period'];
			delete results['duration'];
			delete results['time'];

			if(params['time-period']) {
				// var [startTime, endTime] = params['time-period'].split('/');
				// var [startTimeSplit, endTimeSplit] = [startTime.split(':'), endTime.split(':')];
				// var startDate = setHMS(new Date(), startTimeSplit);
				// var endDate = setHMS(new Date(), endTimeSplit);
				var dateInterval = params['time-period'].split('/')
					.map(a=>a.split(':'))
					.map(b=>setHMS(new Date(), b));

				results.startTime = dateInterval[0].getTime();
				results.endTime = dateInterval[1].getTime();

			} else if(params.duration) {
				// sometimes this gives back just a string ie "the last hour"
				if(params.duration.amount || params.duration.unit) {
					var startDate = new Date();
					if(params.duration.unit === 'h') {
						startDate.setHours(startDate.getHours() - params.duration.amount);
					} else if(params.duration.unit === 'min') {
						startDate.setMinutes(startDate.getMinutes() - params.duration.amount);
					} else if(params.duration.unit === 's') {
						startDate.setSeconds(startDate.getSeconds() - params.duration.amount);
					} else {
						// defaults to right now
					}

					results.startTime = startDate.getTime();
				}
			} else if (params.time) {
				var startTimeSplit = params.time.split(':');
				var startDate = setHMS(new Date(), startTimeSplit);
				results.startTime = startDate.getTime();
			}

			return results;

			function setHMS(date, HMS_array) {
				date.setHours(HMS_array[0]);
				date.setMinutes(HMS_array[1]);
				date.setSeconds(HMS_array[2]);
				return date;
			}
		}

		function getActiveTimers() {
			return TimeTrackerObject.db.records.filter(a=>!a.doc.endTime);
		}

		function readActiveTimers() {
			var activeEntries = getActiveTimers();
			if(activeEntries.length) {
				speechSynthesis.speak(new SpeechSynthesisUtterance(`You have a total of ${activeEntries.length} active timers`));
				activeEntries.forEach(function (a) {
					speechSynthesis.speak(new SpeechSynthesisUtterance(a.$class().toText()))
				});
			} else {
				speechSynthesis.speak(new SpeechSynthesisUtterance(`You have no active timers`));
			}

		}

		return {
			create : create,
			start : start,
			stop : stop,
			readActiveTimers : readActiveTimers
		};
	}
})();

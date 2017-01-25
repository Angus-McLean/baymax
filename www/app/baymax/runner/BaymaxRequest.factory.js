(function () {

	angular.module('app.baymax')
		.factory('BaymaxRequest', BaymaxRequestFactory);

	BaymaxRequestFactory.$inject = [];

	function BaymaxRequestFactory() {

		const _map = new WeakMap();

		const defaultData = {
			stages : {},
			modules : {}
		};

		class BaymaxRequest extends EventEmitter {
			constructor(...args) {
				super(...args);
				_map.set(this, defaultData);
				_.extend(this, ...args);
			}

			getModuleData(moduleName) {
				if(!_map.get(this).modules[moduleName]) {
					_map.get(this).modules[moduleName] = {};
				}
				return _map.get(this).modules[moduleName];
			}

			setModuleData(moduleName, v) {
				_map.get(this).modules[moduleName] = v;
			}

			getStageData(stageName) {
				if(!_map.get(this).stages[stageName]) {
					_map.get(this).stages[stageName] = {};
				}
				return _map.get(this).stages[stageName];
			}

			setStageData(stageName, v) {
				_map.get(this).stages[stageName] = v;
			}
		}
		return BaymaxRequest;
	}
})();

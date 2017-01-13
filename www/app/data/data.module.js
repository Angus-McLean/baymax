(function (context) {
  var config = {
    apiKey: "AIzaSyCL-mBcaSr-uk2wdcj3cSC9uIZ1bwPvsKY",
    authDomain: "baymax-d1cba.firebaseapp.com",
    databaseURL: "https://baymax-d1cba.firebaseio.com",
    storageBucket: "baymax-d1cba.appspot.com",
    messagingSenderId: "613222814762"
  };

  firebase.initializeApp(config);

  angular.module('app.data', ['firebase'])
	.factory('FirebaseFactory', FirebaseFactory)

	FirebaseFactory.$inject = ['$firebaseArray'];

	function FirebaseFactory($firebaseArray) {

		class ModuleDataStore {
			constructor(moduleName) {
				this.ref = firebase.database().ref().child("modules").child(moduleName);
				this.docs = $firebaseArray(this.ref);
			}

			static formatToJson (item, config) {
				return JSON.stringify(item, null, "\t");
			}

			add (doc) {
				return this.docs.$add(doc).then((a)=>this.getByKey(a.key))
			}

			getByKey (key) {
				return this.docs.$getRecord(key);
			}

			remove (doc) {
				return this.docs.$remove(doc);
			}

			update (doc) {
				return this.docs.$save(doc);
			}
		}

		function bootstrapModule(moduleName) {
			return new ModuleDataStore(moduleName)
		}


		return {
			bootstrapModule : bootstrapModule
		}
	}


})(window)

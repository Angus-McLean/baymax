(function (context) {

  angular.module('app.data')
	.factory('FirebaseDocument', FirebaseFactory)

	FirebaseFactory.$inject = ['ModuleDataStore'];

	function FirebaseFactory(ModuleDataStore) {

		var ephimStore = new WeakMap();

		class FirebaseDocument extends EventEmitter {
			constructor(firebaseObject) {
				super();
				this.val = firebaseObject;
				// this.val.doc.type = this.val.doc.type || this.constructor.name;

				FirebaseDocument.setEphim(firebaseObject);
				firebaseObject.$ephim().classObject = this;

			}

			save() {
				this.val.doc.date_created = Date.now();
				this.val.doc.last_modified = this.val.date_created;
				return ModuleDataStore.getDataStore(this.val.doc.type).db.add(this.val)
					.then(a=>this.ephimeral().firebaseObject = a);
			}

			update() {
				var self = this;
				this.val.doc.last_modified = Date.now();
				return ModuleDataStore.getDataStore(this.val.doc.type).db.update(this.val)
					.then(function (...args) {
						console.log(args);
					})
					.catch((a)=> console.error(a));
			}

			ephim() {
				return this.ephimeral();
			}

			ephimeral() {
				return ephimStore.get(this.val);
			}

			destroy() {
				return ModuleDataStore.getDataStore(this.val.doc.type).db.remove(this.val);
			}

			toJson(properties, replacer, spaces = 4) {
				properties = properties || this.editableFields;
				return JSON.stringify(_.pick(this.val.doc, properties), null, spaces);
			}

			updateFromJson (jsonText) {
				this.parseFromJson(jsonText);
				this.update();
			}

			parseFromJson (jsonText) {
				let parsedObj = null;
				try {
					parsedObj = JSON.parse(jsonText);
					_.assign(this.val.doc, parsedObj);
				} catch (e) {
					console.error(e);
					try {
						parsedObj = angular.fromJson(jsonText);
						_.assign(this.val.doc, parsedObj);

					} catch (e2) {
						console.error(e2);
						this.toJson();
					}
				}
			}
		}

		FirebaseDocument.setEphim = function (firebaseObject) {
			ephimStore.set(firebaseObject, {});
			Object.defineProperty(firebaseObject, "$ephim", {
				enumerable: false,
				writable: true
			});
			firebaseObject.$ephim = function () {
				return ephimStore.get(firebaseObject);
			};
			Object.defineProperty(firebaseObject, "$class", {
				enumerable: false,
				writable: true
			});
			firebaseObject.$class = function () {
				return firebaseObject.$ephim().classObject;
			};
		};

		FirebaseDocument.attachClassInstance = function (firebaseObject) {
			FirebaseDocument.setEphim(firebaseObject);
			firebaseObject.$ephim().classObject = new FirebaseDocument(firebaseObject);
		}

		FirebaseDocument.create = function (objParams) {

			var defaults = {
				date_created : Date.now(),
				last_modified : Date.now()
			};
			_.defaults(objParams, defaults);

			return ModuleDataStore.getDataStore(objParams.type).db.add(objParams);
		};

		return FirebaseDocument;
	}


})(window)

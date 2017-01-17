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

		var baseRef = firebase.database().ref();
		var allDocsRef = baseRef.child('docs');
		var allDocs = $firebaseArray(allDocsRef);
		var allStores = {};

		allDocs.$watch(function (ev) {
			let doc = allDocs.$getRecord(ev.key);
			if(ev.event === 'child_changed') {
				_.filter(allStores, s=>_.find(s.db.ids, {$id:ev.key})).forEach(s=>s.db.emit('child_changed', doc));
			}
		})

		class ModuleDataStore extends EventEmitter {
			constructor(docName) {
				super();
				var self = this;
				this.name = docName;
				this.ref = firebase.database().ref().child("modules").child(docName);
				this.ids = $firebaseArray(this.ref);
				this.docs = [];
				// var baseRef = new firebase("https://baymax-d1cba.firebaseio.com");
				var joinedRef = new firebase.util.NormalizedCollection(
				  baseRef.child("modules/"+docName),
				  baseRef.child("docs")
				).select(
				  docName+".style",
				  {"key":"docs.$value","alias":"doc"}
				).ref();
				this.records = $firebaseArray(joinedRef);

				this.ids.$watch(function (ev) {

					let doc = allDocs.$getRecord(ev.key);
					if(ev.event === 'child_added') {
						self.docs.push(doc);
						self.emit('child_added', doc);
					} else if(ev.event === 'child_removed') {
						_.remove(self.docs, doc);
						self.emit('child_removed', doc);
					} else if(ev.event === 'child_changed') {
						self.emit('child_changed', doc);
					}
				})
			}

			add (doc) {
				var self = this;
				return allDocs.$add(doc)
					.then(function (docRef) {
						self.addKey(docRef.key);
						_.forEach(allStores[self.name].parents, (parent)=>allStores[parent].db.addKey(docRef.key));
						return docRef;
					})
					.then((a)=>this.getByKey(a.key));
			}

			addKey(key) {
				return this.ref.child(key).set(true);
			}

			// add (doc) {
			// 	_.forEach(allStores[this.name].parents, (parent)=>allStores[parent].add(doc));
			// 	return this.docs.$add(doc).then((a)=>this.getByKey(a.key));
			// }

			getByKey (key) {
				return allDocs.$getRecord(key);
			}

			remove (doc) {
				var self = this;
				return  allDocs.$remove(doc)
					.then(function (docRef) {
						self.removeKey(docRef.key);
						_.forEach(allStores[self.name].parents, (parent)=>allStores[parent].db.removeKey(docRef.key));
						_.forEach(allStores[self.name].children, (child)=>allStores[child].db.removeKey(docRef.key));
						return docRef;
					});
			}

			removeKey (key) {
				return this.ids.$remove(this.ids.$indexFor(key));
			}

			updateLocal (doc) {
				_.assign(_.find(this.docs, {$id:doc.$id}), doc);
			}

			update (doc) {
				return allDocs.$save(_.assign(this.getByKey(doc.$id), doc));
				// return allDocs.$save(doc);
			}
		}

		function getDataStore(docName) {
			if(!allStores[docName]) {
				allStores[docName] = {
					db : new ModuleDataStore(docName),
					parents : [],
					children : []
				};
			}
			return allStores[docName];
		}

		function bootstrapModule(docName, inheritedDocTypes, classMixin) {
			// var dataStore = new ModuleDataStore(docName);

			// add parents to this docType
			_.extend(getDataStore(docName), {
				parents : inheritedDocTypes || []
			});

			// iterate to add this docType as a child for parentModules
			_.forEach(inheritedDocTypes, (a) => getDataStore(a).children.push(docName));

			return getDataStore(docName).db;
		}

		var ephimStore = new WeakMap();

		class FirebaseDocument extends EventEmitter {
			constructor(docType, values) {
				super();

				var defaults = {
					type : docType
				};

				ephimStore.set(this, {});
				_.assign(this, defaults, values);
				if(this.$id) {
					this.ephimeral().firebaseObject = this
				}
			}

			save() {
				this.date_created = Date.now();
				this.last_modified = this.date_created;
				return allStores[this.type].db.add(this)
					.then(a=>this.ephimeral().firebaseObject = a);
			}

			update() {
				var self = this;
				this.last_modified = Date.now();
				this.ephimeral().firebaseObject = this;
				return allStores[this.type].db.update(this.fbDoc())
					.then(function (...args) {
						console.log(args);
					})
					.catch((a)=> console.error(a));
			}

			ephimeral() {
				return ephimStore.get(this);
			}

			fbDoc() {
				return this.ephimeral().firebaseObject;
			}

			destroy() {
				return allStores[this.type].db.remove(this.fbDoc());
			}
		}

		return {
			bootstrapModule : bootstrapModule,
			FirebaseDocument : FirebaseDocument
		}
	}


})(window)

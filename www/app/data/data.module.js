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
	.factory('ModuleDataStore', ModuleDataStoreFactory)

	ModuleDataStoreFactory.$inject = ['$firebaseArray'];

	function ModuleDataStoreFactory($firebaseArray) {

		var baseRef = firebase.database().ref();
		var allDocsRef = baseRef.child('docs');
		var allDocs = $firebaseArray(allDocsRef);
		var allStores = {};

		window.allDocs = allDocs;

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
			}

			initializeObjectsList (classMixin) {
				this.joinedQuery = new firebase.util.NormalizedCollection(
					baseRef.child("modules/"+this.name),
					baseRef.child("docs")
				).select(
					{"key":this.name+".$key","alias":"key"},
					{"key":"docs.$value","alias":"doc"}
				);

				this.joinedRef = this.joinedQuery.ref()

				this.records = $firebaseArray.$extend(classMixin || {})(this.joinedRef);

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

			getByKey (key) {
				return allDocs.$getRecord(key);
			}

			remove (doc) {
				var self = this;
				return  this.records.$remove(doc)
					.then(function (docRef) {
						// self.removeKey(docRef.key);
						_.forEach(allStores[self.name].parents, (parent)=>allStores[parent].db.removeKey(docRef.key));
						_.forEach(allStores[self.name].children, (child)=>allStores[child].db.removeKey(docRef.key));
						return docRef;
					})
					.catch(function (e) {
						console.error(e);
						_.forEach(allStores[self.name].parents, (parent)=>allStores[parent].db.removeKey(doc.key));
						_.forEach(allStores[self.name].children, (child)=>allStores[child].db.removeKey(doc.key));
					})
			}

			removeKey (key) {
				return this.ids.$remove(this.ids.$indexFor(key));
			}

			updateLocal (doc) {
				_.assign(_.find(this.docs, {$id:doc.$id}), doc);
			}

			update (joinedObj) {
				// return this.records.$save(doc);
				// return allDocs.$save(doc);
				var old = this.getByKey(joinedObj.$id);
				_.assign(old, joinedObj.doc);
				return allDocs.$save(old);
			}
		}

		ModuleDataStore.getDataStore = function getDataStore (docName) {
			if(!allStores[docName]) {
				allStores[docName] = {
					db : new ModuleDataStore(docName),
					parents : [],
					children : []
				};
			}
			return allStores[docName];
		}

		ModuleDataStore.bootstrapModule = function(docName, inheritedDocTypes, classMixin) {
			// var dataStore = new ModuleDataStore(docName);

			// add parents to this docType
			_.extend(ModuleDataStore.getDataStore(docName), {
				parents : inheritedDocTypes || []
			});

			// iterate to add this docType as a child for parentModules
			_.forEach(inheritedDocTypes, (a) => ModuleDataStore.getDataStore(a).children.push(docName));

			ModuleDataStore.getDataStore(docName).db.initializeObjectsList(classMixin);

			return ModuleDataStore.getDataStore(docName).db;
		}



		return ModuleDataStore;
	}


})(window)

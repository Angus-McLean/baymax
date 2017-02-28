(function (context) {

  angular.module('app.data')
	.factory('SearchService', SearchServiceFactory)

	SearchServiceFactory.$inject = ['ModuleDataStore'];

	function SearchServiceFactory(ModuleDataStore) {

		var DEFAULTS = {
			shouldSort: true,
			threshold: 0.7,
			location: 0,
			distance: 100,
			maxPatternLength: 32,
			minMatchCharLength: 1
		};

		function defaultSearch(records, searchTerm, options) {

			var fuse = new Fuse(records, _.defaults(options, DEFAULTS));
			var result = fuse.search(searchTerm);
			return result;
		}

		return {
			defaultSearch : defaultSearch
		};
	}


})(window)

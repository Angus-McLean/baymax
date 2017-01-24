(function () {
	angular.module('bots.GroceryModule')
		.constant('GroceryModuleConfig',
			{
				"name" : "GroceryModule",
				"api.ai" : {
					"authentication" : {
						"clientToken" : "86d1933c91914e6d90f65476d47cd6bd",
						"developerToken" : "b77a9e93295e40cfb159459a9e427708"
					}
				},
				"dependencies" : [
					"RecordModule"
				],
				"scripts" : {
					"install" : "./install/install.js"
				},
				"main" : "index.js"
			}
		);
})();

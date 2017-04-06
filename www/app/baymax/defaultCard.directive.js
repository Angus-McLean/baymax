(function () {
	angular.module('app.baymax')
		.directive('defaultCard', DefaultModuleObjectDirective)
		.directive('directive', dynamicDirective);

	DefaultModuleObjectDirective.$inject = ['$ionicPopover'];

	function DefaultModuleObjectDirective($ionicPopover) {
		return {
			restrict : 'EA',
			templateUrl : 'app/baymax/defaultCard.partial.html',
			scope : '=',
			link : function ($scope, elem, attr) {
				var template = `<ion-popover-view>
					<ion-content>
						<div class="list">
							<a ng-repeat="button in popoverButtons" ng-click="{{button.click}}" class="item">{{button.label}}</a>
						</div>
					</ion-content>
				</ion-popover-view>`;

				$scope.popoverButtons = [{
					label : 'Edit',
					click : 'toggleEdit(moduleObject)'
				}, {
					label : 'Delete',
					click : 'delete(moduleObject)'
				}].concat(_.get($scope, attr.actions) || []);
				$scope.popover = $ionicPopover.fromTemplate(template, {
					scope: $scope
				});
				$scope.toggleEdit = function (moduleObject) {
					if(moduleObject.$ephim().isEditing) {
						moduleObject.$class().updateFromJson(moduleObject.$ephim().rawJson);
					}
					moduleObject.$ephim().rawJson = moduleObject.$class().toJson();
					moduleObject.$ephim().isEditing = !moduleObject.$ephim().isEditing;
					$scope.popover.hide();
				}
				$scope.delete = function (moduleObject) {
					moduleObject.$class().destroy();
					$scope.popover.hide();
				}
			}
		};
	}

	dynamicDirective.$inject = ['$compile', '$interpolate', 'Baymax'];

	function dynamicDirective ($compile, $interpolate, Baymax) {

		function getModuleDirective(objectName) {
			if(!objectName || objectName == '') {
				return '';
			}
			var BaymaxModule = _.find(Baymax.modules, ['app.object_name', objectName]);
			if(BaymaxModule && Baymax.modules[BaymaxModule.name].app && Baymax.modules[BaymaxModule.name].app.directive_name) {
				return Baymax.modules[BaymaxModule.name].app.directive_name;
			} else {
				return 'default-card';
			}
		}

		return {
			template: '',
			link: function($scope, element, attributes) {
				element.replaceWith($compile('<div ' + getModuleDirective(attributes.directive) + '></div>')($scope));
			}
		};
	}
})();

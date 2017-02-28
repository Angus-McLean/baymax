

angular
.module('app')

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		cordova.plugins.notification.local.schedule({
			id: 1,
			text: 'Test Message 1',
			voice : 'test',
			icon: 'http://3.bp.blogspot.com/-Qdsy-GpempY/UU_BN9LTqSI/AAAAAAAAAMA/LkwLW2yNBJ4/s1600/supersu.png',
			sound: null,
			badge: 1,
			data: { test: '1' }
		});
		cordova.plugins.notification.local.on("click", console.info.bind(console));
	});
});

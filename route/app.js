var routerApp = angular.module('routerApp', [
	'ui.router'
]);

routerApp.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/home');
	
	$stateProvider
		.state('home', {
			url: '/home',
			views: {
				'mainContent': {
					templateUrl: 'partial-home.html'
				}
			}
		})
		
		.state('home.list', {
			url: '/list/{lid}/{name}',
			/*params: {
	            lid: null,
	            name: null
	        },*/
			templateUrl: 'partial-home-list.html',
			controller: function ($scope, $stateParams) {
				$scope.data = $stateParams.lid;
				$scope.dogs = ['a', 'b', 'c'];
			}
		})	

		.state('home.paragraph', {
			url: '/paragraph',
			params: {
	            pid: null,
	            name: null
	        },
			template: 'This is simple paragraph',
			controller: function ($scope, $stateParams) {
				console.log($stateParams.pid);
				
			}
		})		
		.state('about', {
			url: '/about/{id}',
			/*params: {
	            id: null
	        },*/
			views: {
				'mainContent': {
					templateUrl: 'partial-about.html',
				},
				//viewName@stateName
				'columnOne@about': {
					template: 'This is simple col 1',
				},
				'columnTwo@about': {
					templateUrl: 'column2.html',
					controller: 'columnTwoCtrl'
				},
				'columnTwoC1@about': {
					templateUrl: 'column2c1.html'
				},
				'columnTwoC2@about': {
					templateUrl: 'column2c2.html'
				}
			}

		})


});

routerApp.controller('columnTwoCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {
	$scope.message = 'Data '+ $stateParams.id;

    $scope.scotches = [
        {
            name: 'Data1',
            price: 50
        },
        {
            name: 'Data2',
            price: 10000
        },
        {
            name: 'Data3',
            price: 20000
        }
    ];
}])
angular.module('app', [
	'ui.router',
	'ngAnimate', 
	'parse-angular',
	'parse-angular.enhance',

	/* models */
	'hunews.models.Article',

	/* states */ 
	// 'hunews.states.features', 
	// 'hunews.states.facebook', 
	// 'hunews.states.demo' , 
	// 'hunews.states.about', 
	
	'hunews.directives.articleItem' /* an example directive */, 	
	'hunews.directives.imageDrop' /* an example directive */, 	
	
	'ParseServices' /* this is the Parse SDK */
])

// hack to disable auto scrolling on hashchange because we're using ui-router to manage states, instead of the core angular router which cannot handle states
// discussion on this here: https://github.com/angular-ui/ui-router/issues/110
.value('$anchorScroll', angular.noop)

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$anchorScrollProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $anchorScrollProvider) {


	// this is required for the root url to direct to /#/
	$urlRouterProvider
        .otherwise('/');
    
 //    $stateProvider
	
	// .state('code', {
	// 	url: '/code',
	// 	controller:   'aboutController',
	// 	templateUrl:  'app/views/about.html'
	// });

}])

.run(['ParseSDK', '$rootScope', '$state', '$stateParams', function(ParseService, $rootScope,   $state,   $stateParams) {

	// Parse is initialised by injecting the ParseService into the Angular app
	$rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.isViewLoading = true;


    // loading animation
    $rootScope.setLoading = function() {
	    $rootScope.isViewLoading = true;
	};
	$rootScope.unsetLoading = function() {
	    $rootScope.isViewLoading = false;
	};


	$rootScope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
		$rootScope.setLoading();
	});

	$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
		$rootScope.unsetLoading();
	});

	$rootScope.$on('$stateChangeError', function (ev, to, toParams, from, fromParams, err) {
		console.log(err);
	});

}]);
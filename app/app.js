'use strict';

// Declare app level module which depends on views, and components
var bankApp = angular.module('bankApp', [
	'ngRoute',
	'ngMaterial',

	'bankControllers',
	'bankServices',
	'bankDirectives'
]);

bankApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/overview', {
			templateUrl: 'templates/overview.html',
			controller: 'OverviewCtrl'
		}).otherwise({
			redirectTo: '/overview'
		});

}]);

var bankControllers = angular.module("bankControllers", []);
var bankServices = angular.module("bankServices", []);
var bankDirectives = angular.module("bankDirectives", []);
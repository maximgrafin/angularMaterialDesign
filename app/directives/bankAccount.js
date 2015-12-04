bankDirectives.directive('bankAccountDirective', [function () {
	var BankAccountDirective = {
		restrict: 'E',
		templateUrl: 'templates/bankAccount.html',
		scope:{
			account:'='
		},
		link: function ($scope) {
		}
	};

	return BankAccountDirective;
}]);

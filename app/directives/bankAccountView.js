bankDirectives.directive('bankAccountView', [function () {
	var BankAccountViewDirective = {
		restrict: 'E',
		templateUrl: 'templates/bankAccountView.html',
		scope:{
			account:'='
		},
		link: function ($scope) {
		}
	};

	return BankAccountViewDirective;
}]);

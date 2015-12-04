bankDirectives.directive('bankAccountEdit', ['ValidationService', function (ValidationService) {
	var BankAccountEditDirective = {
		restrict: 'E',
		templateUrl: 'templates/bankAccountEdit.html',
		scope:{
			account:'='
		},
		link: function ($scope) {
			$scope.isIbanValid = function(iban) {
				return ValidationService.isIbanValid(iban);
			};

			$scope.isBicValid = function(bic) {
				return ValidationService.isBicValid(bic);
			};
		}
	};

	return BankAccountEditDirective;
}]);

bankControllers.controller('OverviewCtrl', ['$scope', '$mdDialog', 'StorageService', 'ValidationService', function ($scope, $mdDialog, StorageService, ValidationService) {
	$scope.accounts = [];
	$scope.editAccounts = {};
	$scope.newAccount = {};
	$scope.errorMassage = "";
	$scope.isBusy = false;

	$scope.getEditAccount = function (account) {
		return $scope.editAccounts[account.id];
	};

	$scope.isEditMode = function (account) {
		return !!$scope.editAccounts[account.id];
	}

	$scope.setEditMode = function (value, account) {
		if (value)
			$scope.editAccounts[account.id] = angular.copy(account);
		else
			delete $scope.editAccounts[account.id];
	};

	$scope._updateAccounts = function () {
		$scope.isBusy = true;
		StorageService.getAccounts()
			.then(function (accounts) {
				$scope.accounts = accounts;
				$scope.isBusy = false;
				$scope.$apply();
			});
	};

	$scope._updateAccount = function (account) {
		$scope.isBusy = true;
		StorageService.getAccount(account.id)
			.then(function (account) {
				for (var i in $scope.accounts) {
					if ($scope.accounts[i].id == account.id)
						$scope.accounts[i] = account;
				}
				$scope.isBusy = false;
				$scope.$apply();
			});
	};

	$scope.init = function () {
		$scope._updateAccounts();
	};

	$scope.isNewAccountValid = function () {
		return ValidationService.isAccountValid($scope.newAccount);
	};

	$scope.removeAccount = function (account) {
		if ($scope.isBusy)
			return;

		$scope.isBusy = true;
		StorageService
			.deleteAccount(account.id)
			.then(function () {
				$scope.isBusy = false;
				$scope._updateAccounts();
				$scope.$apply();
			});
	};


	$scope.addAccount = function () {
		if ($scope.isBusy)
			return;

		if (!ValidationService.isAccountValid($scope.newAccount)) {
			$scope.errorMassage = "New account is not valid";
			return;
		}

		$scope.isBusy = true;
		StorageService.saveAccount($scope.newAccount)
			.then(function () {
				$scope.isBusy = false;
				$scope._updateAccounts();
				$scope.$apply();
			});
	};

	$scope.saveAccount = function (account) {
		if ($scope.isBusy)
			return;

		var editAccount = $scope.getEditAccount(account);

		if (!ValidationService.isAccountValid(editAccount)) {
			$scope.errorMassage = "Account is not valid";
			return;
		}

		$scope.isBusy = true;

		StorageService.saveAccount(editAccount)
			.then(function () {
				$scope.isBusy = false;
				$scope._updateAccount(editAccount);
				$scope.$apply();
			}).then(function(){
				$scope.setEditMode(false, editAccount);
			});
	};

	$scope.showConfirmRemoveAccount = function (event, account) {
		var confirm = $mdDialog.confirm()
			.title('Do you really want to delete account?')
			.targetEvent(event)
			.ok('Delete')
			.cancel('cancel');

		$mdDialog.show(confirm).then(function () {
			$scope.removeAccount(account);
		}, function () {
		});
	};

	$scope.init();
}]);
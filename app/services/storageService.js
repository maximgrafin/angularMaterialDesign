bankServices.factory('StorageService', ['ValidationService', 'TransportService', function (ValidationService, TransportService) {
	var StorageService = {};
	StorageService._accounts = undefined;

	StorageService._toArray = function (obj) {
		var result = [];
		angular.forEach(obj, function (item) {
			result.push(angular.copy(item));
		});

		return result;
	};

	StorageService._syncAccountIfNeeded = function () {
		if (angular.isDefined(StorageService._accounts))
			return Promise.resolve();
		else
			return StorageService.syncAccounts();
	};

	StorageService.syncAccounts = function () {
		return TransportService.getAccounts()
			.then(function (accounts) {
				StorageService._accounts = {};
				for(var i in accounts){
					StorageService._accounts[accounts[i].id] = angular.copy(accounts[i]);
				}
				return Promise.resolve();
			});
	};

	StorageService.getAccounts = function () {
		return StorageService._syncAccountIfNeeded()
			.then(function () {
				var accounts = StorageService._toArray(StorageService._accounts);
				return accounts;
			});
	};

	StorageService.getAccount = function (id) {
		return StorageService._syncAccountIfNeeded()
			.then(function () {
				return angular.copy(StorageService._accounts[id]);
			});
	};

	StorageService.saveAccount = function (account) {
		return StorageService._syncAccountIfNeeded().then(function () {
			if (!ValidationService.isAccountValid(account))
				return Promise.rejected();
			account = angular.copy(account);
			var save = TransportService.save(account);
			return save
				.then(function (savedAccount) {
					StorageService._accounts[savedAccount.id] = savedAccount;
				});
		});
	};

	StorageService.deleteAccount = function (accountId) {
		if (!StorageService._accounts.hasOwnProperty(accountId))
			return Promise.reject("Account is not exist");

		return TransportService.delete(accountId)
			.then(function () {
				delete StorageService._accounts[accountId];
			});
	};

	return StorageService;
}]);
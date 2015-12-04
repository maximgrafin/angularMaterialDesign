bankServices.factory('TransportService', ['$timeout', function ($timeout) {
	var TransportService = {};

	TransportService._accounts = [{
		id: "1",
		iban: "DE1234567890123",
		bic : "123456789"
	}, {
		id: "2",
		iban: "RU9876543210987",
		bic : "987654321"
	}, {
		id: "3",
		iban: "EN1112233445566",
		bic : "112233445"
	}];

	TransportService._randomDelay = function () {
		return new Promise(function (resolve) {
			$timeout(resolve, Math.random() * 1000);
		});
	};

	TransportService.getAccounts = function () {
		return TransportService._randomDelay().then(function () {
			return angular.copy(TransportService._accounts);
		});
	};

	TransportService.save = function (data) {
		return TransportService._randomDelay().then(function () {
			data = angular.copy(data);
			if (!angular.isDefined(data.id)) {
				data.id = Math.floor(Math.random() * 10000).toString();
				TransportService._accounts.push(data);
				return data;
			} else {
				for (var i in TransportService._accounts) {
					if (TransportService._accounts[i].id == data.id) {
						TransportService._accounts[i] = data;
						return data;
					}
				}

			}
		});
	};

	TransportService.delete = function (accountId) {
		return TransportService._randomDelay().then(function () {
			for (var i = TransportService._accounts.length - 1; i >= 0; i--) {
				if (TransportService._accounts[i].id == accountId)
					TransportService._accounts.splice(i, 1);
			}
		});
	};

	return TransportService;
}]);
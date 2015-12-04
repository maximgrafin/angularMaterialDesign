'use strict';

describe('bankApp.StorageService', function () {
	var storageService;
	var validationMock, transportMock;

	// setup:

	beforeEach(module('bankApp'));

	beforeEach(function () {
		validationMock = jasmine.createSpyObj("validationMock", ["isAccountValid"]);
		validationMock.isAccountValid.and.returnValue(true);

		transportMock = jasmine.createSpyObj("transportMock", ["save", "delete", "getAccounts"]);
		transportMock.getAccounts.and.returnValue(Promise.resolve([]));
		transportMock.save.and.callFake(function (account) {
			account = angular.copy(account);
			account.id = 1;
			return Promise.resolve(account);
		});
		transportMock.delete.and.returnValue(Promise.resolve());

		module(function ($provide) {
			$provide.value('ValidationService', validationMock);
			$provide.value('TransportService', transportMock);
		});
	});
	beforeEach(inject(function (_StorageService_) {
		storageService = _StorageService_;
	}));

	// test cases:

	it('should return empty user data', function (done) {
		storageService.getAccounts()
			.then(function (accounts) {
				expect(accounts).toEqual([]);
			}, fail.bind("cannot get accounts"))
			.then(done, done);
	});

	it('cannot add invalid account', function (done) {
		validationMock.isAccountValid.and.returnValue(false);

		var newAccount = {
			iban: "123456789012",
			bic : "ABCDEFG"
		};

		storageService
			.saveAccount(newAccount)
			.then(fail.bind("account was saved"),
			function () {
				return storageService.getAccounts();
			})
			.then(function (accounts) {
				expect(accounts).toEqual([]);
			}, fail.bind("cannot get accounts"))
			.then(done, done);
	});

	it('can add avalid ccount', function (done) {
		var newAccount = {
			iban: "123456789012",
			bic : "ABCDEFG"
		};

		storageService.saveAccount(newAccount)
			.then(function () {
				return storageService.getAccount(1)
			}, fail.bind("cannot get account"))
			.then(function (account) {
				expect(account).toEqual({
					id  : 1,
					iban: "123456789012",
					bic : "ABCDEFG"
				});
			}, fail.bind("account was not saved"))
			.then(done, done);
	});

	it('cannot update account with invalid data', function (done) {
		var originalAccount = {
			id  : 1,
			iban: "123456789012",
			bic : "ABCDEFG"
		};
		var incorrectAccount = {
			id  : 1,
			iban: "qwerty",
			bic : "12345"
		};

		validationMock.isAccountValid.and.returnValue(true);
		storageService.saveAccount(originalAccount)
			.then(function () {
				validationMock.isAccountValid.and.returnValue(false);
				return storageService.saveAccount(incorrectAccount)
			}, fail.bind("valid account was not saved"))
			.then(fail.bind("account was saved"),
			function () {
				return storageService.getAccount(1);
			})
			.then(function (account) {
				expect(account).toEqual(originalAccount);
			}, fail.bind("cannot get account"))
			.then(done, done);
	});

	it('can update account', function (done) {
		var updatedAccount = {
			id  : 1,
			iban: "qwerty",
			bic : "12345"
		};
		var newAccount = {
			id  : 1,
			iban: "123456789012",
			bic : "ABCDEFG"
		};

		storageService.saveAccount(newAccount)
			.then(function () {
				return storageService.saveAccount(updatedAccount)
			})
			.then(
			function () {
				return storageService.getAccount(1);
			}, fail.bind("account was not saved"))
			.then(function (account) {
				expect(account).toEqual(updatedAccount);
			}, fail.bind("cannot get account"))
			.then(done, done);
	});

	it('can delete account', function (done) {
		var newAccount = {
			id  : 1,
			iban: "123456789012",
			bic : "ABCDEFG"
		};
		storageService.saveAccount(newAccount)
			.then(function () {
				return storageService.deleteAccount(newAccount.id)
			}, fail.bind("account was not saved"))
			.then(function () {
				return storageService.getAccounts();
			}, fail.bind("account was not deleted"))
			.then(function (accounts) {
				expect(accounts).toEqual([]);
			}, fail.bind("cannot get accounts"))
			.then(done, done);
	});

	it('cannot delete not existent account', function (done) {
		var newAccount = {
			id  : 1,
			iban: "123456789012",
			bic : "ABCDEFG"
		};
		storageService.syncAccounts()
			.then(function () {
				return storageService.deleteAccount(newAccount.id)
			})
			.then(fail.bind("account was deleted"), done)
			.then(done, done);
	});

	it('changing account does not change cached data', function (done) {
		var newAccount = {
			id  : 1,
			iban: "123456789012",
			bic : "ABCDEFG"
		};

		storageService.saveAccount(newAccount)
			.then(function () {
				return storageService.getAccount(1);
			})
			.then(function (account) {
				account.bic = "qwerty";
				return storageService.getAccount(1);
			})
			.then(function (account) {
				expect(account).toEqual({
					id  : 1,
					iban: "123456789012",
					bic : "ABCDEFG"
				});

				return storageService.getAccounts();
			})
			.then(function (accounts) {
				newAccount = accounts[0];
				newAccount.bic = "qwerty";
				return storageService.getAccount(1)
			})
			.then(function (account) {
				expect(account).toEqual({
					id  : 1,
					iban: "123456789012",
					bic : "ABCDEFG"
				});
			})
			.then(done, fail.bind("failed"))
			.then(done, done);
	});
});
'use strict';

describe('bankApp.OverviewCtrl controller', function () {
	var scope, controller;
	var validationMock, storageMock;

	var _timeoutPromise = function () {
		return new Promise(function (resolve) {
			setTimeout(resolve, 0);
		})
	};

	beforeEach(module('bankApp'));

	beforeEach(function () {
		validationMock = jasmine.createSpyObj("validationMock", ["isAccountValid"]);
		storageMock = jasmine.createSpyObj("storageMock", ["getAccounts", "getAccount", "saveAccount", "deleteAccount"]);

		module(function ($provide) {
			validationMock.isAccountValid.and.returnValue(true);
			storageMock.getAccounts.and.returnValue(Promise.resolve([]));
			storageMock.saveAccount.and.returnValue(Promise.resolve());

			$provide.value('ValidationService', validationMock);
			$provide.value('StorageService', storageMock);
		});
	});

	beforeEach(inject(function ($rootScope, $controller) {
		scope = $rootScope.$new();
		controller = $controller('OverviewCtrl', {
			'$scope': scope
		});
	}));

	it('initialized with empty', function () {
		expect(scope.accounts).toEqual([]);
	});

	it('update accounts', function (done) {
		var account = {
			id  : 1,
			iban: "123",
			bic : "qwe"
		};

		storageMock.getAccounts.and.returnValue(Promise.resolve([account]));

		_timeoutPromise()
			.then(function () {
				expect(scope.accounts).toEqual([]);
			})
			.then(function () {
				scope._updateAccounts();
			})
			.then(_timeoutPromise)
			.then(function () { //setTimeout in order to wait saving routine
				expect(scope.accounts).toEqual([account]);
			})
			.then(done, done);
	});

	it('save valid account', function (done) {
		scope.newAccount = {
			iban: "123",
			bic : "qwe"
		};
		_timeoutPromise()
			.then(function () {
				scope.addAccount();
			})
			.then(_timeoutPromise)
			.then(function () { //setTimeout in order to wait saving routine
				expect(storageMock.saveAccount).toHaveBeenCalled();
				expect(storageMock.getAccounts).toHaveBeenCalled();
			})
			.then(done, done);
	});

	it('save invalid account', function (done) {
		validationMock.isAccountValid.and.returnValue(false);
		storageMock.saveAccount.and.throwError("invalid account saved");

		scope.newAccount = {
			iban: "123",
			bic : "qwe"
		};
		scope.addAccount();
		_timeoutPromise()
			.then(done, done);
	});

	it('isBusy while updating accounts', function (done) {
		var updatePromiseResolve;
		var updatePromise = new Promise(function (resolve) {
			updatePromiseResolve = resolve;
		});
		storageMock.getAccounts.and.returnValue(updatePromise);

		_timeoutPromise()
			.then(function () {
				expect(scope.isBusy).toEqual(false);
				scope._updateAccounts();
				expect(scope.isBusy).toEqual(true);
				updatePromiseResolve([]);
			})
			.then(_timeoutPromise)
			.then(function () {
				expect(scope.isBusy).toEqual(false);
			})
			.then(done, done);
	});

	it('isBusy while saving accounts', function (done) {
		var savePromiseResolve;
		var savePromise = new Promise(function (resolve) {
			savePromiseResolve = resolve;
		});
		storageMock.saveAccount.and.returnValue(savePromise);

		_timeoutPromise()
			.then(function () {
				expect(scope.isBusy).toEqual(false);
				scope.addAccount();
				expect(scope.isBusy).toEqual(true);
				savePromiseResolve([]);
			})
			.then(_timeoutPromise)
			.then(function () {
				expect(scope.isBusy).toEqual(false);
				done();
			})
			.then(done, done);
	});
})
;
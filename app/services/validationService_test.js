'use strict';

describe('bankApp.ValidationService', function () {
	var validationService;
	beforeEach(module('bankApp'));

	beforeEach(inject(function (_ValidationService_) {
		validationService = _ValidationService_;
	}));

	it('empty iban', function () {
		expect(validationService.isIbanValid("")).toEqual(false);
	});
	it('null iban', function () {
		expect(validationService.isIbanValid(null)).toEqual(false);
	});
	it('valid iban', function () {
		expect(validationService.isIbanValid("DE89370400440532013000")).toEqual(true);
	});
	it('valid iban with spaces', function () {
		expect(validationService.isIbanValid("\t\n DE\t\n 34567890123456789012345678901234\t\n ")).toEqual(true);
	});
	it('invalid iban longer than 34', function () {
		expect(validationService.isIbanValid("DE 3456 7890 1234 5678 9012 3456 7890 1234 5")).toEqual(false);
	});
	it('invalid iban shorted than 6', function () {
		expect(validationService.isIbanValid("DE 345 \t\n          ")).toEqual(false);
	});
//TODO add other checks


	it('valid bic', function () {
		expect(validationService.isBicValid("123456789")).toEqual(true);
	});
	it('valid iban with spaces', function () {
		expect(validationService.isBicValid("\t\n 1\t\n 23456789\t\n ")).toEqual(true);
	});
	it('invalid iban longer than 9', function () {
		expect(validationService.isBicValid("123 456 789 0")).toEqual(false);
	});
	it('invalid iban shorted than 9', function () {
		expect(validationService.isBicValid("123 456 78")).toEqual(false);
	});
//TODO add other checks


});
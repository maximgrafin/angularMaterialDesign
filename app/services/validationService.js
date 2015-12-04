bankServices.factory('ValidationService', function () {
	var ValidationService = {};

	ValidationService.isAccountValid = function (account) {
		return ValidationService.isIbanValid(account.iban) && ValidationService.isBicValid(account.bic);
	};


	ValidationService._lengthValidation = function (str, minLen, maxLen) {
		if (!angular.isDefined(str) || !str)
			return false;

		str = ValidationService._removeWhitespaces(str);
		if (str.length > maxLen)
			return false;
		if (str.length < minLen)
			return false;

		return true;
	};

	ValidationService.isIbanValid = function (iban) {
		return ValidationService._lengthValidation(iban, 6, 34);
		//TODO check checksum and format
	};

	ValidationService.isBicValid = function (bic) {
		return ValidationService._lengthValidation(bic, 9,9);
		//TODO check checksum and format
	};

	ValidationService._removeWhitespaces = function (str) {
		return str.replace(/\s+/g, '');
	};

	return ValidationService;
});

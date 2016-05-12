/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

define([
	'./settings',
	'./MacExtensionPopupGateway',
	'./NullPopupGateway',
	'./EyeosAppGateway'
], function (settings, MacExtensionPopupGateway, NullPopupGateway, EyeosAppGateway) {

	function EyeRunRequestor() {
		this.EYERUN_LOCATION = settings.EYERUN_LOCATION;
		// tests will modify sut._image directly to inject an image for testing
		this._image = new Image();
	}


	EyeRunRequestor.prototype.getImage = function () {
		return this._image;
	};

	EyeRunRequestor.prototype._macPopupGateway = function () {
		return new MacExtensionPopupGateway(this);
	};

	EyeRunRequestor.prototype.getEyeRunLocation = function () {
		return this.EYERUN_LOCATION;
	};

	EyeRunRequestor.prototype.appGateway = function() {
		return new EyeosAppGateway(this);
	};


	EyeRunRequestor.prototype.popupGateway=function(isMac) {
		return NullPopupGateway.instance();
	};
	
	EyeRunRequestor.prototype.eyeRunInstalled = function(cb) {
		this.sendRequest("", null, function() {
			cb(true);
		}, function() {
			cb(false)
		});
	};

	EyeRunRequestor.prototype.renewCard = function(credentials, callback, errorCallback) {
		var data = {
			credentials: credentials
		};
		this.sendRequest("/renewCard", data, callback, errorCallback);
	};

	EyeRunRequestor.prototype.setSession = function (credentials, domain, transactionId, callback, errorCallback) {
		var data = {
			credentials: credentials,
			domain: domain,
			transactionId: transactionId
		};
		this.sendRequest("/setSession", data, callback, errorCallback);
	};

	EyeRunRequestor.prototype.sendRequest = function (endpoint, data, callback, errorCallback) {
		var credentials, domain;
		var transactionId;
		var card;
		if (data) {
			credentials = data.credentials;
			domain = data.domain;
			transactionId = data.transactionId;

			card = credentials.card;

			if (typeof card === 'object') {
				card = JSON.stringify(card);
			}
		}



		var src = this.EYERUN_LOCATION
			+ endpoint+ '/';
		if (credentials) {
			src += encodeURIComponent(card)
			+ '/'
			+ encodeURIComponent(credentials.signature);
		}
		if (domain) {
			src += "/" + encodeURIComponent(data.domain);
		}
		if (transactionId) {
			src += "/" + encodeURIComponent(transactionId);
		}

		this._image.src = src;
		this._image.onload = callback;
		this._image.onerror = errorCallback;
	};


	return EyeRunRequestor;
});

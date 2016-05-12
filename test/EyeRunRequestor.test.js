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

'use strict';
define([
	'src/eyeRunRequestor',
	'src/MacExtensionPopupGateway',
	'src/NullPopupGateway',
	'src/EyeosAppGateway'
], function (EyeRunRequestor, MacExtensionPopupGateway, NullPopupGateway, EyeosAppGateway) {

	suite('eyeRunRequestor', function(){
		var sut;
		var EYERUN_LOCATION;
		var image;



		setup(function() {
			image = {
				src: "a fake image"
			};
			sut = new EyeRunRequestor();
			sut._image = image;
			EYERUN_LOCATION = sut.EYERUN_LOCATION;
		});

		 function constructDummyCredentials () {
			return {
				card: "a test card",
				signature: "a test signature",
				success: true
			};
		}

		suite("eyeRunInstalled", function() {
			var eyeRunExists;
			setup(function() {
				eyeRunExists = null;
			});
			function exercise() {
				sut.eyeRunInstalled(function(exists) {
					eyeRunExists = exists;
				});
			}
			test("eyeRunInstalled called will call the eyeRun pixel with correct url", function() {
				//GUARD ASSERTION
				assert.equal("a fake image", sut._image.src);
				exercise();
				assert.equal(sut.EYERUN_LOCATION+"/", sut._image.src);
			});

			test("eyeRunInstalled if pixel load will call to callback with true", function() {
				//GUARD ASSERTION
				assert.equal(null, eyeRunExists);
				exercise();
				sut._image.onload();
				assert.equal(true, eyeRunExists);
			});

			test("eyeRunInstalled if pixel will not load will call to callback with false", function() {
				//GUARD ASSERTION
				assert.equal(null, eyeRunExists);
				exercise();
				sut._image.onerror();
				assert.equal(false, eyeRunExists);
			});
		});
		
		suite('renewCard', function(){
			var defaultCredentials, callback, errorCallback;
			setup(function () {
				defaultCredentials = constructDummyCredentials();
				callback = function () {};
				errorCallback = function () {};
			});

			function exercise (credentials, callback, errorCallback) {
				sut.renewCard(credentials, callback, errorCallback);
			}

		    test('should send a request to correct endpoint', sinon.test(function(){
		        var sendRequestStub = this.stub(sut, 'sendRequest');
			    exercise(defaultCredentials, callback, errorCallback);
			    sinon.assert.calledOnce(sendRequestStub);
			    sinon.assert.calledWithExactly(sendRequestStub, '/renewCard', {credentials: defaultCredentials}, callback, errorCallback);
		    }));
		});

		suite("sendRequest", function () {
			var defaultCredentials, callback, errorCallback;
			var domain = "http://patata";

			setup(function () {
				defaultCredentials = constructDummyCredentials();
				callback = function () {};
				errorCallback = function () {};
			});

			function exercise (endpoint, credentials, callback, errorCallback) {
				var data = {
					credentials: credentials
				};
				sut.sendRequest(endpoint, data, callback, errorCallback);
			}

			test("makes a request to endpoint with card and signature", function () {
				exercise('/renewCard', defaultCredentials);
				assert.equal(sut._image.src, EYERUN_LOCATION + '/renewCard/a%20test%20card/a%20test%20signature');
			});


			test("set the request callback", function () {
				exercise('/renewCard', defaultCredentials, callback);
				assert.equal(sut._image.onload, callback);
			});

			test("do not set the onerror callback if not setted", function() {
				exercise('/renewCard', defaultCredentials, callback);
				assert.equal(undefined , sut._image.onerror);
			});

			test("set the onerror callback if error callback setted", function(){
				exercise('/renewCard', defaultCredentials, callback, errorCallback);
				assert.equal(errorCallback , sut._image.onerror);
			});

			test("makes a request to endpoint with card, signature and domain", function () {
				var data = {
					credentials: defaultCredentials,
					domain: domain,
					transactionId: 'some transaction id'
				};
				sut.sendRequest('/hola', data, callback, errorCallback);
				assert.equal(sut._image.src, EYERUN_LOCATION + '/hola/a%20test%20card/a%20test%20signature/http%3A%2F%2Fpatata/some%20transaction%20id');
			});
		});

		suite('#Factory methods', function(){
		    suite('popupGateway', function(){
			    suite('isMac', function(){
				    test('should create NULL instance', sinon.test(function(){

					    var instance = sut.popupGateway(function isMac()
					    {
					    	return true;
					    });
					    assert.instanceOf(instance, NullPopupGateway);
				    }));
			    });
			    suite('is not mac', function(){
			        test('should return a Null gateway', sinon.test(function(){
				        var instance = sut.popupGateway(function isMac()
				        {
					        return false;
				        });
				        assert.instanceOf(instance, NullPopupGateway);
			        }));
			    });
				suite("appGateway", function() {
					test("should create EyeosAppGateway", sinon.test(function() {
						var instance = sut.appGateway();
						assert.instanceOf(instance, EyeosAppGateway);
					}))
				})
		    });
		});

		suite('setSession', function(){
			var defaultCredentials, callback, errorCallback;
			var domain = "https://patatasfritas";
			var tid;
			setup(function () {
				tid = 'a super fake transaction id';
				defaultCredentials = constructDummyCredentials();
				callback = function () {};
				errorCallback = function () {};
			});

			function exercise (credentials, domain, transactionId, callback, errorCallback) {
				sut.setSession(credentials, domain, transactionId, callback, errorCallback);
			}

		    test('should send a request to correct endpoint', sinon.test(function(){
		        var sendRequestStub = this.stub(sut, 'sendRequest');
				var data = {
					credentials: defaultCredentials,
					domain: domain,
					transactionId: tid
				};
			    exercise(defaultCredentials, domain, tid, callback, errorCallback);
			    sinon.assert.calledOnce(sendRequestStub);
			    sinon.assert.calledWithExactly(sendRequestStub, '/setSession', data, callback, errorCallback);
		    }));
		});

	});

});

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
	'src/MacExtensionPopupGateway',
	'src/MouseChecker'
], function (MacExtensionPopupGateway, MouseChecker) {

	suite('MacExtensionPopupGateway suite', function () {
		var sut;
		var requestor;
		var sendMessageSpy;
		var fakeEyerunLocation;
		var fakeWindow, windowOpenSpy;
		var fakePopup, closePopupSpy;
		var windowId = "windowId";
		var isWindowVisible = null;
		var mouseChecker;

		setup(function () {
			sendMessageSpy=sinon.spy();

			fakeEyerunLocation = 'FAKE_EYERUN_LOCATION';
			requestor = {
				sendRequest: sendMessageSpy,
				getEyeRunLocation: function () {
					return fakeEyerunLocation;
				},
				getImage: function () {
					return {width: 893, height: 73};
				}
			};

			windowOpenSpy = sinon.stub().returns(fakePopup);
			closePopupSpy=sinon.spy();

			fakeWindow = {
				open: windowOpenSpy
			};
			fakePopup = {
				close: closePopupSpy
			};

			mouseChecker = new MouseChecker();

			sut = new MacExtensionPopupGateway(requestor, fakeWindow, mouseChecker);
		});




		suite('#focus', function () {
			var callback;

			setup(function () {
				callback = sinon.spy();
			});
			function exercise (callback) {
				return sut.focus(callback);
			}

			suite('when called', function(){

				test('should delegate correct call to requestor', sinon.test(function(){
					exercise(callback);
					sinon.assert.calledWithExactly(sendMessageSpy,
						MacExtensionPopupGateway.focusEvent(),
						null,
						sinon.match.func
					)

				}));
				
				suite('when requestor executes the callback', function(){
					function executeFocusCallback () {
						sendMessageSpy.callArg(2);
					}
					function stubClickInsideTheDocument () {
						sinon.stub(mouseChecker, 'isInsideDocument').returns(true);
					}
					function stubClickOutsideTheDocument () {
						sinon.stub(mouseChecker, 'isInsideDocument').returns(false);
					}

				    test('when click is done inside the document should execute passed callback', sinon.test(function(){
				        stubClickInsideTheDocument();
					    exercise(callback);
					    executeFocusCallback();
						sinon.assert.calledOnce(callback);

				    }));

					test('when click is done outside the document should NOT execute passed callback', sinon.test(function(){
						stubClickOutsideTheDocument();
						exercise(callback);
						executeFocusCallback();
						sinon.assert.notCalled(callback);
				    }));
				});
			});

		});
		
		suite('startMouseTracking', function(){
			function exercise () {
				return sut.startMouseTracking();
			}
	        suite('when called', function(){

	            test('should delegate correct call to requestor', function(){
		            exercise();
		            sinon.assert.calledWithExactly(sendMessageSpy,
			            MacExtensionPopupGateway.startMouseTrackingEvent(),
			            null
		            )

	            });
	        });
		});
		suite('stopMouseTracking', function(){
			function exercise () {
				return sut.stopMouseTracking();
			}
	        suite('when called', function(){

	            test('should open a popup with correct url', function(){
		            exercise();
		            sinon.assert.calledWithExactly(windowOpenSpy,
			            fakeEyerunLocation+MacExtensionPopupGateway.stopMouseTrackingEvent()
		            )

	            });

	            test('should close the opened popup', function(){
		            windowOpenSpy.returns(fakePopup);
		            exercise();
		            sinon.assert.called(closePopupSpy);
	            });
	        });
		});

		suite("resetWindows", function() {
			function exercise() {
				return sut.resetWindows();
			}
			suite("when called", function() {
				test("should send correct call to requestor", function() {
					exercise();
					sinon.assert.calledWithExactly(sendMessageSpy, MacExtensionPopupGateway.resetWindowsEvent(), null);
				});
			})
		});

		suite("addWindow", function() {
			function exercise() {
                return sut.addWindow(windowId);
			}
			suite("when called", function() {
				test("should send correct call to requestor", function() {
					exercise();
					sinon.assert.calledWithExactly(sendMessageSpy, MacExtensionPopupGateway.addWindowEvent()+"/"+windowId, null);
				});
			});
		});

		suite("removeWindow", function() {
			function exercise() {
				return sut.removeWindow(windowId)
			}
			suite("when called", function() {
				test("should send correct call to requestor", function() {
					exercise();
					sinon.assert.calledWithExactly(sendMessageSpy, MacExtensionPopupGateway.removeWindowEvent()+"/"+windowId, null);
				});
			})
		});

		suite("isWindowVisible", function() {
			function isVisible(isVisible) {
				isWindowVisible = isVisible;
			}
			function exercise() {
				return sut.isWindowVisible(windowId,isVisible);
			}
			suite("when called", function() {
				test("should send correct call to requestor", function() {
					exercise();
					sinon.assert.calledWith(sendMessageSpy, MacExtensionPopupGateway.isWindowVisibleEvent()+"/"+windowId, null)
				});
			});
		});
	});

});

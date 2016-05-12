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
    'src/EyeosAppGateway'
], function(EyeosAppGateway) {
    var sut, innerRequestor, actualExists,
        fakeEyerunLocation, fakeWindow, fakePopup, windowOpenSpy, closePopupSpy;
    var appUrl = "https://myApp";
    suite("EyeosAppGateway", function() {
        setup(function() {
            actualExists = null;
            innerRequestor = {
                sendRequest: function(endpoint, credentials, successCallback, errorCallback){
                    this._successCallback = successCallback;
                    this._errorCallback = errorCallback;
                },
                success : function() {
                    this._successCallback();
                },
                error : function() {
                    this._errorCallback();
                },
                getEyeRunLocation: sinon.stub().returns(fakeEyerunLocation)
            };
            fakeEyerunLocation = 'FAKE_EYERUN_LOCATION';
            windowOpenSpy = sinon.stub().returns(fakePopup);
            closePopupSpy=sinon.spy();

            fakeWindow = {
                open: windowOpenSpy
            };
            fakePopup = {
                close: closePopupSpy
            };

            sut = new EyeosAppGateway(innerRequestor, fakeWindow);
        });



        suite("isChromeInstalled", function() {

            function exercise() {
                sut.isChromeInstalled(function(exists) {
                    actualExists = exists;
                });
            }

            test("should make correct call to innerRequestor", sinon.test(function() {
                this.mock(innerRequestor).expects("sendRequest").once().withExactArgs("/eyeosapp_is_chrome_installed", null, sinon.match.func, sinon.match.func);
                exercise();
            }));

            test("should call to callback true if chrome exists", function() {
                //GUARD ASSERTION
                assert.isNull(actualExists);
                exercise();
                innerRequestor.success();
                assert.isTrue(actualExists);
            });

            test("should call to callback false if chrome does not exists", function() {
                assert.isNull(actualExists);
                exercise();
                innerRequestor.error();
                assert.isFalse(actualExists);
            });
        });

        suite("openApp", function() {
            test("should make correct call to innerRequestor", sinon.test(function() {
                this.mock(innerRequestor).expects("sendRequest").once().withExactArgs("/eyeosapp_open_app/"+encodeURIComponent(appUrl));
                sut.openApp(appUrl);
            }));
        });

        suite('closeApp', function(){
            function exercise () {
                return sut.closeApp();
            }
            suite('when called', function(){

                test('should open a popup with correct url', function(){
                    exercise();
                    sinon.assert.calledWithExactly(windowOpenSpy,
                        fakeEyerunLocation+EyeosAppGateway.closeAppEvent()
                    )

                });

                test('should close the opened window', function(){
                    windowOpenSpy.returns(fakePopup);
                    exercise();
                    sinon.assert.called(closePopupSpy);
                });
            });
        });
    });
});

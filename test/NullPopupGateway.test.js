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
	'src/NullPopupGateway'
], function (NullPopupGateway) {

	suite('NullPopupGateway suite', function () {
		var sut;
		var callbackSpy;

		setup(function () {
			callbackSpy = sinon.spy();
		});


		setup(function () {
			sut = NullPopupGateway.instance();
		});


		suite('#focus', function () {
			function exercise (callback) {
				return sut.focus(callback);
			}

			suite('when called', function(){

				test('should call passed callback', sinon.test(function(){
					exercise(callbackSpy);
					sinon.assert.calledWithExactly(callbackSpy)

				}));
			});

		});

	});

});

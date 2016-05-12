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
define([], function () {
	function NullPopupGateway() {
	}

	NullPopupGateway.prototype.focus = function (callback) {
		callback();
	};

	NullPopupGateway.prototype.startMouseTracking = function () {
	};

	NullPopupGateway.prototype.stopMouseTracking = function () {
	};
	NullPopupGateway.prototype.resetWindows = function() {
	};
	NullPopupGateway.prototype.addWindow = function() {
	};
	NullPopupGateway.prototype.removeWindow = function() {
	};
	NullPopupGateway.prototype.isWindowVisible = function(windowId, fp) {
		fp(true);
	};

	NullPopupGateway._instance = null;
	NullPopupGateway.instance = function () {
		if (NullPopupGateway._instance == null) {
			NullPopupGateway._instance = new NullPopupGateway();
		}
		return NullPopupGateway._instance;
	};
	return NullPopupGateway;
});

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
		'./MouseChecker'

], function (MouseChecker) {
		'use strict';

		function MacExtensionPopupGateway (requestor, pWindow, mouseChecker) {
			this.requestor = requestor;
			this.window = pWindow || window;
			this.mouseChecker = mouseChecker || new MouseChecker();
		}

		MacExtensionPopupGateway.focusEvent = function() {
			return "/windowManager_focus";
		};
		MacExtensionPopupGateway.startMouseTrackingEvent = function() {
			return "/windowManager_startMouseTracking";
		};
		MacExtensionPopupGateway.stopMouseTrackingEvent = function() {
			return "/windowManager_stopMouseTracking";
		};
		MacExtensionPopupGateway.addWindowEvent = function() {
			return "/windowManager_addWindow"
		};
		MacExtensionPopupGateway.resetWindowsEvent = function() {
			return "/windowManager_resetWindows"
		};
		MacExtensionPopupGateway.removeWindowEvent = function() {
			return "/windowManager_removeWindow"
		};
		MacExtensionPopupGateway.isWindowVisibleEvent = function() {
			return "/windowManager_isWindowVisible"
		};

		MacExtensionPopupGateway.prototype.focus = function (callback) {
			var self = this;

			var focusEvent = MacExtensionPopupGateway.focusEvent();
			var _doCallBackIfClickedInsideDocument = function () {
				/*
					Hack to get mouse position!!!
					Eyerun will return the mouse coordinates as the image width and height
				 */
				var position = {
					x: self.requestor.getImage().width,
					y: self.requestor.getImage().height
				};
				if (self.mouseChecker.isInsideDocument(position) ){
					callback();
				}
			};
			this.requestor.sendRequest(focusEvent, null, _doCallBackIfClickedInsideDocument);
		};

		MacExtensionPopupGateway.prototype.startMouseTracking = function () {
			var startMouseTrackingEvent = MacExtensionPopupGateway.startMouseTrackingEvent();
			this.requestor.sendRequest(startMouseTrackingEvent, null);
		};

		MacExtensionPopupGateway.prototype.stopMouseTracking = function () {
			var stopMouseTrackingEvent = MacExtensionPopupGateway.stopMouseTrackingEvent();
			var eyeRunAccess = this.window.open(this.requestor.getEyeRunLocation() + stopMouseTrackingEvent);
			eyeRunAccess.close();
		};

		MacExtensionPopupGateway.prototype.resetWindows = function() {
			this.requestor.sendRequest(MacExtensionPopupGateway.resetWindowsEvent(), null);
		};

		MacExtensionPopupGateway.prototype.addWindow = function(windowId) {
			this.requestor.sendRequest(MacExtensionPopupGateway.addWindowEvent()+"/"+windowId, null);
		};

		MacExtensionPopupGateway.prototype.removeWindow = function(windowId) {
			this.requestor.sendRequest(MacExtensionPopupGateway.removeWindowEvent()+"/"+windowId, null);
		};

		MacExtensionPopupGateway.prototype.isWindowVisible = function(windowId, fp) {
			this.requestor.sendRequest(MacExtensionPopupGateway.isWindowVisibleEvent()+"/"+windowId, null, function() {
				fp(true)
			}, function() {
				fp(false)
			});
		};

		return MacExtensionPopupGateway;

	}
);

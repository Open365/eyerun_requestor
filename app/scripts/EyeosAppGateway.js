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

define(function() {

    function EyeosAppGateway(innerRequestor, pWindow) {
        this._innerRequestor = innerRequestor;
        this.window = pWindow || window;
    }

    EyeosAppGateway.closeAppEvent = function() {
        return "/eyeosapp_closed";
    };

    EyeosAppGateway.prototype.isChromeInstalled = function(fp) {
        this._innerRequestor.sendRequest("/eyeosapp_is_chrome_installed", null, function() {
            fp(true);
        }, function() {
            fp(false);
        });
    };

    EyeosAppGateway.prototype.openApp = function(appUrl) {
        this._innerRequestor.sendRequest("/eyeosapp_open_app/"+encodeURIComponent(appUrl));
    };

    EyeosAppGateway.prototype.closeApp = function() {
	    var closeAppEvent = EyeosAppGateway.closeAppEvent();
        var eyeRunAccess = this.window.open(this._innerRequestor.getEyeRunLocation() + closeAppEvent);
        eyeRunAccess.close();
    };

    return EyeosAppGateway;
});

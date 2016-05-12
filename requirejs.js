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

module.exports = {
	options: {
		baseUrl: 'app',
		name: 'src/main',
		paths: {
			src: 'scripts',
			eyeosAuthClient: 'scripts',
			jquery: '../bower_components/jquery/dist/jquery.min'
		},
		optimizeAllPluginResources: true,

		optimize: 'none',

		wrap: true,
		onBuildWrite: function (moduleName, path, contents) {
			//repace generated name on main "define" in order to use it by other libs
			return contents.replace(/'src\/main',/g, '');
		}
	},
	debug: {
		options: {
			out: "<%= dirs.dist %>/<%= pkg.name %>.js"
		}
	},
	release: {
		options: {
			out: "<%= dirs.dist %>/<%= pkg.name %>.min.js",
			optimize: 'uglify'
		}
	}
};

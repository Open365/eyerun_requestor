module.exports = function(grunt) {
	require("eyeos-gruntfile")(grunt, "eyerun_requestor", __dirname + "/test", null, null, null, __dirname + "/requirejs.js");

	grunt.config('browserify', {
		debug: {
			options: {
				transform: ['deamdify'],
				browserifyOptions: {
					standalone: '<%= pkg.name %>'
				}
			},
			src: '<%= dirs.app %>/scripts/<%= pkg.name %>.js',
			dest: '<%= dirs.dist %>//<%= pkg.name %>.js'
		},
		release: {
			options: {
				transform: ['deamdify'],
				browserifyOptions: {
					standalone: '<%= pkg.name %>'
				},
				plugin: [ [ 'minifyify', {map: false } ] ]
			},
			src: '<%= dirs.app %>/scripts/<%= pkg.name %>.js',
			dest: '<%= dirs.dist %>/<%= pkg.name %>.min.js'
		}
	});

	grunt.registerTask('build-client', 'Generating build', function (target) {
		if (!target) {
			grunt.task.run(['browserify:release', 'browserify:debug']);
		} else {
			grunt.task.run('browserify:'+target); //release or debug
		}
	});
};


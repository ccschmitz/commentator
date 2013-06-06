/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>',
    // Task configuration.
    watch: {
      karma: {
        files: ['lib/*.js', 'test/*.spec.js'],
        tasks: ['karma:unit:run']
      },
      js: {
        options: { livereload: true },
        files: ['lib/*.js'],
        tasks: ['uglify']
      },
      css: {
        options: { livereload: true },
        files: ['css/sass/*.scss'],
        tasks: ['sass:dev']
      },
      html: {
        options: { livereload: true },
        files: ['example/index.html'],
        tasks: ['uglify']
      },
      str2js: {
        options: { livereload: true },
        files: ['templates/template.html', 'css/main.css'],
        tasks: ['str2js:build']
      }
    },
    sass: {
      dev: {
        files: {
          'css/main.css': 'css/sass/main.scss'
        }
      }
    },
    uglify: {
      options: {
        beautify: true,
        mangle: false
      },
      compress: {
        files: {
          'build/build.js': [
            'vendor/sockjs.js',
            'vendor/rangy-core.js',
            'vendor/rangy-cssclassapplier.js',
            'vendor/rangy-highlighter.js',
            'vendor/rangy-textrange.js',
            'lib/main.js',
            'lib/comments.js',
            'lib/dialog.js',
            'lib/templates.js',
            'lib/utils.js'
            ]
        }
      }
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        background: true
      }
    },
    str2js: {
      options: {
        namespace: 'CMNTTMPL'
      },
      build: {
        'lib/templates.js': ['templates/template.html', 'css/main.css']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-string-to-js');

  // Default task.
  grunt.registerTask('default', ['sass:dev', 'str2js:build', 'uglify']);
  grunt.registerTask('watch-test', ['karma:unit', 'watch:karma']);

};

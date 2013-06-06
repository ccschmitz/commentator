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
      js: {
        options: { livereload: true },
        files: ['*.js', 'lib/*.js', 'test/*.spec.js'],
        tasks: ['exec:build_project', 'exec:test']
      },
      css: {
        options: { livereload: true },
        files: ['css/sass/*.scss'],
        tasks: ['sass:dev']
      },
      html: {
        options: { livereload: true },
        files: ['example.html', 'template.html'],
        tasks: ['exec:build_project']
      }
    },
    sass: {
      dev: {
        files: {
          'css/main.css': 'css/sass/main.scss'
        }
      }
    },
    exec: {
      build_project: {
        command: 'make'
      },
      test: {
        command: 'make test'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task.
  grunt.registerTask('default', ['sass:dev', 'exec:build_project']);

};

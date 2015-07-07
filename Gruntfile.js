module.exports = function(grunt) {

  var appConfig = {
    host: 'localhost',
    port: 1338
  };

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    appConfig: appConfig,

    connect: {
      options: {
        port: appConfig.port,
        livereload: true,
      },

      dist: {
        options: {
          base: 'dist/'
        }
      }
    },

    open: {
      server: {
        path: "http://<%= appConfig.host %>:<%= appConfig.port %>"
      }
    },

    clean: {
      options: {
        dot: true
      },

      dist: {
        src: ['dist/']
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          flatten: true,
          cwd: 'bower_components/fontawesome/font/',
          src: ['*.*'],
          dest: 'dist/fonts',
          filter: 'isFile'
        }]
      }
    },

    sass: {
      options: {
        sourceMap: true
      },

      dist: {
        files: {
          'dist/css/theme.css': 'css/theme.scss'
        }
      }
    },

   postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer-core')({
            browsers: ['last 5 versions', '> 15%', 'IE 10']
          })
        ]
      },

      dist: {
        src: ['dist/css/theme.css']
      }
    },

    cssnext: {
      options: {
        sourcemap: false
      },

      dist: {
        files: {
          'dist/css/theme.css': 'dist/css/theme.css'
        }
      }
    },

    cssbeautifier : {
      files : ['dist/css/theme.css'],
      options : {
        indent: '  ',
        openbrace: 'end-of-line',
        autosemicolon: true
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },

      target: {
        files: {
          'dist/css/theme.min.css': ['dist/css/theme.css'],
        }
      }
    },

    bowerRequirejs: {
      all: {
        rjsConfig: 'js/main.js',
        options: {
          exclude: [
            'fontawesome'
          ]
        }
      }
    },

    uglify: {
      dist: {
        options: {
          beautify: true
        },

        files: {
          'dist/js/main.min.js': ['js/**/*.js']
        }
      }
    },

    jade: {
      html: {
        files: {
          'dist/': ['index.jade']
        },

        options: {
          client: false,
          pretty: true
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      grunt: {
        files: 'Gruntfile.js'
      },
      sass: {
        files: ['css/**/*.scss'],
        tasks: ['sass', 'postcss', 'cssnext']
      },
      uglify: {
        files: ['js/**/*.js'],
        tasks: ['uglify']
      },
      jade: {
        files: ['**/*.jade'],
        tasks: ['jade']
      }
    }
  });

  grunt.registerTask('compile-css', [
    'sass',
    'postcss',
    'cssnext',
    'copy'
  ]);

  grunt.registerTask('compile-js', [
    'uglify'
  ]);

  grunt.registerTask('compile-html', [
    'jade'
  ]);

  grunt.registerTask('compile-theme', ['compile-css', 'compile-js', 'compile-html']);

  grunt.registerTask('prettify', [
    'cssbeautifier',
    'cssmin'
  ]);

  grunt.registerTask('preview', [
    'compile-theme',
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('default', ['clean', 'preview']);
  grunt.registerTask('compile', ['clean', 'compile-theme']);
  grunt.registerTask('ship', ['clean', 'compile', 'prettify']);
}

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
        // src: ['dist/']
      }
    },

    copy: {
      src: {
        files: [{
          expand: true,
          dot: true,
          flatten: true,
          src: ['bower_components/font-awesome/fonts/*', 'src/fonts/*'],
          dest: 'dist/fonts/',
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
          'dist/css/main.min.css': 'src/css/main.scss'
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
        src: ['dist/css/main.min.css']
      }
    },

    cssnext: {
      options: {
        sourcemap: false
      },

      dist: {
        files: {
          'dist/css/main.min.css': 'dist/css/main.min.css'
        }
      }
    },

    cssbeautifier : {
      files : ['dist/css/main.min.css'],
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
          'dist/css/main.min.css': ['dist/css/main.min.css'],
        }
      }
    },

    uglify: {
      dist: {
        options: {
          beautify: true
        },

        files: {
          'dist/js/main.min.js': ['src/js/**/*.js']
        }
      }
    },

    jade: {
      html: {
        files: {
          'dist/': ['src/**/*.jade']
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
        files: ['src/css/**/*.scss'],
        tasks: ['sass', 'postcss', 'cssnext']
      },
      uglify: {
        files: ['src/js/**/*.js'],
        tasks: ['uglify']
      },
      jade: {
        files: ['src/*.jade'],
        tasks: ['jade']
      }
    },

    'ftp-deploy': {
      build: {
        auth: {
          host: 'whitmoretearooms.co.uk',
          port: 21,
          authKey: '/.ftppass'
        },
        src: 'app',
        dest: '/public_html/test',
        exclusions: ['**/.DS_Store']
      }
    },

    imagemin: {
      png: {
        options: {
          optimizationLevel: 7
        },
        files: [
          {
            expand: true,
            cwd: 'src/img/',
            src: ['**/*.png'],
            dest: 'dist/img/',
            ext: '.png'
          }
        ]
      },

      jpg: {
        options: {
          progressive: true
        },
        files: [
          {
            expand: true,
            cwd: 'src/img/',
            src: ['**/*.jpg'],
            dest: 'dist/img/',
            ext: '.jpg'
          }
        ]
      }
    },

    svgmin: {
      options: {
        plugins: [
          { collapseGroups: false },
          { removeUnknownsAndDefaults: false }
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/img',
          src: '{,*/}*.svg',
          dest: 'dist/img'
        }]
      }
    }
  });

  grunt.registerTask('compile-css', [
    'sass',
    'postcss',
    'cssnext',
    'imagemin',
    'svgmin',
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
  grunt.registerTask('prepare', ['clean', 'compile-theme', 'prettify']);
  grunt.registerTask('deploy', ['ship', 'ftp-deploy'])
}

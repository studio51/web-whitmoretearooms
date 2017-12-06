module.exports = function(grunt) {

  var mozjpeg = require('imagemin-mozjpeg');
  var appConfig = {
    host: 'localhost',
    port: 1338,
    src_dir: 'src/',
    dist_dir: 'dist/'
  };

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    appConfig: appConfig,

    watch: {
      grunt: {
        files: 'Gruntfile.js'
      },
      sass: {
        files: ['<%= appConfig.src_dir %>css/**/*.scss'],
        tasks: ['sass', 'postcss', 'cssnext']
      },
      uglify: {
        files: ['<%= appConfig.src_dir %>js/**/*.js'],
        tasks: ['uglify']
      },
      jade: {
        files: ['<%= appConfig.src_dir %>**/*.jade'],
        tasks: ['jade']
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            '<%= appConfig.dist_dir %>css/*.css',
            '<%= appConfig.dist_dir %>*.html',
            '<%= appConfig.dist_dir %>img/*.jpg',
            '<%= appConfig.dist_dir %>img/*.png',
            '<%= appConfig.dist_dir %>img/*.PNG',
            '<%= appConfig.dist_dir %>img/*.JPG',
          ],
        },

        options: {
          watchTask: true,
          server: {
            baseDir: appConfig.dist_dir
          },
          debugInfo: true,
          logConnections: true,
          notify: true,
          plugins: [
            {
              module: 'bs-html-injector',
              options: {
                files: '<%= appConfig.dist_dir %>*.html'
              }
            }
          ],
          ghostMode: {
            scroll: true,
            links: true,
            forms: true
          }
        },

        bsReload: {
          all: {
            reload: true
          }
        }
      }
    },

    clean: {
      options: {
        dot: true
      },

      dist: {
        src: ['<%= appConfig.dist_dir %>']
      }
    },

    copy: {
      src: {
        files: [{
          expand: true,
          dot: true,
          flatten: true,
          src: ['bower_components/font-awesome/fonts/*', '<%= appConfig.src_dir %>fonts/*'],
          dest: '<%= appConfig.dist_dir %>fonts/',
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
          '<%= appConfig.dist_dir %>css/main.min.css': '<%= appConfig.src_dir %>css/main.scss'
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
        src: ['<%= appConfig.dist_dir %>css/main.min.css']
      }
    },

    cssnext: {
      options: {
        sourcemap: false
      },

      dist: {
        files: {
          '<%= appConfig.dist_dir %>css/main.min.css': '<%= appConfig.dist_dir %>css/main.min.css'
        }
      }
    },

    cssbeautifier : {
      files : ['<%= appConfig.dist_dir %>css/main.min.css'],
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
          '<%= appConfig.dist_dir %>css/main.min.css': ['<%= appConfig.dist_dir %>css/main.min.css'],
        }
      }
    },

    uglify: {
      dist: {
        options: {
          beautify: true
        },

        files: {
          '<%= appConfig.dist_dir %>js/main.min.js': ['<%= appConfig.src_dir %>js/**/*.js']
        }
      }
    },

    jade: {
      html: {
        files: {
          '<%= appConfig.dist_dir %>': ['<%= appConfig.src_dir %>*.jade']
        },

        options: {
          client: false,
          pretty: true
        }
      }
    },

    'ftp-deploy': {
      build: {
        auth: {
          host: 'whitmoretearooms.co.uk',
          port: 21,
          authKey: '/.ftppass'
        },
        src: 'dist',
        dest: '/public_html',
        exclusions: ['**/.DS_Store']
      }
    },

    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 7,
          use: [mozjpeg()]
        },

        files: [{
          expand: true,
          cwd: '<%= appConfig.src_dir %>img',
          src: ['**/*.{png,jpg,gif,jpeg,JPG,PNG}'],
          dest: '<%= appConfig.dist_dir %>img/'
        }]
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
          cwd: '<%= appConfig.src_dir %>img',
          src: '{,*/}*.svg',
          dest: '<%= appConfig.dist_dir %>img'
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
    // 'copy'
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
    'browserSync',
    'watch'
  ]);

  // grunt.registerTask('default', ['clean', 'preview']);
  grunt.registerTask('default', ['preview']);
  // grunt.registerTask('prepare', ['clean', 'compile-theme', 'prettify']);
  grunt.registerTask('prepare', ['compile-theme', 'prettify']);
  grunt.registerTask('deploy', ['prepare', 'ftp-deploy'])
}

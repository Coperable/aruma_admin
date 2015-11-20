(function () {

    "use strict";
    var LIVERELOAD_PORT, lrSnippet, mountFolder;

    LIVERELOAD_PORT = 35728;

    lrSnippet = require("connect-livereload")({
        port: LIVERELOAD_PORT
    });


    /* var conf = require('./conf.'+process.env.NODE_ENV); */

    mountFolder = function(connect, dir) {
        return connect["static"](require("path").resolve(dir));
    };

    module.exports = function(grunt) {
        var yeomanConfig;
        require("load-grunt-tasks")(grunt);
        require("time-grunt")(grunt);

        /* configurable paths */
        yeomanConfig = {
            app: "app",
            dist: "dist",
            docs: "documentation",
            landing: "landing",
            landingDist: "dist-landing"
        };
        try {
            yeomanConfig.app = require("./bower.json").appPath || yeomanConfig.app;
        } catch (_error) {}
        grunt.initConfig({
            yeoman: yeomanConfig,
            cnf: grunt.file.readJSON('config.json'),
            watch: {
                compass: {
                    files: ["<%= yeoman.app %>/styles/**/*.{scss,sass}"],
                    tasks: ["compass:server"]
                },
                less: {
                    files: ["<%= yeoman.app %>/styles-less/**/*.less"],
                    tasks: ["less:server"]
                },
                gruntfile: {
                    files: ['Gruntfile.js']
                },
                jadeDocs: {
                    files: ["<%= yeoman.docs %>/jade/*.jade"],
                    tasks: ["jade:docs"]
                },
                compassLanding: {
                    files: ["<%= yeoman.landing %>/styles/**/*.{scss,sass}"],
                    tasks: ["compass:landing"]
                },
                jadeLanding: {
                    files: ["<%= yeoman.landing %>/jade/*.jade"],
                    tasks: ["jade:landing"]
                },
                livereload: {
                    options: {
                        livereload: LIVERELOAD_PORT
                    },
                    files: [
                        "<%= yeoman.app %>/index.html",
                        "<%= yeoman.app %>/views/**/*.html", 
                        "<%= yeoman.app %>/styles/**/*.scss", 
                        "<%= yeoman.app %>/styles-less/**/*.less", 
                        ".tmp/styles/**/*.css", 
                        "{.tmp,<%= yeoman.app %>}/scripts/**/*.js", 
                        "<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}", 
                        "<%= yeoman.docs %>/jade/*.jade",
                        "<%= yeoman.landing %>/jade/*.jade",
                        "<%= yeoman.landing %>/styles/**/*.{scss,sass}",
                        "<%= yeoman.landing %>/scripts/**/*.js"
                    ]
                }
            },
            connect: {
                options: {
                    port: 9009,
                    hostname: "localhost"
                },
                livereload: {
                    options: {
                        middleware: function(connect) {
                            return [
                                function(req, res, next) {
                                    res.setHeader('Access-Control-Allow-Origin', '*');
                                    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                                    // don't just call next() return it
                                    return next();
                                },
                                lrSnippet, 
                                mountFolder(connect, ".tmp"), 
                                mountFolder(connect, yeomanConfig.app)
                            ];
                        }
                    }
                },
                docs: {
                    options: {
                        middleware: function(connect) {
                            return [lrSnippet, mountFolder(connect, yeomanConfig.docs)];
                        }
                    }
                },
                landing: {
                    options: {
                        middleware: function(connect) {
                            return [lrSnippet, mountFolder(connect, yeomanConfig.landing)];
                        }
                    }
                },
                test: {
                    options: {
                        middleware: function(connect) {
                            return [mountFolder(connect, ".tmp"), mountFolder(connect, "test")];
                        }
                    }
                },
                dist: {
                    options: {
                        middleware: function(connect) {
                            return [mountFolder(connect, yeomanConfig.dist)];
                        }
                    }
                }
            },
            open: {
                server: {
                    url: "http://localhost:<%= connect.options.port %>"
                }
            },
            clean: {
                dist: {
                    files: [
                        {
                            dot: true,
                            src: [".tmp", "<%= yeoman.dist %>/*", "!<%= yeoman.dist %>/.git*"]
                        }
                    ]
                },
                landing: {
                    files: [
                        {
                            dot: true,
                            src: [
                                "<%= yeoman.landing %>/vendors"
                            ]
                        }
                    ]
                },
                all: [
                    ".tmp", ".DS_Store", ".sass-cache",
                    "documentation/jade",
                    "<%= yeoman.landing %>/jade", 
                    "readme.md"
                ],
                server: ".tmp"
            },
            jshint: {
                options: {
                    jshintrc: ".jshintrc"
                },
                all: [
                    "Gruntfile.js", 
                    "<%= yeoman.app %>/scripts/aruma/**/*.js",
                    "<%= yeoman.app %>/scripts/core/**/*.js"
                ]
            },
            compass: {
                options: {
                    sassDir: "<%= yeoman.app %>/styles",
                    cssDir: ".tmp/styles",
                    generatedImagesDir: ".tmp/styles/ui/images/",
                    imagesDir: "<%= yeoman.app %>/styles/ui/images/",
                    javascriptsDir: "<%= yeoman.app %>/scripts",
                    fontsDir: "<%= yeoman.app %>/fonts",
                    importPath: "<%= yeoman.app %>/bower_components",
                    httpImagesPath: "styles/ui/images/",
                    httpGeneratedImagesPath: "styles/ui/images/",
                    httpFontsPath: "fonts",
                    relativeAssets: true
                },
                dist: {
                    options: {
                        outputStyle: 'compressed',
                        debugInfo: false,
                        noLineComments: true,
                        sourcemap: false
                    }
                },
                server: {
                    options: {
                        noLineComments: false,
                        sourcemap: false,
                        debugInfo: true
                    }
                },
                forvalidation: {
                    options: {
                        debugInfo: false,
                        noLineComments: false
                    }
                },
                landing: {
                    options: {
                        sassDir: "<%= yeoman.landing %>/styles",
                        cssDir: "<%= yeoman.landing %>/css",
                        sourcemap: false,
                        debugInfo: false,
                        noLineComments: true
                    }
                }
            },
            less: {
                server: {
                    options: {
                        strictMath: true,
                        dumpLineNumbers: true,
                        sourceMap: true,
                        sourceMapRootpath: "",
                        outputSourceFiles: true
                    },
                    files: [
                        {
                            expand: true,
                            cwd: "<%= yeoman.app %>/styles-less",
                            src: "main.less",
                            dest: ".tmp/styles",
                            ext: ".css"
                        }
                    ]
                },
                dist: {
                    options: {
                        cleancss: true,
                        report: 'min'
                    },
                    files: [
                        {
                            expand: true,
                            cwd: "<%= yeoman.app %>/styles-less",
                            src: "main.less",
                            dest: ".tmp/styles",
                            ext: ".css"
                        }
                    ]
                }
            },
            jade: {
                docs: {
                    options: {
                        pretty: true
                    },
                    files: {
                        "<%= yeoman.docs %>/index.html": ["<%= yeoman.docs %>/jade/index.jade"]
                    }
                },
                landing: {
                    options: {
                        pretty: true
                    },
                    files: {
                        "<%= yeoman.landing %>/index.html": ["<%= yeoman.landing %>/jade/index.jade"]
                    }
                }
            },
            useminPrepare: {
                html: "<%= yeoman.app %>/index.html",
                options: {
                    dest: "<%= yeoman.dist %>",
                    flow: {
                        steps: {
                            js: ["concat", "uglifyjs"],
                            css: ["cssmin"]
                        },
                        post: []
                    }
                }
            },
            usemin: {
                html: ["<%= yeoman.dist %>/**/*.html", "!<%= yeoman.dist %>/bower_components/**"],
                css: ["<%= yeoman.dist %>/styles/**/*.css"],
                options: {
                    dirs: ["<%= yeoman.dist %>"]
                }
            },
            htmlmin: {
                dist: {
                    options: {},
                    files: [
                        {
                            expand: true,
                            cwd: "<%= yeoman.app %>",
                            src: ["*.html", "views/*.html", "views/aruma/**/*.html"],
                            dest: "<%= yeoman.dist %>"
                        }
                    ]
                }
            },
            copy: {
                dist: {
                    files: [
                        {
                            expand: true,
                            dot: true,
                            cwd: "<%= yeoman.app %>",
                            dest: "<%= yeoman.dist %>",
                            src: [
                                "favicon.ico",
                                "bower_components/font-awesome/css/*", 
                                "bower_components/font-awesome/fonts/*", 
                                "bower_components/weather-icons/css/*", 
                                "bower_components/weather-icons/font/*", 
                                "bower_components/weather-icons/fonts/*", 
                                "fonts/**/*",
                                "i18n/**/*", 
                                "images/**/*", 
                                "styles/fonts/**/*", 
                                "styles/img/**/*", 
                                "styles/ui/images/*", 
                                "views/**/*"]
                        }, {
                            expand: true,
                            cwd: ".tmp",
                            dest: "<%= yeoman.dist %>",
                            src: ["styles/**", "assets/**"]
                        }, {
                            expand: true,
                            cwd: ".tmp/images",
                            dest: "<%= yeoman.dist %>/images",
                            src: ["generated/*"]
                        }
                    ]
                },
                styles: {
                    expand: true,
                    cwd: "<%= yeoman.app %>/styles",
                    dest: ".tmp/styles/",
                    src: "**/*.css"
                },
                landing: {
                    files: [
                        {
                            expand: true,
                            dot: true,
                            cwd: "<%= yeoman.landing %>/bower_components",
                            dest: "<%= yeoman.landing %>/vendors",
                            src: [
                                "jquery/dist/jquery.min.js",
                                "bootstrap/dist/js/bootstrap.min.js",
                                "jquery-smooth-scroll/jquery.smooth-scroll.min.js",
                                "jquery.stellar/jquery.stellar.min.js",
                                "wow/dist/wow.min.js",
                                "material-design-iconic-font/css/*",
                                "material-design-iconic-font/fonts/*"
                            ]
                        }
                    ]
                }
            },
            concurrent: {
                server: ["compass:server", "copy:styles"],
                dist: ["compass:dist", "copy:styles", "htmlmin"],
                lessServer: ["less:server", "copy:styles"],
                lessDist: ["less:dist", "copy:styles", "htmlmin"]
            },
            ngconstant: {
                options: {
                    name: 'config',
                    dest: '<%= yeoman.app %>/scripts/config.js',
                    wrap: '"use strict";\n\n{%= __ngModule %}',
                    space: '  ',
                    constants: {
                        api_host: '<%= cnf.api_host %>'
                    },
                    values: {
                        debug: true
                    }
                },
                build: {
                }
            },
            cssmin: {
                options: {
                    keepSpecialComments: '0'
                },
                dist: {}
            },
            concat: {
                options: {
                    separator: grunt.util.linefeed + ';' + grunt.util.linefeed
                },
                dist: {}
            },
            uglify: {
                options: {
                    mangle: true,
                    compress: {
                        drop_console: true
                    }
                },
                dist: {}
            }
        });
        grunt.registerTask("server", function(target) {
            grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
            if (target === "dist") {
                return grunt.task.run(["serve:dist"]);
            }
            return grunt.task.run(["serve"]);
        });
        grunt.registerTask("serve", function(target) {
            if (target === "dist") {
                return grunt.task.run(["build", "connect:dist:keepalive"]);
            }
            return grunt.task.run(["clean:server", "concurrent:server", "connect:livereload", "watch"]);
        });
        grunt.registerTask("docs", function() {
            return grunt.task.run(["jade:docs", "connect:docs", "watch"]);
        });
        grunt.registerTask("landing", function() {
            // if (target === "dist") {
            // }
            return grunt.task.run(["clean:landing", "copy:landing", "jade:landing", "compass:landing", "connect:landing", "watch"]);
        });

        grunt.registerTask("build", ["clean:dist", "ngconstant", "useminPrepare", "concurrent:dist", "copy:dist", "cssmin", "concat", "uglify", "usemin"]);
        return grunt.registerTask("default", ["server"]);
    };

})(); 

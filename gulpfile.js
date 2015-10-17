var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var del = require('del');
var vinylPaths = require('vinyl-paths');
var merge = require('merge-stream');
var notifier = require('node-notifier');
var fs = require("fs")

gulp.task('watch', function() {
  plugins.watch('public/**/*.html', function () {
    gulp.start('default');
  } );
  plugins.watch('public/**/*.css', function () {
    gulp.start('default');
  } );
  plugins.watch('public/**/*.js', function () {
    gulp.start('default');
  } );
});

gulp.task('notify', ['build'], function() {
  notifier.notify({ title: "Angular:", message : "Finished Build" });
});

gulp.task('copy', [], function() {
  //gulp.src(['public/assets/fonts/**/*'], {base: 'public'})
  //.pipe(gulp.dest('dist/'));
});

gulp.task('demon', function () {
  plugins.nodemon({
    script: 'server.js',
    ext: 'js'
    //env: {
      //'NODE_ENV': 'development'
    //}
  })
    .on('start', ['watch'])
    //.on('change', ['watch'])
    .on('restart', function () {
      console.log('restarted!');
    });
});


gulp.task('build', ['clean'], function () {
    return gulp.src( [ 'public/index.html' ], {base: 'public'})
        .pipe(plugins.if(isIndexHtml, plugins.usemin({
            html: [plugins.minifyHtml({empty: true})],
            //js: [plugins.ngAnnotate(), plugins.stripDebug(), plugins.uglify(), plugins.rev()],
            js: [],
            vendorjs: [plugins.rev()],
            //vendorcss: [plugins.minifyCss(), 'concat', plugins.rev()],
            css: [plugins.minifyCss(), 'concat', plugins.rev()],
            templateCache: [
                plugins.addSrc(['public/partials/**/*.html']),
                plugins.debug(),
                plugins.angularTemplatecache({
                    module: 'myApp',
                    root: 'partials/'
                }),
                'concat',
                plugins.rev()
            ]
        })))
        .pipe(gulp.dest('dist/'));

    function isIndexHtml (file) {
        return file.path.match('index\\.html$');
    }
});

gulp.task('clean', function() {
    return gulp.src('dist/*')
        .pipe(vinylPaths(del));
});

gulp.task('default', ['notify'], function() {
    gulp.start('copy');
});


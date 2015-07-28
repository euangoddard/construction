import fs from 'fs';
import path from 'path';

import minimist from 'minimist';
import gulp from 'gulp';
import del from 'del';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from './package.json';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const argv = (process.argv.slice(2));
const CONFIG = {
  is_release: !!argv.release
};


// Optimize images
gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

// Copy all files at the root level (app)
gulp.task('copy', () => {
  return gulp.src([
    'app/*',
    '!app/*.html',
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'ios >= 7'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'app/**/*.scss',
    'app/styles/**/*.css'
  ])
    .pipe($.changed('.tmp/styles', {extension: '.css'}))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.minifyCss()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'styles'}));
});


gulp.task('scripts', () => {
  var b = browserify({
    entries: ['app/scripts/main.js'],
    debug: true
  }).transform(babelify);
  return b.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe($.if(CONFIG.is_release, $.uglify()))
    .pipe(gulp.dest('./dist/scripts'))
    .pipe($.size({title: 'scripts'}));
});


gulp.task('html', () => {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// Clean output directory
gulp.task('clean', cb => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}, cb));

gulp.task('serve', ['default'], () => {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    server: 'dist',
    baseDir: 'dist'
  });

  gulp.watch(['app/**/*.html'], ['html', reload]);
  gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['app/images/**/*'], ['copy', reload]);
  gulp.watch(['app/scripts/**/*'], ['scripts', reload]);
});

// Build production files, the default task
gulp.task('default', ['clean'], cb => {
  runSequence(
    'styles',
    ['html', 'scripts', 'images', 'copy'],
    'generate-service-worker',
    cb
  );
});

gulp.task('generate-service-worker', cb => {
  const rootDir = 'dist';

  swPrecache({
    // Used to avoid cache conflicts when serving on localhost.
    cacheId: pkg.name || 'web-starter-kit',
    staticFileGlobs: [
      // Add/remove glob patterns to match your directory setup.
      `${rootDir}/fonts/**/*.woff`,
      `${rootDir}/images/**/*`,
      `${rootDir}/scripts/**/*.js`,
      `${rootDir}/styles/**/*.css`,
      `${rootDir}/*.{html,json}`
    ],
    // Translates a static file path to the relative URL that it's served from.
    stripPrefix: path.join(rootDir, path.sep)
  }, (err, swFileContents) => {
    if (err) {
      cb(err);
      return;
    }

    const filepath = path.join(rootDir, 'service-worker.js');

    fs.writeFile(filepath, swFileContents, err => {
      if (err) {
        cb(err);
        return;
      }

      cb();
    });
  });
});

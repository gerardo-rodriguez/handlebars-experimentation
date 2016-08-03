'use strict';

const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const env = require('gulp-util').env;
const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');

const watchers = [
  {
    match: ['./src/**/*.js'],
    tasks: ['js']
  },
  {
    match: ['./src/**/*.hbs'],
    tasks: ['html']
  }
];

gulp.task('html', () => {
  return gulp.src('./src/pages/*.hbs')
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: ['./src/partials']
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('js', () => {
  return gulp.src('./src/scripts/main.js')
    .pipe(babel())
    .pipe(gulp.dest('./dist'));
});

gulp.task('serve', () => {
  browserSync.init({
    open: false,
    notify: false,
    files: ['./dist/**/*'],
    server: './dist'
  });
});

gulp.task('watch', () => {
  watchers.forEach(item => {
    gulp.watch(item.match, item.tasks);
  });
});

gulp.task('default', ['js', 'html'], done => {
  if (env.dev) {
    gulp.start('serve');
    gulp.start('watch');
  }
  done();
});

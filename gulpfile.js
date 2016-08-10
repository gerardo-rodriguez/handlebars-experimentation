'use strict';

const browserSync = require('browser-sync').create();
const del = require('del');
const env = require('gulp-util').env;
const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');

const config = {
  src: './src',
  dest: './dist',
  watchers: [
    {
      match: ['./src/**/*.hbs'],
      tasks: ['html']
    }
  ]
};

gulp.task('clean', () => del(config.dest));

gulp.task('html', ['clean'], () => {
  return gulp.src(`${config.src}/pages/*.hbs`)
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: [`${config.src}/partials`]
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(config.dest));
});


gulp.task('serve', () => {
  browserSync.init({
    open: false,
    notify: false,
    files: [`${config.dest}/**/*`],
    server: config.dest
  });
});

gulp.task('watch', () => {
  config.watchers.forEach(item => {
    gulp.watch(item.match, item.tasks);
  });
});

gulp.task('default', ['html'], done => {
  if (env.dev) {
    gulp.start('serve');
    gulp.start('watch');
  }
  done();
});

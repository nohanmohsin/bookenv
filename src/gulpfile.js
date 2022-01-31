const { src, dest, watch, series, task } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

task('compile_scss', () => {
    return src('./scss/style.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.' }));
})


task('watch_scss', () => {
    watch('./scss/**/*.scss', series('compile_scss'));
})

task('default', series('watch_scss'));
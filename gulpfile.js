var gulp = require('gulp');

var sass = require('gulp-sass'); // sassコンパイル
var autoprefixer = require('gulp-autoprefixer'); // ベンダープレフィックス付与
var uglify = require('gulp-uglify'); // javascriptファイル圧縮
var plumber = require('gulp-plumber'); // コンパイルエラー時にコネクト解除しない
var notify  = require('gulp-notify'); // エラー時にデスクトップに通知
var browser = require('browser-sync'); // ブラウザーリロード
var imagemin = require('gulp-imagemin'); //画像圧縮
var pug = require('gulp-pug'); // pugコンパイル
var mediaquery = require('gulp-group-css-media-queries'); //メディアクエリをまとめる
var cleanCss = require('gulp-clean-css'); // css圧縮
var sourcemaps = require('gulp-sourcemaps'); // sass用ソースマップ
var watch = require('gulp-watch'); // 監視用
var changed = require('gulp-changed'); // 監視用
var pugInheritance = require('gulp-pug-inheritance'); // 監視用

var baseDir = './resource';
var dist = './public';


// サーバー設定
gulp.task('server', function() {
  browser({
    server: {
      baseDir : dist // 対象ディレクトリ
    }
  });
});


// pugコンパイル
gulp.task('pug', function() {
  // pug配下のファイルをコンパイル。(_から始まるファイルはコンパイルしないようにする)
  gulp.src([baseDir + '/pug/**/*.pug', '!' + baseDir + '/pug/**/_*.pug'])
    //.pipe(changed(dist, { extension: '.html' }))
    //.pipe(pugInheritance({basedir: baseDir + '/pug/'}))
    .pipe(plumber())
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest(dist))
    .pipe(browser.reload({stream:true}));
});


//sassコンパイル、ベンダープレフィックス自動付与
gulp.task('sass', function() {
  gulp.src(baseDir + '/sass/**/*.scss')
    .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')  // デスクトップに通知を出す
    }))
    //.pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }))
    //.pipe(sourcemaps.write({includeContent: false}))
    //.pipe(sourcemaps.init({loadMaps: true}))
    .pipe(autoprefixer())
    .pipe(mediaquery())
    .pipe(cleanCss())
    //.pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest(dist + '/css'))
    .pipe(browser.reload({stream:true}));
});


// javascriptファイルの自動ミニファイド
//  gulp.task('js', function() {
//      gulp.src(['./public/js/*.js','!js/min/**/*.js'])
//          .pipe(plumber())
//          .pipe(uglify())
//          .pipe(gulp.dest('./public/js/min'))
//          .pipe(browser.reload({stream:true}));
//  });


// 画像圧縮
gulp.task('img',function(){
  gulp.src(baseDir + '/img/**/*.{jpg,png,gif,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest(dist + '/img/'));
});


//デフォルトタスク
gulp.task('default', ['server'], function () {
  // imgファイルに変更があったら実行。
  watch([baseDir + '/img/**/*.{jpg,png,gif,svg}'], function(){
    gulp.start(['img']);
  });

  // sassファイルに変更があったら実行。
  watch([baseDir + '/sass/**/*.scss'], function(){
    gulp.start(['sass']);
  });

  // pugファイルに変更があったら実行。
  watch([baseDir + '/pug/**/*.pug'], function(){
    gulp.start(['pug']);
  });
});

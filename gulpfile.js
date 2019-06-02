const gulp = require("gulp");                         // gulpプラグインの読み込み
const sass = require("gulp-sass");                    // Sassをコンパイルするプラグインの読み込み
const autoprefixer = require('gulp-autoprefixer');    //ベンダープレフィックス
const gcmq = require('gulp-group-css-media-queries'); //CSSメディアクエリー整理
const plumber = require('gulp-plumber');              //watch中にエラー防止
const notify = require('gulp-notify');                //gulpタスク実行中にエラーが出たらデスクトップ通知

// style.scssの監視タスクを作成する
gulp.task("sass", function() {
  return (
    gulp
      .src("resource/sass/**/*.scss", { sourcemaps: true })
      .pipe(plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      }))
      .pipe(sass({ outputStyle: 'expanded' })) // 通常:expanded, 圧縮:compressed
      .pipe(gcmq())
      .pipe(autoprefixer({
        browsers: [
          "last 2 versions",
          "ie >= 11"
        ],
        cascade: false,
        grid: true // gridの値にtrueを指定する
      }))
  );
});

//browserSync
const browsersync = require("browser-sync").create();
// サーバーを立ち上げる
gulp.task('build-server', function (done) {
  browsersync.init({
    server: {
      baseDir: "./public/"
    },
    browser: "google chrome"
  });
  done();
  console.log('Server was launched');
});
// ブラウザのリロード
gulp.task('browser-reload', function (done){
  browsersync.reload();
  done();
  console.log('Browser reload completed');
});
// 監視ファイル
gulp.task('watch-files', function(done) {
  gulp.watch("resource/sass/**/*.scss", gulp.task('sass'));
  gulp.watch("./public/**/*.html", gulp.task('browser-reload'));
  gulp.watch("./public/css/*.css", gulp.task('browser-reload'));
//  gulp.watch("./*/*.js", gulp.task('browser-reload'));
  done();
  console.log(('gulp watch started'));
});

// タスクの実行
gulp.task('default', gulp.series('build-server', 'watch-files', function(done){
    done();
    console.log('Default all task done!');
}));
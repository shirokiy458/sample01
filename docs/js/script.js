//スムーススクロール
$(function() {
  var offsetY = -10;
  var time = 500;
  $('a[href^=#]').click(function() {
    var target = $(this.hash);
    if (!target.length) return ;
    var targetY = target.offset().top+offsetY;
    $('html,body').animate({scrollTop: targetY}, time, 'swing');
    window.history.pushState(null, null, this.hash);
    return false;
  });
});

//ページトップボタン（スクロールで表示される）
$(function() {
  var topBtn = $('.footer-toPagetop');
  topBtn.hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      topBtn.fadeIn();
    } else {
      topBtn.fadeOut();
    }
  });
});

//予約へのリンクボタン（スクロールで固定される）
$(function() {
  var reserveBtn = $('.header-btnReserve');
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      reserveBtn.addClass('fixed-reserve');
    } else {
      reserveBtn.removeClass('fixed-reserve');
    }
  });
});
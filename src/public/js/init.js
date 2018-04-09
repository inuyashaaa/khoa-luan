(function (cbFn) {
  cbFn(window.jQuery, window)
})(function ($, window) {
  $(homePageLoadReaddy)

  function homePageLoadReaddy () {
    var $aboutUs = $('.about-us-header')
    $(window).on('load', pageLoadding)
    $aboutUs.on('click', scollToAboutUs)

    $('.parallax').parallax()
    $('.modal').modal({
      opacity: 0.6
    })
    $('.block_slidedown:eq(0)').slideDown('slow')
    $('.block_slidedown:eq(1)').slideDown('slow')
    $('.block_slidedown:eq(2)').slideDown(2000)
    $('.slider').slider()
    $('.dropdown-button').dropdown({
      belowOrigin: true
    })
    function scollToAboutUs (e) {
      $('html, body').animate({
        scrollTop: 565
      }, 'slow')
    }

    function pageLoadding () {
      setTimeout(function () {
        $('.page-loader').fadeOut()
      }, 100)
    }
  }
})

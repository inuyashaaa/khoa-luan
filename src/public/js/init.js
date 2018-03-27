(function (cbFn) {
  cbFn(window.jQuery, window)
})(function ($, window) {
  $(homePageLoadReaddy)

  function homePageLoadReaddy () {
    $('.parallax').parallax()
    $('.modal').modal({
      opacity: 0.6
    })

    var $aboutUs = $('.about-us-header')

    $aboutUs.on('click', scollToAboutUs)

    function scollToAboutUs (e) {
      $('html, body').animate({
        scrollTop: 565
      }, 'slow')
    }
    // $('.button-collapse').sideNav()
    // $('.block_slidedown:eq(0)').slideDown('slow')
    // $('.block_slidedown:eq(1)').slideDown('slow')
    // $('.block_slidedown:eq(2)').slideDown(2000)
  }
})

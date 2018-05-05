(function (cbFn) {
  cbFn(window.jQuery, window.swal, window)
})(function cbFn ($, swal, window) {
  $(listNewsPageReady)

  function listNewsPageReady () {
    var EVENT_DELETE_NEWS = 'delete:news'

    var $buttonDeleteNews = $('.btn-delete-news')
    var $newsChanel = $('.list-news')
    var $searchTermInput = $('[name=term]')
    var $switchSearchButton = $('.zmdi-search')
    var currentStateFilter = $('[data-activestate]').data('activestate')
    var isFilterAllNews = currentStateFilter === ''
    var templateUnpublisedState = $('[data-template-unpublised-state]')
      .data('template-unpublised-state')
    var $dataQuestionDeleteNews = $('#question-news')
    var deleteTitle = $dataQuestionDeleteNews.attr('delete-news-title')
    var deleteText = $dataQuestionDeleteNews.attr('delete-news-text')
    var deleteConfirm = $dataQuestionDeleteNews.attr('delete-news-confirm')
    var deleteCancel = $dataQuestionDeleteNews.attr('delete-news-cancel')

    if ($searchTermInput.val().trim() !== '') {
      $switchSearchButton.trigger('click')
    }

    $buttonDeleteNews.on('click', showConfirm)
    $newsChanel.on(EVENT_DELETE_NEWS, sendRequestDeleteNews)

    function showConfirm (event) {
      event.preventDefault()
      var $btnCurrentDelete = $(event.currentTarget)
      var idNews = $btnCurrentDelete.attr('data-idNews')
      var url = $btnCurrentDelete.attr('href')
      var showPopupDeleteQuestion = swal({
        title: deleteTitle,
        text: deleteText,
        type: 'warning',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger',
        confirmButtonText: deleteConfirm,
        cancelButtonClass: 'btn btn-secondary',
        cancelButtonText: deleteCancel
      })
      showPopupDeleteQuestion
        .then(triggerEvent)
        .catch(errorHandling)
      function triggerEvent () {
        $newsChanel.trigger(EVENT_DELETE_NEWS, [idNews, url])
      }
    }

    function sendRequestDeleteNews (event, idNews, url) {
      var $news = $('.card-' + idNews)
      var $hideOnUnPulised = $news.find('.hide-on-unpublised')
      var $stateHtml = $news.find('.__state__')
      var sendRequest = $.ajax({
        type: 'DELETE',
        url: url
      })
      sendRequest
        .done(alertSuccess)
        .done(hideNews)
        .done(renderUnPublishState)
        .fail(console.log)

      function hideNews () {
        if (!isFilterAllNews) {
          $news.parent().hide('slow')
        }
      }

      function renderUnPublishState () {
        if (isFilterAllNews) {
          $news.addClass('card-outline-danger')
          $stateHtml.replaceWith(templateUnpublisedState)
          $hideOnUnPulised.remove()
        }
      }
    }

    function alertSuccess () {
      swal({
        title: 'Done',
        type: 'success',
        timer: 1200,
        showConfirmButton: false
      })
    }
    function errorHandling (resp) {
      if (resp === 'cancel' || resp === 'overlay' || resp === 'esc') {
      } else {
        console.log(resp)
      }
    }
  }
})

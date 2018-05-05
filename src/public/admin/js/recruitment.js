(function (cbFn) {
  cbFn(window.jQuery, window.swal)
})(function cbFn ($, swal) {
  $(recruitmentPageReady)

  function recruitmentPageReady () {
    var $formJob = $('#formJob')
    var $btnJobDone = $('.btn-job-done')
    var $searchTerm = $('input[name=term]')
    var $searchInput = $('.zmdi-search')
    var hasTerm = $searchTerm.val()
    var $dataQuestionJobDone = $('#data-question')
    var stateListJobs = $dataQuestionJobDone.attr('data-state')
    var isListAllJobs = stateListJobs === ''
    var questionDoneTitle = $dataQuestionJobDone.attr('data-ques-title')
    var questionDoneText = $dataQuestionJobDone.attr('data-ques-text')
    var questionDoneSuccess = $dataQuestionJobDone.attr('data-success')
    var $dataQuestionAddJob = $('#data-question-add-job')
    var questionAddJobTitle = $dataQuestionAddJob.attr('data-ques-title')
    var questionAddJobText = $dataQuestionAddJob.attr('data-ques-text')
    var questionAddJobConfirm = $dataQuestionAddJob.attr('data-ques-confirm')
    var questionAddJobCancel = $dataQuestionAddJob.attr('data-ques-cancel')
    var $inputTitle = $('[name=title]')
    var $slugJob = $('#slug-job')

    if (hasTerm) {
      if ($searchTerm.val().trim() !== '') {
        $searchInput.trigger('click')
      }
    }

    $formJob.on('submit', popupPushlishOnCreateJob)
    $btnJobDone.on('click', updateJobDone)
    $inputTitle.on('blur', autoFillSlug)

    function autoFillSlug () {
      var title = $inputTitle.val()
      var language = detectLanguage(title)
      var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + language + '&tl=en&dt=t&q=' + title
      $.ajax({
        type: 'GET',
        url: url
      }).done(function (data) {
        var newTitle = data[0][0][0]
        $slugJob.val(generateSlug(newTitle))
      })
        .fail(console.log)
    }// autoFillSlug
    function popupPushlishOnCreateJob (event) {
      event.preventDefault()
      var $stateJob = $('[name=state]')
      var PUBLISH_STATE = 1
      var showPopupPublishQuestion = swal({
        title: questionAddJobTitle,
        text: questionAddJobText,
        type: 'question',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-primary',
        confirmButtonText: questionAddJobConfirm,
        cancelButtonClass: 'btn btn-secondary',
        cancelButtonText: questionAddJobCancel
      })
      showPopupPublishQuestion
        .then(
          agree => { if (agree) { setPublishJob() } },
          dismiss => { if (dismiss === 'cancel') { setDraftJob() } })
        .catch(console.log)
      function setPublishJob () {
        $stateJob.val(PUBLISH_STATE)
        event.currentTarget.submit()
      }
      function setDraftJob () {
        event.currentTarget.submit()
      }
    }
    function updateJobDone (event) {
      event.preventDefault()
      var $btnDone = $(event.currentTarget)
      var url = $btnDone.attr('href')
      var $recruitment = $btnDone.parents('div .card')
      var $statusIcon = $recruitment.find('li.status-cv')
      var message = $btnDone.data('message')
      var showPopupQuestionJobDone = swal({
        title: questionDoneTitle,
        text: questionDoneText,
        type: 'question',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-primary',
        confirmButtonText: 'Yes',
        cancelButtonClass: 'btn btn-secondary'
      })

      showPopupQuestionJobDone
        .then(sendUpdateRequest)
        .catch(errorHandling)
      function sendUpdateRequest () {
        return $.ajax({
          type: 'DELETE',
          url
        })
          .done(redrawCard)
          .done(hideNews)
          .fail(console.log)
      }
      function hideNews () {
        if (!isListAllJobs) {
          $recruitment.parent().hide('slow')
        }
      }
      function redrawCard () {
        alertSuccess()
        $recruitment.removeClass()
        $recruitment.addClass('card')
        $statusIcon.removeClass()
        $statusIcon.html("<i class='zmdi zmdi-notifications-none'></i>" + message)
        $btnDone.hide('slow')
      }
    }
    function alertSuccess () {
      swal({
        title: questionDoneSuccess,
        type: 'success',
        timer: 1200,
        showConfirmButton: false
      })
    }
    function errorHandling (resp) {
      if (resp === 'cancel' || resp === 'esc') {
      } else {
        console.log(resp)
      }
    }
  }
})

function generateSlug (slugString) {
  if (slugString.trim() === '') {
    return ''
  }
  var aliasSlugString = changeAlias(slugString)
  var date = new Date()
  var slug = (aliasSlugString + '-' + date.getTime())
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\-\-+/g, '-')
    .replace(/.html/g, '')
  return slug + '.html'
}

function changeAlias (alias) {
  alias = alias || ''
  return alias
    .toLowerCase()
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\|\·/g, ' ')
    .replace(/ + /g, ' ') // whitespace to one space
    .trim()
}

function detectLanguage (str) {
  var patternJa = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g
  var hasJapanChar = patternJa.test(str)

  if (hasJapanChar) {
    return 'ja'
  }
  return 'vi'
}

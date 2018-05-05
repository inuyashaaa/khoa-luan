(function (cbFn) {
  cbFn(window.jQuery, window)
})(function cbFn ($, window) {
  $(resumesPageReady)

  function resumesPageReady () {
    var $jobSelect = $('.recruitment-group .job-select')
    var $typeResume = $('.type-resumes .type-select')
    var $approve = $('.card .card-block .approved')
    var $reject = $('.card .card-block .reject')
    var $storage = $('.card .card-block .storage')
    var $btn = $('.form-group .btn')
    var $resumeChanel = $('.notes')
    var EVENT_APPROVED = 'resume:approve'
    var EVENT_REJECTED = 'resume:reject'
    var EVENT_PENDING = 'resume:pending'

    $resumeChanel.on(EVENT_APPROVED, drawSuccessOutline)
    $resumeChanel.on(EVENT_APPROVED, drawApproveStatus)
    $resumeChanel.on(EVENT_REJECTED, drawDangerOutline)
    $resumeChanel.on(EVENT_REJECTED, drawRejectStatus)
    $resumeChanel.on(EVENT_PENDING, drawInfoOutline)
    $resumeChanel.on(EVENT_PENDING, drawPending)

    $btn.on('click', getResumes)
    $approve.on('click', updateResume)
    $reject.on('click', updateResume)
    $storage.on('click', updateResume)

    function drawStatus (resumeId, content, classText) {
      var $statusLi = $('.resume-' + resumeId).find('li[data-resumeStatus=cv-status]')
      $statusLi.removeClass()
      $statusLi.html("<i class='zmdi zmdi-notifications-none'></i>" + content)
      $statusLi.addClass(classText)
    }
    function _drawOutline (resumeId, outlineClass) {
      var $card = $('.resume-' + resumeId).find('.card')
      $card.removeClass()
      $card.addClass(outlineClass)
    }
    function getResumes (event) {
      event.preventDefault()
      var currentJob = $jobSelect.find('option:selected')
      var currentTypeResume = $typeResume.find('option:selected')
      var jobId = currentJob.val()
      var typeResume = currentTypeResume.val()
      var params = {id: jobId, status: typeResume}
      var query = $.param(params)
      window.location.href = '?' + query
    }
    function updateResume (event) {
      event.preventDefault()
      var $storageClick = $(event.currentTarget)
      var resumesId = $storageClick.attr('data-resumeId')
      var url = $storageClick.attr('href')
      var status = $storageClick.attr('data-resumeStatus')
      var message = $storageClick.attr('data-message')
      var sendPostRequest = $.post(url, {
        id: resumesId,
        status: status
      })
      sendPostRequest
        .done(function () {
          if (status === '1') {
            $resumeChanel.trigger(EVENT_APPROVED, [resumesId, message])
          }
          if (status === '2') {
            $resumeChanel.trigger(EVENT_REJECTED, [resumesId, message])
          }
          if (status === '0') {
            $resumeChanel.trigger(EVENT_PENDING, [resumesId, message])
          }
        })// addOutLineResume(status, $card, $updateStatus)
        .fail(console.log)
    }
    function drawSuccessOutline (event, resumeId) {
      _drawOutline(resumeId, 'card card-outline-success')
    }
    function drawDangerOutline (event, resumeId) {
      _drawOutline(resumeId, 'card card-outline-danger')
    }
    function drawInfoOutline (event, resumeId) {
      _drawOutline(resumeId, 'card')
    }
    function drawApproveStatus (event, resumeId, message) {
      drawStatus(resumeId, message, 'text-success')
    }
    function drawRejectStatus (event, resumeId, message) {
      drawStatus(resumeId, message, 'text-danger')
    }
    function drawPending (event, resumeId, message) {
      drawStatus(resumeId, message, '')
    }
  }
})

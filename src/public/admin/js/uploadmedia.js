(function (cbFn) {
  cbFn(window.jQuery)
})(function cbFn ($) {
  $(uploadImage)
  function uploadImage () {
    $('#datatable').DataTable()

    var $url = $('#url').attr('action')
    var $linkfile = $('#linkfile')
    var $progress = $('#progress')
    var $alert = $('#alert')
    var $btnCopy = $('#btnCopy')
    $('#mediaField').on('change', function (e) {
      $progress.addClass('process')
      var form = new FormData()
      var image = this.files[0]
      form.append('media', image)
      $.ajax({
        xhr: function () {
          var xhr = new window.XMLHttpRequest()
          xhr.upload.addEventListener('progress', function (evt) {
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total
              percentComplete = parseInt(percentComplete * 100)
              $('.progress-bar').css('width', percentComplete + '%')
              $('.progress-bar').html('<br>' + percentComplete + '%')
              if (percentComplete === 100) {
              }
            }
          }, false)
          return xhr
        },
        url: $url,
        type: 'POST',
        data: form,
        contentType: false,
        processData: false
      })
        .done(function (data) {
          $alert.removeClass('d-none', 1000)
          $linkfile.val(data)
        })
        .fail(console.log)
    })

    $btnCopy.on('click', copyText)
    function copyText () {
      $linkfile.select()
      document.execCommand('Copy')
      $btnCopy.tooltip('hide')
      .attr('data-original-title', 'Copied')
      .tooltip('show')
    }
  }
})

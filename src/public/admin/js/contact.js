(function (cbFn) {
  cbFn(window.jQuery)
})(function cbFn ($) {
  $(contactPageReady)
  function contactPageReady () {
    $('#table-contact').DataTable()
    var modalEdit = $('#modal-edit')
    var modalDel = $('#modal-del')
    modalEdit.on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var currentRow = button.closest('tr')
      var id = currentRow.find('td:eq(0)').text()
      var inquiry = currentRow.find('td:eq(1)').text()
      var name = currentRow.find('td:eq(2)').text()
      var email = currentRow.find('td:eq(4)').text()
      var message = currentRow.find('td:eq(6)').text()
      modalEdit.find('#contentRep').val('')
      modalEdit.find('#titleRep').val('')
      var data = {'id': id, 'inquiry': inquiry, 'name': name, 'email': email, 'message': message}
      var modal = $(this)
      $.each(data, function (key, value) {
        modal.find('.modal-body [target="' + key + '"] span').text(value)
      })
    })

    modalEdit.find('#sentform').click(sentdata)
    function sentdata () {
      var idContact = modalEdit.find('.modal-body [target=id] span').text()
      var titleRep = modalEdit.find('#titleRep').val()
      var contentRep = modalEdit.find('#contentRep').val()
      var routePost = $(this).attr('actionTo')
      var icon = $(this)
      if (contentRep.length <= 10 || titleRep.length <= 10) {
        alert('Title, Message reply more than 10 characters')
        return false
      }

      $.ajax({
        url: routePost,
        type: 'POST',
        data: {id: idContact, contentRep: contentRep, titleRep: titleRep},
        beforeSend: function () {
          icon.prop('disabled', true)
          icon.html('<span><i class="zmdi zmdi-spinner zmdi-hc-fw"></i> <span>Loading</span></span>')
        }
      })
      .done(function (res) {
        icon.html('Reply')
        icon.prop('disabled', false)
        modalEdit.modal('hide')
        if (res.status === 'success') {
          notify('success', res.message)
        } else {
          notify('danger', res.message)
        }
      })
      .fail(console.log)
    }
    var currentRow
    modalDel.on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      currentRow = button.closest('tr')
      var id = currentRow.find('td:eq(0)').text()
      $(this).find('.modal-body p strong').text(id)
    })

    modalDel.find('#delSubmit').click(delfunc)
    function delfunc () {
      var idContact = modalDel.find('.modal-body p strong').text()
      var routeDel = $(this).attr('actionTo')
      var icon = $(this)
      $.ajax({
        url: routeDel,
        type: 'POST',
        data: {id: idContact},
        beforeSend: function () {
          icon.prop('disabled', true)
          icon.html('<span><i class="zmdi zmdi-spinner zmdi-hc-fw"></i> <span>Loading...</span></span>')
        }
      })
      .done(function (res) {
        icon.html('Delete')
        icon.prop('disabled', false)
        modalDel.modal('hide')
        if (res.status === 'success') {
          currentRow.remove()
          notify('success', 'Delete Success ID' + res.message)
        } else {
          notify('danger', res.message)
        }
      })
      .fail(function () {
        console.log('error')
      })
    }
  }
})

function notify (type, msg) {
  $.notify({
    title: type,
    message: msg
  }, {
    element: 'body',
    type: type,
    allow_dismiss: true,
    offset: {
      x: 20,
      y: 20
    },
    spacing: 10,
    z_index: 1031,
    delay: 2500,
    timer: 1000,
    url_target: '_blank',
    mouse_over: false,
    template: '<div data-notify="container" class="alert alert-dismissible alert-{1} alert--notify" role="alert">' +
      '<span data-notify="icon"></span> ' +
      '<span data-notify="title">{1}</span> ' +
      '<span data-notify="message">{2}</span>' +
      '<div class="progress" data-notify="progressbar">' +
      '<div class="progress-bar progress-bar-{1}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
      '</div>' +
      '<button type="button" aria-hidden="true" data-notify="dismiss" class="alert--notify__close">Close</button>' +
      '</div>'
  })
}

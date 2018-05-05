(function (cbFn) {
  cbFn(window.jQuery, window)
})(function cbFn ($, window) {
  $(groupsPageReady)

  function groupsPageReady () {
    var $groupChanel = $('body')
    var $addGroupBtn = $('.add-group')
    var $modalAddGroup = $('#modal-default')
    var $groupName = $('[name=group_name]')
    var $divParentInput = $groupName.parent()
    var $messageError = $('.message-error')
    var url = $addGroupBtn.attr('data-url')

    $modalAddGroup.on('shown.bs.modal', resetModal)
    $addGroupBtn.on('click', addNewGroup)
    $groupChanel.on('group:added', hiddenModalAddNewGroup)

    function resetModal (event) {
      $groupName.val('')
      $groupName.focus()
      $messageError.html('')
      $divParentInput.removeClass('has-danger')
    }
    function hiddenModalAddNewGroup (event, resp) {
      if (resp.status_code === 201) {
        $modalAddGroup.modal('hide')
      } else {
        $divParentInput.addClass('has-danger')
        $messageError.html(resp.message)
      }
    }
    function addNewGroup (event) {
      event.preventDefault()
      var groupName = $groupName.val()
      var addingGroup = $.post(url, {
        group_name: groupName
      })
      addingGroup
        .done(notifyAddGroupSuccess)
        .fail(console.log)
      function notifyAddGroupSuccess (resp) {
        $groupChanel.trigger('group:added', resp)
      }
    }
  }
})

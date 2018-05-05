(function (callFunctionWhenLoadScript) {
  callFunctionWhenLoadScript(window.jQuery, window)
})(function callFunctionWhenLoadScript ($, window) {
  $(pageCreateNewsReady)

  function pageCreateNewsReady () {
    var $fileButton = $('#imageField')
    var $imagePreview = $('#img-upload')
    var $inputTitle = $('.input-title')
    var $inputSlug = $('.input-slug')
    var $imageAddButton = $('.uploadImgBtn')
    var $imageDisplay = $('.wrap-display-img')
    var $editImage = $('.edit-image-btn')
    var $deleteImage = $('.delete-image-btn')
    var $featureImageInput = $('input[name="image"]')
    var $publishButton = $('.btn-publish')
    var $saveAsDraftButton = $('#btn-save-as-draft')
    var $timePublish = $('#publication-date')
    var $valuePublish = $('.value-publish')
    var $submitNewsButton = $('.btn-submit-news')
    var $dataQuestion = $('#question-publish')
    var questionAddTitle = $dataQuestion.attr('ques-add-title')
    var questionAddText = $dataQuestion.attr('ques-add-text')
    var questionAddConfirm = $dataQuestion.attr('ques-add-confirm')
    var questionAddCancel = $dataQuestion.attr('ques-add-cancel')

    $fileButton
      .on('change', validateInputField)
      .on('change', immidiateShowImage)
      .on('change', uploadImage)
    $imageAddButton.on('click', triggerClickInputFileImage)
    $editImage.on('click', triggerClickInputFileImage)
    $deleteImage.on('click', deleteButtonTriggerClickFileImage)
    $inputTitle.on('blur', autoFillSlug)
    $publishButton.on('click', publishNews)
    $saveAsDraftButton.on('click', confirmSaveAsDraft)

    function validateInputField () {
      var input = $(this)
      var label = input.val().replace(/\\/g, '/').replace(/.*\//, '')
      input.trigger('fileselect', [label])
    }

    function uploadImage (e) {
      var form = new FormData()
      var image = this.files[0]
      var uploadingImag

      form.append('images', image)
      uploadingImag = $.ajax({
        url: '/upload',
        type: 'POST',
        data: form,
        contentType: false,
        processData: false
      })

      uploadingImag
        .done(bindImagePathToNewsForm)
        .done(showImageContainBlock)
        .fail(console.log)

      function bindImagePathToNewsForm (resp) {
        $featureImageInput.val(resp.data.path)
      }
    } // uploadImage

    function showImageContainBlock () {
      $imageDisplay.show()
      $imageAddButton.hide()
    }// showImageContainBlock

    function deleteButtonTriggerClickFileImage () {
      $imageAddButton.css('display', 'block')
      $imageDisplay.css('display', 'none')
      $imagePreview.attr('src', ' ')
    }// deleteButtonTriggerClickFileImage

    function triggerClickInputFileImage (event) {
      $fileButton.trigger('click')
    }

    function immidiateShowImage () {
      if (this.files && this.files[0]) {
        var reader = new FileReader()
        reader.onload = function (e) {
          $imagePreview.attr('src', e.target.result)
        }
        reader.readAsDataURL(this.files[0])
      }
    } // immidiateShowImage

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

    function autoFillSlug () {
      var title = $inputTitle.val()
      var language = detectLanguage(title)
      var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + language + '&tl=en&dt=t&q=' + title
      $.ajax({
        type: 'GET',
        url: url
      }).done(function (data) {
        var newTitle = data[0][0][0]
        $inputSlug.val(generateSlug(newTitle))
      })
        .fail(console.log)
    }// autoFillSlug

    function publishNews (publishNow) {
      var timePost
      if (!publishNow) {
        timePost = new Date().toISOString().split('T')[0]
      } else {
        timePost = $timePublish.val() || new Date().toISOString().split('T')[0]
      }
      $('input[name=state]').val(1)
      var data = `<input type="hidden" name="post_at" value="${timePost}">`
      $valuePublish.html(data)
      $submitNewsButton.trigger('click')
    } // publishNews

    function confirmSaveAsDraft () {
      swal({
        title: questionAddTitle,
        text: questionAddText,
        type: 'question',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-primary',
        confirmButtonText: questionAddConfirm,
        cancelButtonClass: 'btn btn-secondary',
        cancelButtonText: questionAddCancel
      }).then(function () {
        $submitNewsButton.trigger('click')
      }).catch(console.log)
    } // confirmSaveAsDraft

    if (!$timePublish.val()) {
      var timeNow = new Date().toISOString().split('T')[0]
      $timePublish.val(timeNow)
    }
  }// pageCreateNewsReady
}) // callFunctionWhenLoadScript

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

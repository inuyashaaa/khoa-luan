'use strict'

const path = require('path')

const multer = require('koa-multer')
const mkdirp = require('mkdirp')
const publicPath = path.resolve(__dirname, '../../public')

module.exports = initUpload

const allowTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg', 'application/pdf', 'application/msword']
const uploadConfig = {
  fields: 17,
  files: 17,
  fileSize: 100 * 1048576,
  parts: 17
}
const storage = multer.diskStorage({
  destination (req, file, cb) {
    const today = new Date()
    const dd = ('0' + today.getDate()).slice(-2)
    const mm = ('0' + (today.getMonth() + 1)).slice(-2)
    const yyyy = today.getFullYear()
    const uploadPath = path.resolve(__dirname, `../../public/exams/${yyyy}/${mm}/${dd}`)

    mkdirp(uploadPath, err => {
      if (err) console.log(err)
      else cb(null, uploadPath)
    })
  },
  filename (req, { originalname, mimetype }, cb) {
    const nameSegments = originalname.split('.')
    const name = nameSegments[0] || `${Date.now()}`
    const mineTypeSegments = mimetype.split('/')
    const ext = mineTypeSegments[1] || 'jpeg'
    cb(null, `${Date.now()}-${name}.${ext}`)
  }
})
const fileFilter = (req, { mimetype }, cb) =>
  cb(null, Boolean(allowTypes.indexOf(mimetype) > -1))
const uploader = multer({ storage, fileFilter, limits: uploadConfig })

function initUpload (router) {
  router.post('/upload', uploader.single('fileUpload'), (ctx, next) => {
    let data = ctx.req.file
    console.log(data)

    data.link = data.path.replace(publicPath, '')
    ctx.body = {
      success: true,
      message: 'Upload file success',
      data
    }

    return ctx.body
  })
  router.post('/uploadImg', uploader.single('upload'), (ctx, next) => {
    let data = ctx.req.file
    data.link = data.path.replace(publicPath, '')
    const CKEditorFuncNum = ctx.query.CKEditorFuncNum
    console.log(ctx.query)

    ctx.body = `<script type="text/javascript">
      window.parent.CKEDITOR.tools.callFunction('${CKEditorFuncNum}', '${data.link}', '')
    </script>`

    return ctx.body
  })
}

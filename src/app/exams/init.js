'use strict'

const Exams = require('./model')
const History = require('../history/model')
const User = require('../user/model')
const isAdminMiddleWare = require('../auth/ensure-admin.middleware')

module.exports = {
  initExams,
  getAllExamsBySubject
}

function initExams (router) {
  router.get('get:add:exams', '/add-exams.html', isAdminMiddleWare, getFormAddExams)
  router.get('get:do:exams', '/exam', getDoExams)
  router.get('get:edit:exams', '/exams/edit/:slug', isAdminMiddleWare, getEditExams)
  router.post('post:add:exams', '/add-exams', addExams)
  router.post('post:exams:result', '/result', getResultExams)
  router.post('post:edit:exams', '/exams/edit', updateExams)
  router.get('get:delete:exams', '/exams/delete/:id', deleteExams)
}

async function getFormAddExams (ctx) {
  return ctx.render('exams/exams-add', {
    pageTitle: 'Thêm bài thi - Ôn thi đại học trực tuyến'
  })
}

async function getDoExams (ctx) {
  const nameOfExam = ctx.query.nameOfExam
  const subject = ctx.query.subject

  const exam = await Exams.findOne({ name: nameOfExam, subject: subject })

  return ctx.render('exams/exams', {
    pageTitle: 'Làm bài thi - Ôn thi đại học trực tuyến',
    nameOfExam,
    subject,
    exam
  })
}

async function addExams (ctx) {
  let exams = {}
  exams.name = ctx.request.body.name
  exams.school = ctx.request.body.school
  exams.subject = ctx.request.body.subject
  exams.numberOfQuestions = ctx.request.body.numberOfQuestions
  exams.answers = Array.from(ctx.request.body.answers)
  exams.examspath = ctx.request.body.examspath
  exams.level = ctx.request.body.level
  exams.year = ctx.request.body.year

  try {
    const data = await Exams
      .findOne({})
      .select('id')
      .sort({ id: -1 })
      .exec()

    let idExams = 1
    if (data && data.id) {
      idExams = data.id + 1
    }
    exams.id = idExams

    const dataCreate = await Exams.create(exams)
    if (dataCreate) {
      ctx.body = {
        success: true,
        message: 'Create Exams Done!!!',
        data: dataCreate
      }
      return ctx.redirect(`/admin/exams-list.html`)
    }
  } catch (error) {
    ctx.body = {
      success: false,
      message: 'Opp!!! Something went wrong!!!',
      data: error
    }
    return ctx.body
  }
}

async function getEditExams (ctx) {
  const idExam = ctx.params.slug
  const exam = await Exams.findOne({ _id: idExam })

  return ctx.render('exams/exams-edit', {
    pageTitle: exam.title,
    exam
  })
}

async function updateExams (ctx) {
  const idExam = ctx.request.body.idExam
  const name = ctx.request.body.name
  const school = ctx.request.body.school
  const subject = ctx.request.body.subject
  const numberOfQuestions = ctx.request.body.numberOfQuestions
  const year = ctx.request.body.year
  let state = ctx.request.body.state
  console.log(state)

  if (!state) {
    state = false
  }
  try {
    const exam = await Exams.update({ _id: idExam }, { $set: { name, school, subject, numberOfQuestions, year, state } })
    ctx.body = {
      success: true,
      message: 'Update exam success!!!',
      data: exam
    }
    return ctx.redirect(`/admin/exams-list.html`)
  } catch (error) {
    ctx.body = {
      success: false,
      message: 'Opp!!! Something went wrong!!!',
      data: error
    }
    return ctx.body
  }
}
async function getResultExams (ctx) {
  let userAnswer = []
  userAnswer.push(ctx.request.body.q1)
  userAnswer.push(ctx.request.body.q2)
  userAnswer.push(ctx.request.body.q3)
  userAnswer.push(ctx.request.body.q4)
  userAnswer.push(ctx.request.body.q5)
  userAnswer.push(ctx.request.body.q6)
  userAnswer.push(ctx.request.body.q7)
  userAnswer.push(ctx.request.body.q8)
  userAnswer.push(ctx.request.body.q9)
  userAnswer.push(ctx.request.body.q10)
  userAnswer.push(ctx.request.body.q11)
  userAnswer.push(ctx.request.body.q12)
  userAnswer.push(ctx.request.body.q13)
  userAnswer.push(ctx.request.body.q14)
  userAnswer.push(ctx.request.body.q15)
  userAnswer.push(ctx.request.body.q16)
  userAnswer.push(ctx.request.body.q17)
  userAnswer.push(ctx.request.body.q18)
  userAnswer.push(ctx.request.body.q19)
  userAnswer.push(ctx.request.body.q20)
  userAnswer.push(ctx.request.body.q21)
  userAnswer.push(ctx.request.body.q22)
  userAnswer.push(ctx.request.body.q23)
  userAnswer.push(ctx.request.body.q24)
  userAnswer.push(ctx.request.body.q25)
  userAnswer.push(ctx.request.body.q26)
  userAnswer.push(ctx.request.body.q27)
  userAnswer.push(ctx.request.body.q28)
  userAnswer.push(ctx.request.body.q29)
  userAnswer.push(ctx.request.body.q30)
  userAnswer.push(ctx.request.body.q31)
  userAnswer.push(ctx.request.body.q32)
  userAnswer.push(ctx.request.body.q33)
  userAnswer.push(ctx.request.body.q34)
  userAnswer.push(ctx.request.body.q35)
  userAnswer.push(ctx.request.body.q36)
  userAnswer.push(ctx.request.body.q37)
  userAnswer.push(ctx.request.body.q38)
  userAnswer.push(ctx.request.body.q39)
  userAnswer.push(ctx.request.body.q40)
  userAnswer.push(ctx.request.body.q41)
  userAnswer.push(ctx.request.body.q42)
  userAnswer.push(ctx.request.body.q43)
  userAnswer.push(ctx.request.body.q44)
  userAnswer.push(ctx.request.body.q45)
  userAnswer.push(ctx.request.body.q46)
  userAnswer.push(ctx.request.body.q47)
  userAnswer.push(ctx.request.body.q48)
  userAnswer.push(ctx.request.body.q49)
  userAnswer.push(ctx.request.body.q50)

  // so sanh dap an
  try {
    const exam = await Exams.findOne({ name: ctx.request.body.nameOfExam })
    let numberOfTrueAnswer = 0 // số đáp án đúng
    let arrayAnswer = [] // các đáp án đúng
    exam.answers.map((trueAnswer, index) => {
      if (trueAnswer === userAnswer[index]) {
        arrayAnswer.push('True')
        numberOfTrueAnswer++
      } else {
        arrayAnswer.push(trueAnswer)
      }
    })
    let factor = 1 // Gan bang muc Easy
    if (exam.level === 'medium') {
      factor = 1.5
    }
    if (exam.level === 'hard') {
      factor = 2
    }

    // Update point cho user
    const bonusPoint = Math.round((numberOfTrueAnswer / exam.numberOfQuestions) * 10 * factor)
    const score = Math.round((numberOfTrueAnswer / exam.numberOfQuestions) * 10)
    const newPoint = bonusPoint + ctx.req.user.point

    await User.update({ username: ctx.req.user.username }, { point: newPoint })
    const topUser = await User.find({}).sort({ point: -1 })
    let topTenUser = []
    topUser.map(async (user, index) => {
      user.rank = index + 1
      await User.update({ id: user.id }, { rank: index + 1 })
      if (index < 10) {
        topTenUser.push(user)
      }
    })

    const historyData = {
      idExam: exam.id,
      numberOfTrueAnswer,
      userIdCreated: ctx.req.user.id,
      rankUpdated: ctx.req.user.rank,
      bonusPoint,
      level: exam.level,
      subject: exam.subject,
      score,
      name: exam.name,
      school: exam.school
    }
    // Tim xem trong history co exam day hay chua
    const historyExams = await History.findOne({ idExam: exam.id, userIdCreated: ctx.req.user.id })
    if (historyExams) {
      await History.update({ _id: historyExams._id }, {historyData})
    } else {
      await History.create(historyData)
    }

    return ctx.render('exams/result', {
      userAnswer,
      numberOfTrueAnswer,
      arrayAnswer,
      nowPoint: ctx.req.user.point,
      score,
      bonusPoint,
      newPoint,
      trueAnswer: exam.answers,
      examName: exam.name,
      rank: ctx.req.user.rank,
      user: ctx.req.user
    })
  } catch (error) {
    ctx.body = {
      success: false,
      message: 'Opp!!! Something went wrong!!!',
      data: error
    }
    return ctx.body
  }
}

async function getAllExamsBySubject (subject) {
  const exams = await Exams.find({ subject: subject, state: true })
  return exams
}

async function deleteExams (ctx) {
  const idExam = ctx.params.id
  try {
    const news = await Exams.update({ _id: idExam }, { $set: { state: false } })
    ctx.body = {
      success: true,
      message: 'Delete exams success!!!',
      data: news
    }
    return ctx.redirect('back')
  } catch (error) {
    ctx.body = {
      success: false,
      message: 'Opp!!! Something went wrong!!!',
      data: error
    }
    return ctx.body
  }
}

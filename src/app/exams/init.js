'use strict'

const Exams = require('./model')
const History = require('../history/model')
const User = require('../model/user')

module.exports = {
  initExams
}

function initExams (router) {
  router.get('get:add:exams', '/add-exams.html', getFormAddExams)
  router.get('get:do:exams', '/exams', getDoExams)
  router.post('post:add:exams', '/add-exams', addExams)
  router.post('post:exams:result', '/result', getResultExams)
}

async function getFormAddExams (ctx) {
  return ctx.render('exams/exams-add', {
    pageTitle: 'Add new exams'
  })
}

async function getDoExams (ctx) {
  const nameOfExam = ctx.query.nameOfExam
  const subject = ctx.query.subject
  return ctx.render('exams/exams', {
    pageTitle: 'Do Exams',
    nameOfExam,
    subject
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
    console.log(data)

    let idExams = 1
    if (data && data.id) {
      idExams = data.id + 1
    }
    exams.id = idExams
    console.log(exams)

    const dataCreate = await Exams.create(exams)
    if (dataCreate) {
      ctx.body = {
        success: true,
        message: 'Create Exams Done!!!',
        data: dataCreate
      }
      return ctx.body
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

async function getResultExams (ctx) {
  const oldrank = ctx.req.user.rank // rank cu cua user
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
    const exams = await Exams.findOne({ name: ctx.request.body.nameOfExam }).exec()
    let numberOfTrueAnswer = 0 // số đáp án đúng
    let arrayAnswer = [] // các đáp án đúng
    exams.answers.map((trueAnswer, index) => {
      if (trueAnswer === userAnswer[index]) {
        arrayAnswer.push('True')
        numberOfTrueAnswer++
      } else {
        arrayAnswer.push(trueAnswer)
      }
    })
    let factor = 1 // Gan bang muc Easy
    if (exams.level === 'medium') {
      factor = 1.5
    }
    if (exams.level === 'difficult') {
      factor = 2
    }

    // Tim xem trong history co exam day hay chua
    const historyExams = await History.findOne({ idExam: exams.id, userIdCreated: ctx.req.user.id })

    if (historyExams == null) {
      let newPoint = Math.round((factor * numberOfTrueAnswer * 0.2 + ctx.req.user.point) * 1000) / 1000 // new point

      // Update point cho user
      await User.update({ username: ctx.req.user.username }, { point: newPoint })
      const topUser = await User.find({}).sort({ point: -1 }).exec()
      let topTenUser = []
      topUser.map(async (user, index) => {
        user.rank = index + 1
        await User.update({ id: user.id }, { rank: index + 1 }).exec()
        if (index < 10) {
          topTenUser.push(user)
        }
      })

      var data = {
        answersUser: userAnswer, // đáp án người dùng nhập
        numberOfTrueAnswer, // số đáp án đúng
        arrayAnswer, // mảng gồm những câu đúng và sai
        nowPoint: ctx.req.user.point, // point hiện tại của user
        score: Math.round((numberOfTrueAnswer / exams.numberOfQuestions) * 10), // điểm bài thi
        oldrank,
        bonusPoint: Math.round((numberOfTrueAnswer / exams.numberOfQuestions) * 10 * factor),
        newRank: ctx.req.user.rank,
        newPoint: Math.round(ctx.req.user.point + (numberOfTrueAnswer / exams.numberOfQuestions) * 10 * factor),
        trueAnswer: exams.answers,
        examName: exams.name
      }

      const historyData = {
        idExam: exams.id,
        numberOfTrueAnswer: numberOfTrueAnswer,
        userIdCreated: ctx.req.user.id,
        rankUpdated: ctx.req.user.rank,
        bonusPoint: data.bonusPoint,
        level: exams.level,
        subject: exams.subject,
        score: Math.round((numberOfTrueAnswer / exams.numberOfQuestions) * 10),
        name: exams.name,
        school: exams.school
      }

      await History.create(historyData).exec()

      return ctx.render('exams/result', {
        answersUser: data.answersUser,
        numberOfTrueAnswer: data.numberOfTrueAnswer,
        arrayAnswer: data.arrayAnswer,
        nowPoint: data.nowPoint,
        score: data.score,
        bonusPoint: data.bonusPoint,
        newPoint: data.newPoint,
        trueAnswer: data.trueAnswer,
        examName: data.examName,
        rank: data.newRank,
        user: ctx.req.user
      })
      // update rank
    } else {
      var coreData = {
        answersUser: userAnswer, // đáp án người dùng nhập
        numberOfTrueAnswer, // số đáp án đúng
        arrayAnswer, // mảng gồm những câu đúng và sai
        nowPoint: ctx.req.user.point, // poit hiện tại của user
        score: Math.round((numberOfTrueAnswer / exams.numberOfQuestions) * 10), // điểm bài thi
        trueAnswer: exams.answers,
        examName: exams.name,
        rank: ctx.req.user.rank,
        bonusPoint: 0
      }

      var coreHistory = {
        idExam: exams.id,
        numberOfTrueAnswer,
        userIdCreated: ctx.req.user.id,
        level: exams.level,
        subject: exams.subject,
        score: Math.round((numberOfTrueAnswer / exams.numberOfQuestions) * 10),
        name: exams.name,
        school: exams.school
      }

      await History.create(coreHistory)

      return ctx.render('exams/result', {
        answersUser: coreData.answersUser,
        numberOfTrueAnswer: coreData.numberOfTrueAnswer,
        arrayAnswer: coreData.arrayAnswer,
        nowPoint: coreData.nowPoint,
        score: coreData.score,
        trueAnswer: coreData.trueAnswer,
        examName: coreData.examName,
        rank: coreData.rank,
        bonusPoint: coreData.bonusPoint,
        user: ctx.req.user
      })
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

// var getAllExamsOfMath = (cb) => {
//   Exams.find({ subject: 'math' }, { name: 1, _id: 0, level: 1, id: 1 })
//     .exec((err, doc) => {
//       if (err) {
//         cb(err)
//         console.log('err')
//       } else {
//         cb(null, doc)
//         console.log('ok')
//       }
//     })
// }

// var getAllExamsOfPhy = (cb) => {
//   Exams.find({ subject: 'phy' }, { name: 1, _id: 0, level: 1 })
//     .exec((err, doc) => {
//       if (err) {
//         cb(err)
//         console.log('err')
//       } else {
//         cb(null, doc)
//         console.log('ok')
//       }
//     })
// }

// var getAllExamsOfChem = (cb) => {
//   Exams.find({ subject: 'chem' }, { name: 1, _id: 0, level: 1 })
//     .exec((err, doc) => {
//       if (err) {
//         cb(err)
//         console.log('err')
//       } else {
//         cb(null, doc)
//         console.log('ok')
//       }
//     })
// }

// var getAllExamsOfBio = (cb) => {
//   Exams.find({ subject: 'bio' }, { name: 1, _id: 0, level: 1 })
//     .exec((err, doc) => {
//       if (err) {
//         cb(err)
//         console.log('err')
//       } else {
//         cb(null, doc)
//         console.log('ok')
//       }
//     })
// }

// var getAllExamsOfEng = (cb) => {
//   Exams.find({ subject: 'eng' }, { name: 1, _id: 0, level: 1 })
//     .exec((err, doc) => {
//       if (err) {
//         cb(err)
//         console.log('err')
//       } else {
//         cb(null, doc)
//         console.log('ok')
//       }
//     })
// }

// var getExamByName = (examName, cb) => {
//   Exams.findOne({ name: examName })
//     .exec((err, doc) => {
//       if (err) {
//         console.log(err)
//         return cb(err)
//       } else {
//         return cb(null, doc)
//       }
//     })
// }

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // env: 'chest-release-aakze',
  env: 'chest-dev-ut0l4',
  traceUser: true,
})
const wxContext = cloud.getWXContext()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let { api, payload = {}, userInfo: { openId } } = event

  // 获取舔狗日记列表
  if (api === 'getDogDiaryList') {
    const MAX_LIMIT = 100
    const countResult = await db.collection('dogDiary').count()
    const total = countResult.total
    const batchTimes = Math.ceil(total / 100)
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('dogDiary').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }

    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return [...acc, ...cur.data]
    }, [])
  }

  //获取真心话大冒险列表
  else if (api === 'getTruthOrDareList') {
    const MAX_LIMIT = 100
    const countResult = await db.collection('truthOrDare').count()
    const total = countResult.total
    const batchTimes = Math.ceil(total / 100)
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('truthOrDare').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }

    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return [...acc, ...cur.data]
    }, [])
  }

  //获取毒鸡汤列表
  else if (api === 'getPoisoneSoupList') {
    const MAX_LIMIT = 100
    const countResult = await db.collection('poisoneSoup').count()
    const total = countResult.total
    const batchTimes = Math.ceil(total / 100)
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('poisoneSoup').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return [...acc, ...cur.data]
    }, [])
  }

  else if (api === 'getDriftingListByOpenId') {
    console.log({ openId })
    const response1 = await db.collection('driftingList').where({
      authorOpenId: _.eq(openId)
    }).orderBy('createTime', 'desc').get()
    const response2 = await db.collection('driftingList').where({
      participant: _.elemMatch({
        openId: _.eq(openId)
      })
    }).orderBy('createTime', 'desc').get()
    console.log({ response1 }, { response2 })
    return [response1.data, response2.data]
  }

  else if (api === 'getDriftingById') {
    const response = await db.collection('driftingList').where({
      _id: _.eq(payload)
    }).get()
    return response.data[0]
  }

  else if (api === 'createDrifting') {
    const response = await db.collection('driftingList').add({
      data: {
        ...payload,
        authorOpenId: openId,
        authorContent: {}
      }
    })
    return response
  }
  else if (api === 'joinDrifting') {
    const response = await db.collection('driftingList').where({
      _id: _.eq(payload.driftingId)
    }).update({
      data: {
        participant: _.push(payload)
      }
    })
    return response
  }
  // 漂流本所有者确认完成
  else if (api === 'authorOver') {
    const response = await db.collection('driftingList').where({
      _id: _.eq(payload._id)
    }).update({
      data: {
        authorLeaveMessage: payload.authorLeaveMessage,
        overTime: payload.overTime,
        flag: false
      }
    })
    return response
  }
  // 参与者确认完成
  else if (api === 'participantOver') {
    const item = await db.collection('driftingList').where({
      _id: _.eq(payload._id)
    }).get()
    console.log({ item })
    let array = []
    item.data[0].participant.forEach(element => {
      if (element.openId === openId) {
        array.push({
          ...element,
          leaveMessage: payload.leaveMessage,
          courierNumber: payload.courierNumber,
          overTime: payload.overTime,
          flag: false
        })
      } else {
        array.push(element)
      }
    });
    console.log({ array })
    const response = await db.collection('driftingList').where({
      _id: _.eq(payload._id)
    }).update({
      data: {
        participant: array
      }
    })
    return response
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
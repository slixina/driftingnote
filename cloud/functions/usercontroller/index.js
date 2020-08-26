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

   //获取openid
  if (api === 'getOpenId') {
    return openId
  }

  else if (api === 'setUser') {
    const response = await db.collection('user').where({
      openId: _.eq(openId)
    }).get()
    if (response.data.length === 0) {
      let res = await db.collection('user').add({
        data: {
          openId: openId,
          avatarUrl: payload.avatarUrl,
          city: payload.city,
          country: payload.country,
          gender: payload.gender,
          language: payload.language,
          nickName: payload.nickName,
          province: payload.province,
        }
      })
      return res.data
    } else {
      return await updateUser()
    }
  }

  //获取openid
  if (api === 'updateUser') {
    await updateUser()
  }

  async function updateUser() {
    const response = await db.collection('user').where({
        openId: openId
      }).update({
        data: {
          avatarUrl: payload.avatarUrl,
          city: payload.city,
          country: payload.country,
          gender: payload.gender,
          language: payload.language,
          nickName: payload.nickName,
          province: payload.province,
        },
        success: function(res) {
          console.log(res.data)
        }
      })
      return response
  }

 
}
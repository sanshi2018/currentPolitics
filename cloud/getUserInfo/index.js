// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getUserBrowse': {
      return getUserBrowse(event)
    }
    case 'getUserFavor': {
      return getUserFavor(event)
    }

    default:
      break;
  }
}
async function getUserBrowse(event) {
  return cloud.database().collection('currentPolitics_userInfo').where({
    openId: event.openid
  }).field({ browse: true }).get({
    success(res) { console.log("成功", res) },
    fail(error) { console.log("失败", error) }
  })
}
async function getUserFavor(event) {
  return cloud.database().collection('currentPolitics_userInfo').where({
    openId: event.openid
  }).field({
    favor: true
  }).get({
    success(res) { console.log("成功", res) },
    fail(error) { console.log("失败", error) }
  })
}

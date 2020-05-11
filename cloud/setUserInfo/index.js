// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getUserDbID': {
      return getUserDbID(event)
    }
    case 'getUserBrowseByid': {
      return getUserBrowseByid(event)
    }
    case 'userInfoAddBrowse': {
      return userInfoAddBrowse(event)
    }
    case 'userInfoAddFavor': {
      return userInfoAddFavor(event)
    }
    case 'userInfoDelFavor': {
      return userInfoDelFavor(event)
    }
    case 'addUserInfo': {
      return addUserInfo(event)
    }

    default:
      break;
  }
}
async function getUserDbID(event) {
  return cloud.database().collection('currentPolitics_userInfo').field({
    openId: true
  }).where({
    openId: event.openid
  }).get({
    success(res) { console.log("成功", res) },
    fail(error) { console.log("失败", error) }
  })
}
async function getUserBrowseByid(event) {

    return cloud.database().collection('currentPolitics_userInfo').doc(event.id).get({
      success(res) { console.log("成功", res) },
      fail(error) { console.log("失败", error) }
    })


}
async function userInfoAddBrowse(event) {
  return cloud.database().collection('currentPolitics_userInfo').doc(event.id).update({
    data: {
      browse: event.browse
    }
  })
}
async function userInfoAddFavor(event) {
  return cloud.database().collection('currentPolitics_userInfo').doc(event.id).update({
    data: {
      favor: event.favor
    }
  })
}
async function userInfoDelFavor(event) {
  return cloud.database().collection('currentPolitics_userInfo').doc(event.id).update({
    data: {
      favor: event.favor
    }
  })
}
async function addUserInfo(event){
  return cloud.database().collection('currentPolitics_userInfo').add({
    data:{
      browse:[],
      favor:[],
      openId:event.openid,
      _id:event.openid
    }
  })
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getSwitchPic': {
      return getSwitchPic(event)
    }
    case 'getSectionName': {
      return getSectionName(event)
    }
    case 'getSectionPage': {
      return getSectionPage(event)
    }
    case 'getSectionContent': {
      return getSectionContent(event)
    }
    case 'getSectionID': {
      return getSectionID(event)
    }
    case 'addFavor': {
      return addFavor(event)
    }
    case 'sendCritic': {
      return sendCritic(event)
    }
    case 'getNews': {
      return getNews(event)
    }
    default: {
      return
    }
  }
}
async function getSwitchPic(event) {
  return cloud.database().collection('currentPolitics_SwitchPicture').get({
    success(res) { console.log("成功", res) },
    fail(error) { console.log("失败", error) }
  })
}
async function getSectionName(event) {
  return cloud.database().collection('currentPolitics_bookName').get({
    success(res) { console.log("成功", res) },
    fail(error) { console.log("失败", error) }
  })
}
async function getSectionPage(event) {
  return cloud.database().collection('currentPolitics_Content').field({
    SectionImage: true
  }).get({
    success(res) { console.log("成功", res) },
    fail(error) { console.log("失败", error) }
  })
}
async function getSectionContent(event) {
  return cloud.database().collection('currentPolitics_Content').get({
    success(res) { console.log("成功", res) },
    fail(error) { console.log("失败", error) }
  })
}
async function getSectionID(event) {
  return cloud.database().collection('currentPolitics_Content').field({
    _id: true
  }).get({
    success(res) { console.log("成功", res) },
    fail(error) { console.log("失败", error) }
  })
}
//因为删除收藏和添加收藏操作类似(Upade)所有写到了一起
async function addFavor(event) {
  return cloud.database().collection('currentPolitics_Content').doc(event.id).update({
    data: {
      favor_userId: event.openid
    }
  }).then(res=>{console.log("成功")}).catch(res=>{console.log("失败")})
}
async function sendCritic(event){
  return cloud.database().collection('currentPolitics_Content').doc(event.id).update({
    data: {
      userContent: event.content
    }
  }).then(res=>{console.log("成功")}).catch(res=>{console.log("失败")})
}
async function getNews(event) {
  return cloud.database().collection('currentPolitics_News').field({
    result:true
  }).get({
    success(res) { console.log("成功", res) },
    fail(error) { console.log("失败", error) }
  })
}

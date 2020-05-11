// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getSwitchPic': {
      return getSwitchPic(event)
    }
    case 'getNews': {
      return getNews(event)
    }
    default:
      break;
  }
}

async function getSwitchPic(event) {
  return cloud.database().collection('currentPolitics_SwitchPicture').get({
    success(res) { console.log("成功", res) },
    fail(error) { console.log("失败", error) }
  })
}
async function getNews(event) {
  return cloud.database().collection('currentPolitics_News').field({
    result:true
  }).get({
    success(res) { console.log("成功", res) },
    fail(error) { console.log("失败", error) }
  })
}

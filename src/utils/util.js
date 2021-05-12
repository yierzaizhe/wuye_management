import axios from './axios'

/*!
 * 方法：验证手机号
 * 参数：_phone:要验证的手机号
 */
const isPhone = (_phone) => {
  let pattern = /^1[3456789]\d{9}$/;
  return pattern.test(_phone);
}
// 时间戳转换成时间
const timestampToTime = (cjsj) => {
  var date = new Date(cjsj) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = date.getDate() + ' '
  var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}
// oss前缀
const OSSURL = 'http://roma-photo-north2.oss-cn-beijing.aliyuncs.com'

// 封装axios
const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    axios({
        method,
        url,
        data,
      })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default {
  isPhone,
  OSSURL,
  timestampToTime,
  request,
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function getYM(data) {
  const time = new Date((data + '').length == 13 ? data : Number(data) * 1000)
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  return `${year}年${month}月`
}


function getYMD(data) {
  const time = new Date((data + '').length == 13 ? data : Number(data) * 1000)
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDay()
  return `${year}年${month}月${day}日`
}

function getYear(data) {
  const time = new Date((data + '').length == 13 ? data : Number(data) * 1000)
  const year = time ? time.getFullYear() : new Date().getFullYear()
  return year
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const objectUtil = {
  copy(obj) {
    if (typeof obj !== 'object'){
      return obj
    }

    return JSON.parse(JSON.stringify(obj))
  }
}

module.exports = {
  formatTime,
  getYM,
  getYear,
  getYMD,
  objectUtil
}

/**
 * 表格增加一列数据后
 * 表格内容的每一行都添加新增一列 key 的内容，key 对应的数据为 defaultValue
 * @param {Array} list 
 * @param {String} key
 * @param {Any} defaultValue 
 */
export const updateTableData = (list, key, defaultValue) => {
  list.map((i) => i[key] = defaultValue)
  return list
}

/**
 * 表格增加一行数据
 * @param {Array} column 
 * @param {Number} count 
 */
export const insertTableData = (column, count) => {
  let newData = {}
  newData.key = new Date().getTime()
  column.map(c => newData[c.dataIndex] = '0')
  newData.boom = 0;
  newData.game = count + 1;
  return newData
}

/**
 * 表格删除一行数据
 * 处理局数game，保证连贯性
 * @param {Array} data 
 * @param {Any} key 
 */
export const deleteTableData = (data, key) => {
  let result = data.filter((item) => item.key !== key)
  result.map((r, index) => (r.game = index + 1))
  return result
}

/**
 * 计算各Account的total
 * @param {Array[Object]} data 
 * @param {Object} total 
 */
export const calcTotal = (data, total, setting) => {

  Object.keys(total).forEach((key) => {
    total[key] = 0
  })

  data.forEach(item => {
    let pow = setting.bomb ? Math.pow(2, Number(item['boom'])) : 1
    let win = 0
    let winner = ''
    Object.keys(total).forEach((key) => {
      let num = Number(item[key])
      if (num > 1 && num < 5) {
        total[key] -= Number(item[key]) * pow
        win += Number(item[key]) * pow
      } else if (num === 5) {
        if (setting.all) {
          total[key] -= Number(item[key]) * pow * 2
          win += Number(item[key]) * pow * 2
        } else {
          total[key] -= Number(item[key]) * pow
          win += Number(item[key]) * pow
        }
      } else if (num === 0) {
        winner = key
      }
    })
    if (winner.length > 0) {
      total[winner] += win
    }
  })
  return calcAccount(total, setting.money)
}

/**
 * 折换成钱
 * @param {Object} total 
 * @param {String||Number} money 
 */
export const calcAccount = (total, money) => {
  Object.keys(total).forEach((key) => {
    total[key] *= Number(money)
  })
  return total
}

/**
 * 检测是否有某行输入错误
 * @param {Array}} data 
 */
export const wrongRow = (data) => {
  let result = {
    msg: 'no problem',
    code: true, 
    game: ''
  }
  data.forEach(item => {
    delete item.boom;
    let scores = Object.values(item)
    if (scores.indexOf("0") !== scores.lastIndexOf("0")) {
      result.msg = "Several Winners?"
      result.code = false
      result.game = item.game
    }
    if (scores.indexOf("0") === -1) {
      result.msg = "No Winner?"
      result.code = false
      result.game = item.game
    }
  })
  return result;
}
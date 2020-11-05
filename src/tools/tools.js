/**
 * 表格增加一列数据后
 * 表格内容的每一行都添加新增一列 key 的内容，key 对应的数据为 defaultValue
 * @param {Array} list 
 * @param {String} key
 * @param {Any} defaultValue 
 */
export const updateTableData = (list, key, defaultValue) => {
  list.map((i) => {
    i[key] = defaultValue
  })
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
  column.map(c => {
    newData[c.dataIndex] = 0
  })
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
export const calcTotal = (data, total) => {

  Object.keys(total).forEach((key) => {
    total[key] = 0
  })

  data.map(item => {
    Object.keys(total).forEach((key) => {
      total[key] = total[key] + Number(item[key])
    })
  })
  return total

}
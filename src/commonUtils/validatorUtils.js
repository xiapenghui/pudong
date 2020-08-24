/**
 * ElementUI表单数字字段校验
 * @param {Object} rule
 * @param {number} rule.max 最大长度
 * @param {number} [rule.precision] 小数最大位数
 * @param {string} rule.name 字段名称
 * @param {boolean} [rule.acceptPositive] 是否接受正号开头
 * @param {number|string} value 校验值
 * @param {function} callback 校验回调，传递提示信息
 */
function checkNumber ({ max, precision = 0, name, acceptPositive = false }, value, callback) {
  // 将值转为字符串，以使用其索引查找方法
  value += ''
  let pattern = /^(-|\+)?([1-9]\d*(\.?\d+)?|0\.\d*|0)$/g
  // 不接受正号开头
  if (!acceptPositive) {
    pattern = /^(-)?([1-9]\d*(\.?\d+)?|0\.\d*|0)$/g
  }
  const reg = new RegExp(pattern)
  if (value.length > max) {
    callback(new Error(name + '长度不能超过 ' + max + ' 个字符'))
  } else if (!reg.test(value)) {
    callback(new Error(name + '必须是数字'))
  } else if (value.indexOf('.') === value.lastIndexOf('.') && value.indexOf('.') !== -1) {
    if (!precision || precision <= 0) {
      callback(new Error(name + '必须是整数'))
    } else if (value.split('.')[1].length > precision) {
      callback(new Error(name + '小数不能超过 ' + precision + ' 位'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

/**
 * ElementUI表单URI字段校验
 * @param {Object} rule
 * @param {string} rule.name 字段名称
 * @param {number} rule.max 字段长度
 * @param {number|string} value 校验值
 * @param {function} callback 校验回调，传递提示信息
 */
function checkURIPath (rule, value, callback) {
  const pattern = /^\/(([a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])+\/)*([a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])+$/g
  const reg = new RegExp(pattern)
  if (value.length > rule.max) {
    callback(new Error(`${rule.name}长度不得超过${rule.max}字符`))
  } else if (!reg.test(value)) {
    callback(new Error(rule.name + '必须以/开头，必须符合URI规则'))
  } else {
    callback()
  }
}

/**
 * ElementUI表单URI字段校验
 * @param {Object} rule
 * @param {string} rule.name 字段名称
 * @param {number|string} value 校验值
 * @param {function} callback 校验回调，传递提示信息
 */
function checkURL (rule, value, callback) {
  const pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g
  const reg = new RegExp(pattern)
  if (!reg.test(value)) {
    callback(new Error(rule.name + '必须符合URL规则'))
  } else {
    callback()
  }
}

/**
 * ElementUI表单URI字段校验
 * @param {Object} rule
 * @param {string} rule.name 字段名称
 * @param {number|string} value 校验值
 * @param {function} callback 校验回调，传递提示信息
 */
function checkIPv4 (rule, value, callback) {
  let pattern, reg
  const ipv4Reg = new RegExp(
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/g)
  pattern = /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/g
  reg = new RegExp(pattern)
  if (!ipv4Reg.test(value) && !reg.test(value)) {
    callback(new Error(`${rule.name}格式不正确`))
  } else {
    callback()
  }
}

/**
 * ElementUI表单数组字段校验
 * @param {Object} rule
 * @param {number} rule.max 最大长度
 * @param {string} rule.name 字段名称
 * @param {array} value 校验值
 * @param {function} callback 校验回调，传递提示信息
 */
function checkArrayStrLen (rule, value, callback) {
  if (value.join(',').length > rule.max) {
    callback(new Error(rule.name + '长度不能超过 ' + rule.max + ' 个字符'))
  } else {
    callback()
  }
}

export default {
  checkIPv4,
  checkNumber,
  checkURIPath,
  checkURL,
  checkArrayStrLen,
}
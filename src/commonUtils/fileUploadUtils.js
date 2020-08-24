/**
 * 返回文件列表中与指定名称相同的文件的位置
 * @param {Array} fileList 文件列表
 * @param {string} fileName
 */
function checkSameNameInList (fileList, fileName) {
  return fileList.findIndex(data => data.name === fileName)
}

/**
 * 设置文件的MD5值
 * @param {Object} file 文件
 * @param callback 异步回调
 */
function appendMD5IntoFileObject (file, callback) {
  const reader = new FileReader()
  reader.onload = function ({ target: { result } }) {
    file.md5 = CryptoJS.MD5(result).toString()
    typeof callback === 'function' && callback(file)
  }
  reader.readAsBinaryString(blobSlice(file.raw, 0, 10 * 1024 * 1024))
}

/**
 * 截取Blob的部分内容
 * @param blob
 * @param start
 * @param length
 * @returns {*}
 */
function blobSlice (blob, start, length) {
  if (blob.slice) {
    return blob.slice(start, length)
  } else if (blob.webkitSlice) {
    return blob.webkitSlice(start, length)
  } else if (blob.mozSlice) {
    return blob.mozSlice(start, length)
  } else {
    return null
  }
}

const imageSuffix = ['jpg', 'bmp', 'png', 'gif', 'jpeg', 'icon']

/**
 * 判断是否为图片后缀
 * @param suffix 后缀
 */
function isPicture (suffix) {
  if (suffix) {
    return imageSuffix.indexOf(suffix.toLowerCase()) !== -1
  }
  return false
}

export default {
  appendMD5IntoFileObject,
  checkSameNameInList,
  isPicture,
}
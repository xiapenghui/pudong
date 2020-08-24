/**
 * 文件上传成功
 * @param vueIns
 * @param field
 * @param response
 * @param fileList
 */
function handleFileUploadSuccess (vueIns, field, response, fileList) {
  var fileIdArr = []
  fileList.forEach(function (f) {
    fileIdArr.push(f.id || f.response.id)
  })
  vueIns.entity[field] = fileIdArr.join(',')
}

var imageSuffix = ['jpg', 'bmp', 'png', 'gif', 'jpeg', 'icon']

function getFileListFromServer (vueIns, field, fileIds) {
  axiosRequest(commonConfig.sysBackendContext + '/sys/attachment/findByIds', '初始化附件列表', 'GET', { ids: fileIds }).
    then(result => {
      result.forEach(file => {
        // 生成图片的缩略图
        if (imageSuffix.indexOf(file.ext.toLowerCase()) !== -1) {
          downloadFile(file.id, data => {
            getImageBase64(file.ext, data, url => {
              file.url = url
            })
          })
        }
      })
      vueIns[field + 'FileList'] = result
    })
}

/**
 * 获取图片Base64字符串
 * @param type 图片类型
 * @param blob 图片数据
 * @param callback 回调
 */
function getImageBase64 (type, blob, callback) {
  const reader = new FileReader()
  reader.onload = function (event) {
    const dataUrl = event.target.result
    const base64 = dataUrl.split(',')[1]

    callback(`data:image/${type};base64,${base64}`)
  }
  reader.readAsDataURL(blob)
}

/**
 * 获取二进制文件
 * @param id 文件ID
 * @param callback 回调
 */
function downloadFile (id, callback) {
  axiosRequest(commonConfig.sysBackendContext + '/sys/attachment/download', '下载文件', 'GET', { id }, {
    responseType: 'blob',
  }).then(data => callback(data))
}

/**
 * 文件列表变更
 * @param vm Vue实例
 * @param field 所属字段
 * @param file 发生变更的文件
 * @param fileList 变更后的文件列表
 */
function handleFileChange (vm, field, file, fileList) {
  if (file.status === 'ready') {
    // 选择文件校验
    for (var i = 0; i < fileList.length; i++) {
      if (fileList[i].name === file.name && i !== fileList.length - 1) {
        direwolfCommonTips('warning', '相同名称的文件已经被选择')
        fileList.pop()
        return
      }
    }
    vm[field + 'FileList'] = fileList
    // 增加后端服务需要的其他信息
    const reader = new FileReader()
    reader.onload = function (event) {
      const binary = event.target.result
      file.md5 = CryptoJS.MD5(binary).toString()
      var upload = vm.$refs[field + 'Upload']
      upload.data = {
        md5: file.md5,
        id: file.uid,
        name: file.name,
        type: file.raw.type,
        lastModifiedDate: file.raw.lastModified,
        size: file.size,
        workspace: '',
        storeType: 'file',
        path: getFormattedDate('yyyy/MM/dd'),
      }
      // 若需要自动提交或者是照片墙无提交按钮
      if (upload.autoUpload || upload.listType === 'picture-card') {
        vm.$nextTick(function () {upload.submit()})
      }
    }
    reader.readAsBinaryString(blobSlice(file.raw, 0, 10 * 1024 * 1024))
  }
}

/**
 * 点击文件事件
 * @param file 被点击的文件
 */
function handleFilePreview (file) {
  if (file.status !== 'success') {
    direwolfCommonTips('warning', '只有上传成功的文件才能预览或下载')
    return
  }

  file = getAttachmentInfo(file)

  if (imageSuffix.indexOf(file.ext.toLowerCase()) === -1) {
    direwolfCommonConfirm({
      message: '点击确定将文件保存到本地磁盘',
      title: '下载提示',
    }, function () {
      saveFileToLocal(file)
    })
  } else {
    previewPicture(file)
  }
}

/**
 * 删除文件事件
 * @param vueIns
 * @param field
 * @param file 被点击的文件
 * @param fileList 删除后的文件列表
 */
function handleFileRemove (vueIns, field, file, fileList) {
  if (file.status === 'success') {
    // 若是已上传文件，则从服务器删除
    deleteFiles(vueIns, field, [file])
  }
}

/**
 * 清除所有文件
 */
function clearAllFiles (vueIns, field) {
  deleteFiles(vueIns, field, vueIns[field + 'FileList'])
}

/**
 * 组装提示信息
 */
function assembleTip (vueIns, field, tip) {
  var upload = vueIns.$refs[field + 'Upload']
  var fileList = vueIns[field + 'FileList']
  let tips = ''
  // 图片墙默认提示
  if (!tip && upload.listType === 'picture-card') {
    tips = `只能上传图片文件`
  }
  // 文件个数提醒
  tips += ` 限制上传${upload.limit}个文件，当前`
  if (fileList.length > 0) {
    tips += `已选择${upload.fileList.length}个文件`
  } else {
    tips += `未选择任何文件`
  }
  // 文件大小提醒
  if (upload.maxSize > 0) {
    let size = upload.maxSize / 1024
    tips += ` 当前限制选择单个文件大小不得超过`
    if (size < 1) {
      tips += `${upload.maxSize}K`
    } else {
      tips += `${Math.floor(size)}M`
    }
  }
  return tips
}

/**
 * 从服务器删除文件
 * @param vueIns
 * @param field
 * @param fileList 删除后的文件列表
 */
function deleteFiles (vueIns, field, fileList) {
  if (fileList.length > 0) {
    direwolfCommonConfirm({
        message: '确定要删除文件吗？',
        title: '删除提示',
      }, function () {
        var temp = []
        fileList.forEach(function (file) {temp.push(file)})
        temp.forEach(function (file) {
          if (file.size === -1) {
            // 暂不删除服务器文件，因后端数据存储结构不适合删除文件
            // 首先文件通过MD5被复用，不清楚是否有其他位置引用该文件
            // 其次附件表数据与实际文件一一对应，无法通过删除记录使文件引用失效
            axiosRequest(commonConfig.sysBackendContext + '/sys/attachment/deleteAttachment', '删除文件', 'GET',
              { id: file.id }).
              then(function () {removeFileFromData(vueIns, field, file)})
          } else {
            removeFileFromData(vueIns, field, file)
          }
        })
      },
    )
  }
}

/**
 * 从当前data删除数据并触发change事件
 * @param vueIns
 * @param field
 * @param file 被删除文件
 */
function removeFileFromData (vueIns, field, file) {
  var fileIdArr = []
  var idx = -1
  vueIns[field + 'FileList'].forEach(function (f, index) {
    if (file.md5 === f.md5) {
      idx = index
    }
    fileIdArr.push(getAttachmentInfo(f).id)
  })
  vueIns[field + 'FileList'].splice(idx, 1)
  vueIns.entity[field] = fileIdArr.join(',')
}

/**
 * 预览图片
 * @param file
 */
function previewPicture (file) {
  downloadFile(file.id, data => {
    getImageBase64(file.ext, data, url => {
      top.layer.open({
        type: 2,
        area: ['800px', '500px'],
        title: '预览图片',
        maxmin: false,
        content: url,
        btn: ['确定'],
        zIndex: getTopIndex(),
      })
    })
  })
}

/**
 * 预览图片
 * @param file
 */
function saveFileToLocal (file) {
  // 从服务器获取文件
  downloadFile(file.id, data => {
    if (navigator.appVersion.toString().indexOf('.NET') > 0) {
      //IE 10+
      window.navigator.msSaveBlob(data, file.name)
    } else {
      //Firefox, Chrome
      let downloadLink = document.getElementById('downloadLink')
      if (!downloadLink) {
        downloadLink = document.createElement('a')
        downloadLink.id = 'downloadLink'
        downloadLink.style.display = 'none'
        document.body.appendChild(downloadLink)
      }
      downloadLink.href = window.URL.createObjectURL(new Blob([data], { type: data.type }))
      downloadLink.download = file.name
      downloadLink.click()
    }
  })
}

/**
 * 获取后端封装的Attachment信息
 * @param file
 */
function getAttachmentInfo (file) {
  if (file.path) {
    return file
  }
  if (file.response && file.response.path) {
    return file.response
  }
  return {}
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
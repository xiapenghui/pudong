<template>
    <el-upload ref="upload" :auto-upload="false" name="fileInput"
               :headers="{Authorization: $$utils.getAuthorization(), contentType: 'multipart/form-data'}"
               :action="uploadUrl"
               :accept="isPictureCard ? 'image/*' : accept"
               :on-preview="handlePreview"
               :on-remove="handleRemove"
               :on-change="handleChange"
               :on-success="handleSuccess"
               :on-error="handleError"
               :before-upload="handleBeforeUpload"
               :before-remove="handleBeforeRemove"
               :file-list="fileList"
               :disabled="disabled"
               :limit="limit"
               :http-request="uploadFileWithInfo"
               :list-type="listType"
               :on-exceed="handleExceed"
               :data="extraData">
        <el-button v-if="!isPictureCard && !autoUpload && !disabled" class="el-upload__extra-button"
                   size="small" @click="submitUpload" icon="el-icon-upload">开始上传
        </el-button>
        <el-button v-if="!isPictureCard && !disabled" class="el-upload__extra-button" icon="el-icon-delete"
                   size="small" type="danger" @click="clearAllFiles">清空全部
        </el-button>
        <el-button v-if="!isPictureCard && !disabled" slot="trigger" icon="el-icon-plus"
                   size="small">选择文件
        </el-button>
        <i v-if="isPictureCard && !disabled" class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">{{this.assembleTip()}}</div>
    </el-upload>
</template>

<script>
  import { backendContext as sysBackendCtx } from '@/sys/config'
  import ajax from 'element-ui/packages/upload/src/ajax'

  const attachmentPrefix = `${sysBackendCtx}/sys/attachment`

  export default {
    name: 'fileUploader',
    props: {
      /**
       * 默认文件列表
       */
      value: String,
      /**
       * 支持的文件类型
       */
      accept: String,
      /**
       * 提示信息
       */
      tip: String,
      /**
       * 最大文件数，默认10
       */
      limit: {
        default: 10,
      },
      /**
       * 文件列表展示类型，picture，picture-card，text，默认picture
       */
      listType: {
        default: 'picture',
      },
      /**
       * 是否自动上传，默认false不自动上传
       */
      autoUpload: {
        default: false,
      },
      /**
       * 是否禁用，默认false不禁用
       */
      disabled: {
        default: false,
      },
      /**
       * 最大文件大小，单位是K，0表示不限制
       */
      maxSize: {
        default: 0,
      },
      /**
       * 文件上传前的自定义判断方法，需返回判断结果或者Promise
       */
      beforeUpload: {
        default: undefined,
      },
      /**
       * 文件在服务器端的存储方式
       * jr   非结构化存储
       * sftp sftp服务器存储
       * file 应用服务器存储
       */
      storeType: {
        default: 'file',
      },
      /**
       * 文件在非结构化服务器的存储空间，仅在storeType设置为jr时有效
       */
      workspace: {
        default: '',
      },
    },
    data () {
      return {
        /**
         * 已选择文件ID数组
         */
        fileIdArr: [],
        /**
         * 已选择文件数据仓库
         */
        fileDataStore: {},
        /**
         * 上传文件携带的额外数据
         */
        extraData: {},
        /**
         * 已上传文件列表
         */
        fileList: [],
        /**
         * 文件上传地址
         */
        uploadUrl: `/api${attachmentPrefix}/uploadAttachment`,
      }
    },
    computed: {
      /**
       * 是否为图片墙
       */
      isPictureCard () {
        return this.listType === 'picture-card'
      },
    },
    watch: {
      value (newVal) {
        /**
         * 排除上传文件后与父级组件之间值的相互传递
         */
        if (this.fileIdArr.join(',') !== newVal) {
          this.initFileList(newVal)
        }
      },
    },
    methods: {
      /**
       * 组装提示信息
       */
      assembleTip () {
        let tips = ''
        // 图片墙默认提示
        if (!this.tip && this.isPictureCard) {
          tips = `只能上传图片文件`
        }
        // 文件个数提醒
        tips += ` 限制上传${this.limit}个文件，当前`
        if (this.fileList.length > 0) {
          tips += `已选择${this.fileList.length}个文件`
        } else {
          tips += `未选择任何文件`
        }
        // 文件大小提醒
        if (this.maxSize > 0) {
          let size = this.maxSize / 1024
          tips += ` 当前限制选择单个文件大小不得超过`
          if (size < 1) {
            tips += `${this.maxSize}K`
          } else {
            tips += `${Math.floor(size)}M`
          }
        }
        return tips
      },
      /**
       * 文件列表变更
       * @param file 发生变更的文件
       * @param fileList 变更后的文件列表
       */
      handleChange (file, fileList) {
        const vm = this
        if (file.status === 'ready') {
          // 超过大小限制的文件不允许上传
          if (this.maxSize > 0 && file.size / 1024 > this.maxSize) {
            vm.$$utils.direwolfCommonTips('error', '文件大小超出限制，不允许上传')
            return false
          }
          // 对选择文件的名称进行校验
          const index = vm.$$utils.upload.checkSameNameInList(fileList, file.name)
          // 文件已存在且不是刚加进去的最后一个
          if (index > -1 && index !== fileList.length - 1) {
            vm.$$utils.direwolfCommonTips('warning', '相同名称的文件已经被选择')
            fileList.pop()
            return
          }
          vm.fileList = fileList
          // 增加后端服务需要的其他信息
          vm.$$utils.upload.appendMD5IntoFileObject(file, file => {
            vm.fileDataStore[file.md5] = {
              md5: file.md5,
              id: file.uid,
              name: file.name,
              type: file.raw.type,
              lastModifiedDate: file.raw.lastModified,
              size: file.size,
              workspace: vm.workspace,
              storeType: vm.storeType,
              path: vm.$$utils.getFormattedDate('yyyy/MM/dd'),
            }
            // 若需要自动提交或者是照片墙无提交按钮
            if (vm.autoUpload || vm.isPictureCard) {
              vm.$nextTick(() => vm.submitUpload())
            }
          })
        }
      },
      /**
       * 上传文件前判断
       * @param file
       */
      handleBeforeUpload ({ uid }) {
        const vm = this
        return new Promise((resolve, reject) => {
          let cachedFile = vm.fileList.find(f => f.uid === uid)
          const md5 = cachedFile.md5
          // 校验MD5，已存在的文件直接设置为上传成功
          vm.$$utils.axiosRequest(`${attachmentPrefix}/md5Check`, '文件秒传检查', 'POST', md5, {
            headers: { 'Content-Type': 'application/json' },
          }).then(result => {
            if (result.md5) {
              // 文件已存在
              cachedFile.percentage = 100
              cachedFile.status = 'success'
              cachedFile.response = result
              // 非图片文件采用后台返回的默认缩略图
              if (!vm.$$utils.upload.isPicture(result.ext)) {
                cachedFile.url = result.url
              }
              vm.handleSuccess(result, cachedFile)
            } else {
              // 文件不存在，调用自定义判断方法，或直接进行上传
              if (typeof vm.beforeUpload === 'function') {
                vm.beforeUpload(cachedFile, resolve, reject)
              } else {
                resolve(cachedFile)
              }
            }
          })
        })
      },
      /**
       * 自定义上传方法，每次根据文件设置携带数据
       *
       * @param options
       */
      uploadFileWithInfo (options) {
        const vm = this
        const md5 = vm.fileList.find(f => f.uid === options.file.uid).md5
        // 重设携带数据
        options.data = vm.fileDataStore[md5]
        // 调用原始发送方法
        return ajax(options)
      },
      /**
       * 文件上传成功
       * @param response 服务器响应
       * @param file 上传的文件
       */
      handleSuccess (response, file) {
        const vm = this
        if (vm.fileIdArr.indexOf(response.id) === -1) {
          vm.fileIdArr.push(response.id)
          vm.$emit('input', vm.fileIdArr.join(','))
        }
        vm.$emit('file-uploaded', file)
      },
      /**
       * 删除文件确认
       *
       * @param file 被删除文件
       */
      handleBeforeRemove (file) {
        const vm = this
        if (file.status === 'success') {
          // 若是已上传文件，则从服务器删除
          vm.deleteFiles([file])
        }
        return false
      },
      /**
       * 清除所有文件
       */
      clearAllFiles () {
        this.deleteFiles(this.fileList)
      },
      /**
       * 从服务器删除文件
       * @param fileList 删除后的文件列表
       */
      deleteFiles (fileList) {
        const vm = this
        if (fileList.length > 0) {
          vm.$$utils.direwolfCommonConfirm({
              message: '确定要删除文件吗？',
              title: '删除提示',
            }, () => [...fileList].forEach(file => {
              const { size, id } = file
              if (size === -1) {
                // 暂不删除服务器文件，因后端数据存储结构不适合删除文件
                // 首先文件通过MD5被复用，不清楚是否有其他位置引用该文件
                // 其次附件表数据与实际文件一一对应，无法通过删除记录使文件引用失效
                vm.$$utils.axiosRequest(`${attachmentPrefix}/deleteAttachment`, '删除文件', 'GET', { id }).
                  then(() => vm.removeFileFromData(file))
              } else {
                vm.removeFileFromData(file)
              }
            }),
          )
        }
      },
      /**
       * 从当前data删除数据并触发change事件
       * @param file 被删除文件
       */
      removeFileFromData (file) {
        const vm = this, { id } = file
        vm.fileIdArr.splice(vm.fileIdArr.findIndex(id => id === id), 1)
        vm.fileList.splice(vm.fileList.findIndex(f => f.id === id), 1)
        vm.$emit('input', vm.fileIdArr.join(','))
        vm.$emit('file-removed', file)
      },
      /**
       * 点击文件事件
       * @param file 被点击的文件
       */
      handlePreview (file) {
        const vm = this
        if (file.status !== 'success') {
          vm.$$utils.direwolfCommonTips('warning', '只有上传成功的文件才能预览或下载')
          return
        }
        file = vm.getAttachmentInfo(file)
        if (!file) {
          vm.$$utils.direwolfCommonTips('error', '未能在服务器找到文件信息，无法下载或预览')
          return
        }
        // 非图片文件直接下载
        if (!vm.$$utils.upload.isPicture(file.ext)) {
          vm.$$utils.direwolfCommonConfirm({
            message: '点击确定将文件保存到本地磁盘',
            title: '下载提示',
          }, () => vm.saveFileToLocal(file))
        } else {
          // 预览图片
          vm.previewPicture(file)
        }
      },
      /**
       * 删除文件事件
       * @param file 被点击的文件
       * @param fileList 删除后的文件列表
       */
      handleRemove (file, fileList) {
      },
      /**
       * 上传文件
       */
      submitUpload () {
        this.$refs.upload.submit()
      },
      /**
       * 预览图片
       * @param file
       */
      previewPicture ({ id, ext }) {
        const vm = this
        vm.downloadFile(id, data => {
          // 生成Base64地址
          vm.getImageBase64(ext, data, url => {
            vm.$$utils.showDialog({
              showCancelButton: false,
              title: `预览图片`,
              contentHeight: '340px',
              width: '60%',
              vNode: vm.$createElement('img',
                { domProps: { height: 300, src: url } }),
            })
          })
        })
      },
      /**
       * 保存文件到本地磁盘
       * @param file
       */
      saveFileToLocal ({ id, name }) {
        const vm = this
        // 从服务器获取文件
        vm.downloadFile(id, data => {
          if (navigator.appVersion.toString().indexOf('.NET') > 0) {
            //IE 10+
            window.navigator.msSaveBlob(data, name)
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
            downloadLink.download = name
            downloadLink.click()
          }
        })
      },
      /**
       * 获取后端封装的Attachment信息
       * @param file
       */
      getAttachmentInfo (file) {
        // 后端封装path属性，若存在则表示为Attachment
        if (file.path) {
          return file
        }
        // 上传成功后返回的信息存储在response属性中，若存在则返回
        if (file.response && file.response.path) {
          return file.response
        }
        // 未找到Attachment信息
        return null
      },
      /**
       * 超限提醒
       */
      handleExceed () {
        this.$$utils.direwolfCommonTips('warning', '选择文件数量已经达到最大限制')
      },
      /**
       * 文件上传失败
       * @param error 服务器响应
       * @param file 上传的文件
       */
      handleError (error, file) {
        const vm = this
        vm.$emit('file-uploaded-error', error, file)
      },
      /**
       * 获取二进制文件
       * @param id 文件ID
       * @param callback 回调
       */
      downloadFile (id, callback) {
        this.$$utils.axiosRequest(`${attachmentPrefix}/download`, '下载文件', 'GET', { id }, {
          responseType: 'blob',
        }).then(data => callback(data))
      },
      /**
       * 获取图片Base64字符串
       * @param type 图片类型
       * @param blob 图片数据
       * @param callback 回调
       */
      getImageBase64 (type, blob, callback) {
        const reader = new FileReader()
        reader.onload = function ({ target: { result } }) {
          const base64 = result.split(',')[1]
          callback(`data:image/${type};base64,${base64}`)
        }
        reader.readAsDataURL(blob)
      },
      /**
       * 根据附件ID列表初始化附件列表
       * @param value
       */
      initFileList (value) {
        const vm = this
        if (!value) {
          return
        }
        vm.$$utils.axiosRequest(`${attachmentPrefix}/findByIds`, '初始化附件列表', 'GET', { ids: value }).then(result => {
          result.forEach(file => {
            // 缓存文件ID
            vm.fileIdArr.push(file.id)
            // 生成图片的缩略图
            if (vm.$$utils.upload.isPicture(file.ext)) {
              vm.downloadFile(file.id, data => {
                vm.getImageBase64(file.ext, data, url => {
                  file.url = url
                })
              })
            }
          })
          // 缓存文件列表
          vm.fileList = result
        })
      },
    },
    mounted () {
      const vm = this
      vm.initFileList(vm.value)
      if (vm.disabled) {
        // 隐藏空的占位元素
        for (let element of document.getElementsByClassName('el-upload')) {
          element.style.display = 'none'
        }
      }
    },
  }
</script>

<style scoped>

</style>
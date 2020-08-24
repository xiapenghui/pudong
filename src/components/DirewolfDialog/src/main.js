const defaults = {
  title: null,
  message: '',
  type: '',
  iconClass: '',
  showInput: false,
  showClose: true,
  modalFade: true,
  lockScroll: true,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  closeOnHashChange: true,
  inputValue: null,
  inputPlaceholder: '',
  inputType: 'text',
  inputPattern: null,
  inputValidator: null,
  inputErrorMessage: '',
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonPosition: 'right',
  confirmButtonHighlight: false,
  cancelButtonHighlight: false,
  confirmButtonText: '',
  cancelButtonText: '',
  confirmButtonClass: '',
  cancelButtonClass: '',
  customClass: '',
  beforeClose: null,
  dangerouslyUseHTMLString: false,
  center: false,
  roundButton: false,
  distinguishCancelAndClose: false,
}

import Vue from 'vue'
import msgboxVue from './main.vue'
import merge from 'element-ui/src/utils/merge'
import { isVNode } from 'element-ui/src/utils/vdom'

const DirewolfDialogConstructor = Vue.extend(msgboxVue)

let currentMsg, instanceList = []
let msgQueue = []

const defaultCallback = action => {
  // if (currentMsg) {
  //   let callback = currentMsg.callback
  //   if (typeof callback === 'function') {
  //     if (instance.showInput) {
  //       callback(instance.inputValue, action)
  //     } else {
  //       callback(action)
  //     }
  //   }
  //   if (currentMsg.resolve) {
  //     if (action === 'confirm') {
  //       if (instance.showInput) {
  //         currentMsg.resolve({ value: instance.inputValue, action })
  //       } else {
  //         currentMsg.resolve(action)
  //       }
  //     } else if (currentMsg.reject && (action === 'cancel' || action === 'close')) {
  //       currentMsg.reject(action)
  //     }
  //   }
  // }
}

const initInstance = () => {
  let instance = new DirewolfDialogConstructor({
    el: top.document.createElement('div'),
  })
  instanceList.push(instance)

  instance.callback = defaultCallback
}

const showNextMsg = () => {
  // if (!instance) {
  initInstance()
  // }
  let currentInstance = instanceList[instanceList.length - 1]
  currentInstance.action = ''

  if (!currentInstance.visible || currentInstance.closeTimer) {
    if (msgQueue.length > 0) {
      currentMsg = msgQueue.shift()

      let options = currentMsg.options
      for (let prop in options) {
        if (options.hasOwnProperty(prop)) {
          currentInstance[prop] = options[prop]
        }
      }
      if (options.callback === undefined) {
        currentInstance.callback = defaultCallback
      }

      let oldCb = currentInstance.callback
      currentInstance.callback = (action, instance) => {
        oldCb(action, instance)
        showNextMsg()
      }
      currentInstance.$slots.default = [currentInstance.message]
      currentInstance.message = null;
      ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape', 'closeOnHashChange'].forEach(prop => {
        if (currentInstance[prop] === undefined) {
          currentInstance[prop] = true
        }
      })
      document.body.appendChild(currentInstance.$el)

      Vue.nextTick(() => {
        currentInstance.visible = true
      })
    }
  }
}

const DirewolfDialog = function (options, callback) {
  if (Vue.prototype.$isServer) return
  if (typeof options === 'string' || isVNode(options)) {
    options = {
      message: options,
    }
    if (typeof arguments[1] === 'string') {
      options.title = arguments[1]
    }
  } else if (options.callback && !callback) {
    callback = options.callback
  }

  if (typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => { // eslint-disable-line
      msgQueue.push({
        options: merge({}, defaults, DirewolfDialog.defaults, options),
        callback: callback,
        resolve: resolve,
        reject: reject,
      })

      showNextMsg()
    })
  } else {
    msgQueue.push({
      options: merge({}, defaults, DirewolfDialog.defaults, options),
      callback: callback,
    })

    showNextMsg()
  }
}

DirewolfDialog.setDefaults = defaults => {
  DirewolfDialog.defaults = defaults
}

DirewolfDialog.open = (options) => {
  const { vNode, ...others } = options
  if (instanceList && instanceList.length > 0) {
    instanceList[instanceList.length - 1].removeFocus()
  }
  return DirewolfDialog(merge({
    width: '80%',
    $type: 'confirm',
    showCancelButton: true,
  }, { message: vNode, ...others }))
}

DirewolfDialog.close = () => {
  let currentInstance = instanceList.pop()
  instanceList[instanceList.length - 1].restoreFocus()
  currentInstance.doClose()
  currentInstance.visible = false
  msgQueue = []
  currentMsg = null
}

export default DirewolfDialog
export { DirewolfDialog }
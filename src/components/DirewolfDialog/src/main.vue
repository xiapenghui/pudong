<template>
    <transition name="msgbox-fade">
        <div
                class="el-message-box__wrapper"
                tabindex="-1"
                v-show="visible"
                @click.self="handleWrapperClick"
                role="dialog"
                aria-modal="true"
                :aria-label="title || 'dialog'">
            <div class="el-message-box" :class="[customClass, center && 'el-message-box--center']" :style="{width}">
                <div class="el-message-box__header" v-if="title !== null">
                    <div class="el-message-box__title">
                        <span>{{ title }}</span>
                    </div>
                    <button
                            type="button"
                            class="el-message-box__headerbtn"
                            aria-label="Close"
                            v-if="showClose"
                            @click="handleAction(distinguishCancelAndClose ? 'close' : 'cancel')"
                            @keydown.enter="handleAction(distinguishCancelAndClose ? 'close' : 'cancel')">
                        <i class="el-message-box__close el-icon-close"></i>
                    </button>
                </div>
                <div :class="['el-message-box__content', contentClass]"
                     :style="{height: contentHeight, overflow: 'auto'}">
                    <div ref="content" class="el-message-box__message" v-if="message !== ''">
                        <slot>
                            <p v-if="!dangerouslyUseHTMLString">{{ message }}</p>
                            <p v-else v-html="message"></p>
                        </slot>
                    </div>
                    <div class="el-message-box__input" v-show="showInput">
                        <el-input
                                v-model="inputValue"
                                :type="inputType"
                                @keydown.enter.native="handleInputEnter"
                                :placeholder="inputPlaceholder"
                                ref="input"></el-input>
                        <div class="el-message-box__errormsg"
                             :style="{ visibility: !!editorErrorMessage ? 'visible' : 'hidden' }">{{ editorErrorMessage
                            }}
                        </div>
                    </div>
                </div>
                <div class="el-message-box__btns">
                    <el-button
                            :loading="cancelButtonLoading"
                            :class="[ cancelButtonClasses ]"
                            v-if="showCancelButton"
                            :round="roundButton"
                            size="small"
                            @click.native="handleAction('cancel')"
                            @keydown.enter="handleAction('cancel')">
                        {{ cancelButtonText || t('el.messagebox.cancel') }}
                    </el-button>
                    <el-button
                            :loading="confirmButtonLoading"
                            ref="confirm"
                            :class="[ confirmButtonClasses ]"
                            v-show="showConfirmButton"
                            :round="roundButton"
                            size="small"
                            @click.native="handleAction('confirm')"
                            @keydown.enter="handleAction('confirm')">
                        {{ confirmButtonText || t('el.messagebox.confirm') }}
                    </el-button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/babel">
  import Popup from 'element-ui/src/utils/popup'
  import Locale from 'element-ui/src/mixins/locale'
  import ElInput from 'element-ui/packages/input'
  import ElButton from 'element-ui/packages/button'
  import { addClass, removeClass } from 'element-ui/src/utils/dom'
  import { t } from 'element-ui/src/locale'
  import Dialog from 'element-ui/src/utils/aria-dialog'

  let messageBox
  export default {
    mixins: [Popup, Locale],
    props: {
      contentClass: {
        default: '',
      },
      width: {
        default: '60%',
      },
      contentHeight: {
        default: '400px',
      },
      modal: {
        default: true,
      },
      lockScroll: {
        default: true,
      },
      showClose: {
        type: Boolean,
        default: true,
      },
      closeOnClickModal: {
        default: false,
      },
      closeOnPressEscape: {
        default: true,
      },
      closeOnHashChange: {
        default: true,
      },
      center: {
        default: false,
        type: Boolean,
      },
      roundButton: {
        default: false,
        type: Boolean,
      },
    },
    components: {
      ElInput,
      ElButton,
    },
    computed: {
      confirmButtonClasses () {
        return `el-button--primary ${this.confirmButtonClass}`
      },
      cancelButtonClasses () {
        return `${this.cancelButtonClass}`
      },
    },
    methods: {
      removeFocus() {
        messageBox.removeListeners()
      },
      restoreFocus() {
        messageBox.addListeners()
      },
      getSafeClose () {
        const currentId = this.uid
        return () => {
          this.$nextTick(() => {
            if (currentId === this.uid) this.doClose()
          })
        }
      },
      doClose () {
        if (!this.visible) return
        this.visible = false
        this._closing = true
        const content = this.$slots.default[0].componentInstance
        this.onClose && this.onClose(content, this)
        messageBox.closeDialog() // 解绑
        if (this.lockScroll) {
          setTimeout(this.restoreBodyStyle, 200)
        }
        this.opened = false
        this.doAfterClose()
        setTimeout(() => {
          if (this.action) this.callback(this.action, this)
        })
      },
      handleWrapperClick () {
        if (this.closeOnClickModal) {
          this.handleAction(this.distinguishCancelAndClose ? 'close' : 'cancel')
        }
      },
      handleInputEnter () {
        if (this.inputType !== 'textarea') {
          return this.handleAction('confirm')
        }
      },
      handleAction (action) {
        if (!this.validate()) {
          return
        }
        this.action = action
        if (typeof this.beforeClose === 'function') {
          this.close = this.getSafeClose()
          const content = this.$slots.default[0].componentInstance
          this.beforeClose(this.action, content, this, this.close)
        } else {
          this.doClose()
        }
      },
      validate () {
        if (this.$type === 'prompt') {
          const inputPattern = this.inputPattern
          if (inputPattern && !inputPattern.test(this.inputValue || '')) {
            this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error')
            addClass(this.getInputElement(), 'invalid')
            return false
          }
          const inputValidator = this.inputValidator
          if (typeof inputValidator === 'function') {
            const validateResult = inputValidator(this.inputValue)
            if (validateResult === false) {
              this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error')
              addClass(this.getInputElement(), 'invalid')
              return false
            }
            if (typeof validateResult === 'string') {
              this.editorErrorMessage = validateResult
              addClass(this.getInputElement(), 'invalid')
              return false
            }
          }
        }
        this.editorErrorMessage = ''
        removeClass(this.getInputElement(), 'invalid')
        return true
      },
      getFirstFocus () {
        const btn = this.$el.querySelector('.el-message-box__btns .el-button')
        const title = this.$el.querySelector('.el-message-box__btns .el-message-box__title')
        const input = this.$el.querySelector('input')
        return input || btn || title
      },
      getInputElement () {
        const inputRefs = this.$refs.input.$refs
        return inputRefs.input || inputRefs.textarea
      },
    },
    watch: {
      inputValue: {
        immediate: true,
        handler (val) {
          this.$nextTick(_ => {
            if (this.$type === 'prompt' && val !== null) {
              this.validate()
            }
          })
        },
      },
      visible (val) {
        if (val) {
          this.uid++
          this.$nextTick(() => {
            this.getFirstFocus().focus()
          })
          this.focusAfterClosed = document.activeElement
          messageBox = new Dialog(this.$el, this.focusAfterClosed, this.getFirstFocus())
        }
        // prompt
        // if (this.$type !== 'prompt') return
        if (!val) {
          //   setTimeout(() => {
          //     if (this.$refs.input && this.$refs.input.$el) {
          //       this.getInputElement().focus()
          //     }
          //   }, 500)
          // } else {
          // this.editorErrorMessage = ''
          // removeClass(this.getInputElement(), 'invalid')
          document.body.removeChild(this.$el)
        }
      },
    },
    mounted () {
      this.$nextTick(() => {
        if (this.closeOnHashChange) {
          window.addEventListener('hashchange', this.close)
        }
      })
    },
    beforeDestroy () {
      if (this.closeOnHashChange) {
        window.removeEventListener('hashchange', this.close)
      }
      setTimeout(() => {
        messageBox.closeDialog()
      })
    },
    data () {
      return {
        uid: 1,
        title: undefined,
        message: null,
        customClass: '',
        showInput: false,
        inputValue: null,
        inputPlaceholder: '',
        inputType: 'text',
        inputPattern: null,
        inputValidator: null,
        inputErrorMessage: '',
        showConfirmButton: true,
        showCancelButton: false,
        action: '',
        confirmButtonText: '',
        cancelButtonText: '',
        confirmButtonLoading: false,
        cancelButtonLoading: false,
        confirmButtonClass: '',
        confirmButtonDisabled: false,
        cancelButtonClass: '',
        editorErrorMessage: null,
        callback: null,
        dangerouslyUseHTMLString: false,
        focusAfterClosed: null,
        isOnComposition: false,
        distinguishCancelAndClose: false,
      }
    },
  }
</script>
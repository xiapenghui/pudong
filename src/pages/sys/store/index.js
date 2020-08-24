import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import resourceStore from './resourceStore'
import userStore from './userStore'
import roleStore from './roleStore'
import paramClassStore from './paramClassStore'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    resourceStore,
    userStore,
    roleStore,
    paramClassStore,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
})



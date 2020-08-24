import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
// import resourceStore from './resourceStore'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    // resourceStore,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
})



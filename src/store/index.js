import  * as getters from './getters.js' 
import mutations from './mutation.js'
import state from './state.js'
import * as actions from './actions.js'
import Vue from 'vue'
import Vuex from 'vuex'
import  createLogger  from "vuex/dist/logger";


Vue.use(Vuex)

const debug = process.env.NODE_ENV!=='production'

let store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    strict:debug,
    plugins:debug?[createLogger()]:[]
})
 
export default  store
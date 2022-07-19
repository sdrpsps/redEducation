import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


Vue.use(Vuex)

const store = new Vuex.Store({
    // 2. vuex 严格模式 vuex do not mutate vuex store state outside mutation handlers.
    strict: true,
    // 1. 仓库里面的状态，仓库里面的数据
    state: {
        // 1. 定义数据
        newsList: [],
    },
    // 负责同步处理
    mutations: {
        // payload 载荷，代表是 commit提交时候的传递的参数
        inCrement(state, payload) {
            console.log(payload);
            state.count = state.count + payload.n;
        },
        deCrement(state, payload) {
            state.count = state.count - payload.n;
        },
        saveNewsList(state, payload) {
            state.newsList = payload;
        },
        

    },
    // 负责异步操作
    actions: {
        // store 当前仓库实例对象，和 mutations 里面方法参数不一样。
        //payload 外部传递的参数
        async getNewsList(store, payload) {
            console.log(payload, '异步操作传递的参数');
            let url = `https://yw.52kfw.cn/api/news/flist?currentPage=${payload.page}&pageSize=${payload.size}&cate_id=%E7%A7%91%E6%8A%80%E5%85%B4%E5%9B%BD`;
            let response = await axios.get(url);
            console.log(response);
            // store.state.newsList = response.data.data.list;
            store.commit('saveNewsList', response.data.data.list);

        },
    },
    // 负责对数据进行加工（类似组件的计算属性）
    getters: {
        dbCount(state) {
            return state.count * 2;
        }
    }
})

export default store;

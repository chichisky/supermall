import { createStore } from 'vuex'

// 创建 store 容器实例.
const store = createStore({
  state () {
    return {
      product : []
    }
  },
  mutations: {
    addCart (state,product) {
      state.product.push(product)
    }
  }
})

export default store
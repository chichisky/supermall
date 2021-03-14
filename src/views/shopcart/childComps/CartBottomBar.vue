<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" :is-checked="isSelectAll"
                    @click="checkClick" />
      <span>全选</span>
    </div>
    <div class="price">
      合计: {{totalPrice}}
    </div>
    <div class="right" @click="cartBuy">
      去结算({{totalCount}})
    </div>
  </div>
</template>

<script>
import CheckButton from "../../../components/content/checkButton/CheckButton.vue";
import {mapGetters} from "vuex"
export default {
  components: { CheckButton },
  name: "CartBottomBar",
  computed: {
    ...mapGetters(['totalPrice', 'totalCount', 'cartList']),
    isSelectAll () {
      if (this.cartList.length === 0) return false
      return this.cartList.every(item => item.checked)
    }
  },
  methods: {
    checkClick() {
      // if (this.isSelectAll) {
      //   this.cartList.forEach(item => item.checked = false)
      // } else {
      //   this.cartList.forEach(item => item.checked = true)
      // }
      this.cartList.forEach(item => item.checked = !this.isSelectAll)
    },
    cartBuy() {
      this.$emit("cartBuy")
    }
  }
};
</script>

<style scoped>
.bottom-bar {
  height: 40px;
  background-color: #eee;
  position: fixed;
  bottom: 49px;
  left: 0;
  right: 0;
  display: flex;
  font-size: 14px;
}
.check-content {
  padding: 10px;
  height: 20px;
  display: flex;
  width: 80px;
}
.check-content span {
  padding: 0 5px;
}
.check-button {
  width: 20px;
  height: 20px;
}
.price {
  margin: 10px;
  flex: 1;
}
.right {
  padding: 10px;
  text-align: center;
  background-color: var(--color-high-text);
  width: 100px;
}
</style>
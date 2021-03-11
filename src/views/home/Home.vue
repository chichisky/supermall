<template>
  <div id="home">
    <nav-bar class="home-nav"><template #center>购物街</template>></nav-bar>
    <tab-control :titles="titles" 
                 @tabClick="tabClick"
                 ref="tabControl2" 
                 v-show="isTabShow"/>
    <scroll class="content"
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll" 
            :pull-up-load="true" 
            @pullingUp="loadMore"
            :observeImage="true">
      <home-swiper :banners="banners" 
                   @swiperImageLoad="swiperImageLoad" />
      <home-recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control :titles="titles" 
                   @tabClick="tabClick"
                   ref="tabControl1" 
                   v-show="!isTabShow"/>
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click="backClick" v-show="isBackShow" />
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar.vue";
import HomeSwiper from "./childComps/HomeSwiper.vue";
import HomeRecommendView from "./childComps/HomeRecommendView.vue";

import { getHomeMultidata, getHomeGoods } from "@/network/home";
import FeatureView from "./childComps/FeatureView.vue";
import TabControl from "../../components/content/tabControl/TabControl.vue";
import GoodsList from "../../components/content/goods/GoodsList";
import Scroll from "../../scroll/Scroll.vue";
import BackTop from '../../components/content/backTop/BackTop.vue';

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    HomeRecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  data() {
    return {
      banners: [],
      recommends: [],
      titles: ["流行", "新款", "精选"],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isBackShow: false,
      tabControlTop: null,
      isTabShow: false,
      saveY: 0
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();
    // 2.请求商品数据pop news sell
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  activated () {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
  },
  deactivated () {
    this.saveY = this.$refs.scroll.getScrollY()
  },
  methods: {
    /**
     * 关于事件监听的方法
     *
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    backClick(){
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    contentScroll(position){
      // 1.确定BackTop是否显示
      this.isBackShow = (-position.y) > 1000

      // 2.确定TabControl是否吸顶
      this.isTabShow = (-position.y) > this.tabControlTop
    },
    loadMore(){
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad(){
      this.tabControlTop = this.$refs.tabControl1.$el.offsetTop - 44
    },

    /**
     * 关于网络请求的方法
     *
     */
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },

    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        this.$refs.scroll.finishPullUp()
      });
    },
  },
};
</script>

<style scoped>
#home {
  height: 100vh;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* 为了在使用原生滚动时，导航栏不随着内容滚动 */
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9; */
}
.content {
  overflow: hidden;
  height: calc(100% - 93px);
}
</style>

<template>
  <div class="detail">
    <detail-nav-bar class="detail-nav" @tabClick="tabClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :observeImage="true"
      :observeDOM="true"
      @scroll="contentScroll"
    >
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shopInfo" />
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad"
        class="goods-info"
      />
      <detail-param-info :param-info="paramInfo" ref="params" />
      <detail-comment-info :comment-info="commentInfo" ref="comment" />
      <goods-list :goods="recommends" ref="recommend" />
    </scroll>
    <detail-bottom-bar class="bottom-bar" @addToCart="addToCart" />
    <back-top @click="backClick" v-show="isBackShow" class="back-top" />
  </div>
</template>

<script>
import { getDetail, Goods, GoodsParam, getRecommend } from "@/network/detail";
import { debounce } from "@/common/utils";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import Scroll from "../../scroll/Scroll.vue";
import DetailParamInfo from "./childComps/DetailParamInfo.vue";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import GoodsList from "../../components/content/goods/GoodsList.vue";
import DetailNavBar from "./childComps/DetailNavBar.vue";
import DetailBottomBar from './childComps/DetailBottomBar.vue';
import {backTopMixin} from '@/common/mixin';
export default {
  name: "Detail",
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shopInfo: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [], // 记录滚动y轴坐标
      getThemeTopY: null, // 防抖函数
      currentIndex: 0,
      product: {}
    };
  },
  mixins: [backTopMixin],
  components: {
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailParamInfo,
    DetailCommentInfo,
    DetailGoodsInfo,
    GoodsList,
    DetailNavBar,
    DetailBottomBar,
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;
    // 2.获取详情页数据
    getDetail(this.iid).then((res) => {
      const data = res.result;
      // console.log(data);
      // 1.获取顶部的图片详情数据
      this.topImages = data.itemInfo.topImages;
      // 2.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      // 3.获取店铺信息
      this.shopInfo = data.shopInfo;
      // 4.获取商品详细信息
      this.detailInfo = data.detailInfo;
      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      // 6.获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    });
    // 3.获取推荐数据
    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });

    this.$nextTick(() => {
      this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44);
      this.themeTopYs.push(Number.MAX_VALUE); // 存入最大值，用于边界条件判断
      // console.log(this.themeTopYs);
    }, 100);
    })
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();
      // console.log("------------------------");
      this.getThemeTopY();
    },
    tabClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },
    contentScroll(position) {
      const positionY = -position.y;
      const length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        // 判断做法二、 hack
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i; // 用于避免重复记录i的次数
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
      // 2.确定BackTop是否显示
      this.isBackShow = (-position.y) > 1000
    },
    addToCart () {
      this.product.iid = this.iid
      this.product.img = this.topImages[0]
      this.product.title = this.goods.title
      this.product.desc = this.goods.desc
      this.product.newPrice = this.goods.realPrice
      this.$store.commit('addCart',this.product)
      console.log(this.$store.state.product);
    }
  },
};
</script>

<style scoped>
.detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail .goods-info {
  position: relative;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  height: calc(100% - 102px);
  overflow: hidden;
}
.bottom-bar {
  position: relative;
}
</style>
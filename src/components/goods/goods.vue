<template>
    <div class="goods-wrapper">
      <div class="menu-wrapper" ref="menu">
        <ul v-if="goods" class="menu-ul">
          <li v-for="(item, i) in goods" :key="i" class="menu-item" :class="{'current': currentIndex === i}" @click="selectMenu(i,$event)">
            <p class="menu-item-p">
                <span class="menu-text border-1px">
              <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
              {{ item.name }}</span>
            </p>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foods">
        <ul v-if="goods" ref="foodheight">
          <li v-for="(good, i) in goods" :key="i" class="foods-item" :class="{'current': currentIndex === i}">
            <h1 class="title" >{{ good.name }}</h1>
            <ul v-if="good.foods">
              <li @click="selectFoodevent(item,$event)" v-for="(item, i) in good.foods" :key="i" class="foods-list border-1px">
                <div class="icon">
                  <img :src="item.icon" width="57">
                </div>
                <div class="content">
                  <h2 class="name">{{ item.name }}</h2>
                  <p class="decs" v-if="item.description">{{ item.description}}</p>
                  <p class="extra">
                    <span class="sellCount">月售{{ item.sellCount }}份</span>
                    <span class="rating">好评率{{ item.rating }}%</span>
                  </p>
                  <p class="price">
                    <span class="price-text">￥{{ item.price }}</span>
                    <span class="oldPrice" v-show="item.oldPrice">￥{{ item.oldPrice }}</span>
                  </p>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol @addCart="addCart" :food="item"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :select-foods="selectFoods" :deliveryPrice='4' :minprice="20"></shopcart>
      <transition name="food">
        <food ref="food" @addCart="addCart" @selectFoodhide="selectFoodhide" :food="selectFood" v-if="foodShow"></food>
      </transition>
    </div>
</template>

<script>
import Bscroll from 'better-scroll';
import shopcart from 'components/shopcart/shopcart';
import cartcontrol from 'components/cartcontrol/cartcontrol';
import food from 'components/food/food';

export default {
  name: '',
  data () {
    return {
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      goods: [],
      ERR_OK: 0,
      listHeight: [],
      scrollY: 0,
      addCartshow: 0,
      selectFood: {},
      foodShow: false
    };
  },
  created () {
    this.fn();
  },
  methods: {
    fn () {
      this.$http.get('./api/goods').then(response => {
        if (response.body.errno === this.ERR_OK) {
          this.goods = response.body.data;
          this.$nextTick(() => {
            this._initscroll();
            this.foodsHeight();
          });
        }
      });
    },
    _initscroll () {
      this.leftscroll = new Bscroll(this.$refs.menu, {
        click: true
      });

      this.rightscroll = new Bscroll(this.$refs.foods, {
        click: true,
        probeType: 3
      });
      this.rightscroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    foodsHeight () {
      let list = this.$refs.foodheight.children;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu (index, event) {
      if (!event._constructed) {
        return;
      }
      let list = this.$refs.foodheight.children;
      let el = list[index];
      this.rightscroll.scrollToElement(el, 300);
    },
    addCart (target) {
      this.$refs.shopcart.drop(target);
    },
    selectFoodevent (food, event) {
      if (!event._constructed) {
        return;
      }
      this.selectFood = food;
      this.foodShow = true;
    },
    selectFoodhide () {
      this.foodShow = false;
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods () {
      let food = [];
      this.goods.forEach((good) => {
        good.foods.forEach((item) => {
          if (item.count) {
            food.push(item);
          }
        });
      });
      return food;
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../common/stylus/mixin';

.goods-wrapper{
  position: absolute;
  top: 174px;
  bottom: 48px;
  overflow: hidden;
  display: flex;
  width: 100%;
  .menu-wrapper{
    flex: 0 0 80px;
    width: 80px;
    background-color:#f3f5f7;
    overflow: hidden;
    .menu-ul{
      .menu-item{
        &.current{
          background: #fff;
          position: relative;
          margin-top: -1px;
          z-index: 10;
          .menu-item-p{
            .border-none();
            font-weight: 700;
          }
        }
        padding: 0 12px;
        .menu-item-p{
          height: 54px;
          display: flex;
          align-items: center;
          width: 56px;
          line-height: 14px;
          .border-1px(rgba(7,17,27,0.1));
          .menu-text{
            float: left;
            font-size: 12px;
            .icon{
              margin: -2px;
              display: inline-block;
              width: 12px;
              height: 12px;
              background-size: 12px 12px;
              &.decrease{
                  .bg-image('../../components/goods/img/decrease_3');
              }
              &.discount{
                  .bg-image('../../components/goods/img/discount_3');
              }
              &.special{
                  .bg-image('../../components/goods/img/special_3');
              }
              &.invoice{
                  .bg-image('../../components/goods/img/invoice_3');
              }
              &.guarantee{
                  .bg-image('../../components/goods/img/guarantee_3');
              }
            }
          }
        }
      }
    }
  }
  .foods-wrapper{
    flex: 1;
    .title{
      z-index: 10;
      font-size: 12px;
      color: rgb(147, 153, 159);
      font-weight: 700;
      line-height: 24px;
      background-color: #f3f5f7;
      position: relative;
      padding-left: 14px;
      &::before{
        content: "";
        position: absolute;
        left: 0;
        height: 100%;
        width: 2px;
        background-color: #d9dde1;
      }
    }
    .foods-list{
        display: flex;
        margin: 18px;
        margin-bottom: 0;
        padding-bottom: 18px;
        .border-1px(rgba(7,17,27,0.1));
        &:last-child{
          .border-none();
        }
        .icon{
          flex: 0 0 57px;
          width: 57px;
        }
        .content{
          flex: 1;
          margin-left: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
          .name{
            margin-top: 4px;
            font-size: 14px;
            color: rgb(7, 27, 37);
            line-height: 14px;
          }
          .decs{
            margin-top: 8px;
            line-height: 12px;
          }
          .extra{
            margin-top: 8px;
            font-size: 0;
            .sellCount{
              margin-right: 12px;
              font-size: 10px;
            }
            .rating{
              font-size: 10px;
            }
          }
          .price{
            .price-text{
              font-size: 14px;
              color: rgb(240, 20, 20);
              font-weight: 700;
              line-height: 24px;
            }
            .oldPrice{
              margin-left: 12px;
              font-size: 10px;
              color: rgb(147, 153, 159);
              font-weight: 700;
              line-height: 24px;
              text-decoration: line-through;
            }
          }
          .cartcontrol-wrapper{
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
    }
  }
  .food-enter-active, .food-leave-active {
    transition: all 0.2s linear;
  }
  .food-enter, .food-leave-active {
    transform: translate3d(100%, 0, 0);
  }
}
</style>

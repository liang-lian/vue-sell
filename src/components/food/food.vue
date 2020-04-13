<template>
  <div class="food" ref="food">
      <div class="food-content">
          <div class="image-header">
              <img :src="food.image">
              <div class="back" @click="selectFoodhide">
                  <i class="icon-arrow_lift back-icon"></i>
              </div>
          </div>
          <div class="content">
              <h1 class="title">{{ food.name }}</h1>
              <div class="detail">
                  <span class="sell-count">月售{{ food.sellCount }}</span>
                  <span class="rating">好评率{{ food.rating }}%</span>
              </div>
              <p class="price">
                <span class="price-text">￥{{ food.price }}</span>
                <span class="oldPrice" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
              </p>
              <div class="cartcontrol-wrapper">
                <cartcontrol @addCart="addCart" :food="food"></cartcontrol>
              </div>
              <transition>
                <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count === 0">
                    加入购物车
                </div>
              </transition>
          </div>
          <split v-show="food.info"></split>
          <div class="info" v-show="food.info">
            <h1 class="title">商品介绍</h1>
            <div class="text">{{ food.info }}</div>
          </div>
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <ratingselect @needShow="needShow" @toggle-content="toggleContent" @select="select" :select-type="selectType" :only-content="onlycontent" :desc="desc" :ratings="food.ratings"></ratingselect>
            <div class="rating-wrapper">
              <ul class="ul" v-show="food.ratings && food.ratings.length">
                <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating, index) in food.ratings" :key="index" class="rating-item border-1px">
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img :src="rating.avatar" class="avatar" width="12" height="12">
                  </div>
                  <div class="item">{{ rating.rateTime | formatDate }}</div>
                  <p class="text">
                    <span :class="{'icon-thumb_up': rating.rateType === 0,'icon-thumb_down': rating.rateType === 1}" class="icon-box"></span>{{ rating.text }}
                  </p>
                </li>
              </ul>
              <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import Vue from 'vue';
import {formatDate} from 'common/js/date.js';
import cartcontrol from 'components/cartcontrol/cartcontrol';
import split from 'components/split/split';
import ratingselect from 'components/ratingselect/ratingselect';

const ALL = 2;

export default {
  name: '',
  data () {
    return {
        flag: true,
        selectType: ALL,
        onlycontent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
    };
  },
  props: {
      food: {
          type: Object
      }
  },
  created () {
  },
  mounted () {
      this.selectType = ALL;
      this.onlycontent = false;
      this.$nextTick(() => {
          this.scroll();
      });
  },
  methods: {
      selectFoodhide () {
          this.$emit('selectFoodhide');
      },
      scroll () {
          this.scroll = new BScroll(this.$refs.food, {
              click: true
          });
      },
      addFirst (event) {
        if (!event._constructed) {
            return;
        }
        if (this.flag) {
            this.flag = false;
            this.$emit('addCart', event.target);
            Vue.set(this.food, 'count', 1);
        }
        setTimeout(() => {
            this.flag = true;
        }, 500);
      },
      addCart () {
          this.$emit('addCart', event.target);
      },
      select (type) {
        this.selectType = type;
      },
      toggleContent () {
        this.onlycontent = !this.onlycontent;
      },
      needShow (type, text) {
        if (this.onlycontent && !text) {
          return false;
        } else if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      }
  },
  components: {
      cartcontrol,
      split,
      ratingselect
  },
  filters: {
    formatDate (time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../common/stylus/mixin';

.food{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    background-color: #fff;
    .food-content{
        position: relative;
        .image-header{
            width: 100%;
            position: relative;
            height: 0;
            padding-top: 100%;
            img{
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
            }
            .back{
                position: absolute;
                top: 10px;
                left: 0;
                .back-icon{
                    display: block;
                    padding: 10px;
                    font-size: 20px;
                    color: #fff;
                }
            }
        }
        .content{
          position: relative;
          padding: 18px;
          .title{
              font-size: 14px;
              line-height: 14px;
              margin-bottom: 8px;
              font-weight: 700;
              color: rgb(7, 17, 27);
          }
          .detail{
              font-size: 0;
              margin-bottom: 18px;
              line-height: 10px;
              height: 10px;
              .sell-count, .rating{
                  font-size: 10px;
                  color: rgb(147, 153, 159);
              }
              .rating{
                  margin-left: 12px;
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
              right: 12px;
              bottom: 12px;
          }
          .buy{
              position: absolute;
              right: 18px;
              bottom: 18px;
              z-index: 10;
              height: 24px;
              line-height: 24px;
              padding: 0 12px;
              box-sizing: border-box;
              border-radius: 12px;
              font-size: 12px;
              color: #fff;
              background-color: rgb(0, 160, 220);
          }
        }
        .info{
          padding: 18px;
          .title{
            line-height: 14px;
            margin-bottom: 6px;
            font-size: 14px;
            color: rgb(7, 17, 27)
          }
          .text{
            color: rgb(77, 85, 93);
            font-size: 12px;
            line-height: 24px;
            padding: 0 8px;

          }
        }
        .rating{
          .title{
            line-height: 14px;
            margin-top: 18px;
            margin-left: 18px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .rating-wrapper{
            padding: 0 18px;
            .rating-item{
              position: relative;
              .border-1px(rgba(7, 17, 27, 0.1));
              padding: 16px 0;
              .user{
                position: absolute;
                right: 0;
                top: 16px;
                line-height: 12px;
                font-size: 0;
                .name{
                  display: inline-block;
                  vertical-align: top;
                  font-size: 10px;
                  margin-right: 6px;
                  color: rgb(147, 153, 159);
                }
                .avatar{
                  border-radius: 50%;
                }
              }
              .item{
                margin-bottom: 6px;
                line-height: 12px;
                font-size: 10px;
                color: rgb(147, 153, 159);
              }
              .text{
                font-size: 12px;
                color: rgb(7, 17, 27);
                line-height: 16px;
                .icon-box{
                  font-size: 12px;
                  color: rgb(147, 153, 159);
                  line-height: 12px;
                  margin-right: 1.5px;
                  &.icon-thumb_up{
                    color: rgb(0, 160, 220);
                  }
                }
              }
            }
            .no-rating{
              padding: 16px 0;
              font-size: 12px;
              color: rgb(147, 153, 159);
              &.active{
                display: block;
              }
            }
          }
        }
    }
}

.v-enter, .v-leave-active{
    opacity: 0;
}

.v-enter-active, .v-leave-active{
    transition: all 0.5s;
}
</style>

<template>
  <div class="ragings" ref="ragings">
    <div class="ratings-wrapper">
      <div class="content">
        <div class="synthesize">
          <div class="synthesize-content  border-right-1px">
            <p class="num">{{ seller.score }}</p>
            <p class="synthesize-pingfen">综合评分</p>
            <p class="gaoyun">高于周边商家{{ seller.rankRate }}%</p>
          </div>
        </div>
        <div class="serve">
          <div class="manner">
            <span class="manner-box">服务态度</span>
            <v-cart :size="36" :score="seller.serviceScore"></v-cart>
            <span class="serviceScore">{{ seller.serviceScore }}</span>
          </div>
          <div class="manner">
            <span class="manner-box">服务态度</span>
            <v-cart :size="36" :score="seller.foodScore"></v-cart>
            <span class="serviceScore">{{ seller.foodScore }}</span>
          </div>
          <div class="time manner">
            <span class="manner-box">送达时间</span>
            <span class="deliveryTime">{{ seller.deliveryTime }}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect @toggle-content="toggleContent" @select="select" :ratings="ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc"></ratingselect>
      <div class="rating-wrapper">
        <ul class="ul" v-show="ratings && ratings.length">
          <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating, index) in ratings" :key="index" class="rating-item border-1px">
            <div class="user">
              <span class="avatar">
                <img :src="rating.avatar" width="28" height="28">
              </span>
              <div class="name-box">
                <span class="name">{{ rating.username }}</span>
                <p class="deliveryTime">
                  <v-cart :size="24" :score="rating.score"></v-cart>
                  <span class="deliveryTime-box" v-if="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                </p>
              </div>
            </div>
            <p class="text" v-if="rating.text">{{ rating.text }}</p>
            <div class="evaluate clearfix">
              <span :class="{'icon-thumb_up': rating.rateType === 0,'icon-thumb_down': rating.rateType === 1}" class="icon-box"></span>
              <div class="recommend-wrapper">
                <div class="recommend" v-show="index < 4" v-for="(item, index) in rating.recommend" :key="index">
                  <span class="recommend-box">{{ item }}</span>
                </div>
              </div>
            </div>
            <div class="time-content">
              <span class="rateTime">{{ rating.rateTime | formatDate }}</span>
            </div>
          </li>
        </ul>
        <div class="no-rating" v-show="!ratings || !ratings.length">暂无评价</div>
      </div>
    </div>
  </div>
</template>

<script>
import star from 'components/star/star';
import split from 'components/split/split';
import ratingselect from 'components/ratingselect/ratingselect';
import {formatDate} from 'common/js/date.js';
import BScroll from 'better-scroll';

const ALL = 2;

export default {
  name: 'ratings',
  data () {
    return {
      seller: [],
      ratings: [],
      selectType: ALL,
      onlyContent: false,
      goods: [],
      desc: {
        all: '全部',
        positive: '满意',
        negative: '不满意'
      }
    };
  },
  created () {
    this.init();
  },
  methods: {
    init () {
      this.$http.get('./api/ratings')
      .then((response) => {
        response = response.body;
        if (response.errno === 0) {
          this.ratings = response.data;
          this.$nextTick(() => {
            this.scroll();
          });
        }
      });

      this.$http.get('./api/seller')
      .then((response) => {
        response = response.body;
        if (response.errno === 0) {
          this.seller = response.data;
        }
      });

      this.$http.get('./api/goods')
      .then((response) => {
        response = response.body;
        if (response.errno === 0) {
          this.goods = response.data;
        }
      });
    },
    scroll () {
      this.scroll = new BScroll(this.$refs.ragings, {
        click: true
      });
    },
    select (type) {
      this.selectType = type;
    },
    needShow (type, text) {
      if (this.onlyContent && !text) {
          return false;
        } else if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
    },
    toggleContent () {
      this.onlyContent = !this.onlyContent;
    }
  },
  computed: {
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
  },
  components: {
    'v-cart': star,
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

.ragings{
  position: absolute;
  left: 0;
  width: 100%;
  top: 174px;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
  .ratings-wrapper{
    .content{
      display: flex;
      background-color: #fff;
      .synthesize{
        padding: 18px 0;
        flex: 4;
        .synthesize-content{
          display: flex;
          flex-direction: column;
          align-items: center;
          .border-right-1px(#e6e6e6);
          .num{
            display: block;
            font-size: 24px;
            color: rgb(255, 153, 0);
            line-height: 28px;
          }
          .synthesize-pingfen{
            display: block;
            font-size: 12px;
            color: rgb(7, 17, 27);
            line-height: 18px;
            margin-bottom: 8px;
          }
          .gaoyun{
            font-size: 10px;
            color: rgb(147, 153, 159);
            line-height: 10px;
            margin-bottom: 6px;
          }
        }
      }
      .serve{
        flex: 6;
        padding: 18px 20px;
        box-sizing: border-box;
        .manner{
          display: flex;
          margin-bottom: 6px;
          .manner-box{
            margin-right: 12px;
            font-size: 12px;
            color: rgb(7, 17, 27);
            line-height: 18px;
            vertical-align: top;
          }
          .serviceScore{
            margin-left: 12px;
            font-size: 12px;
            color: rgb(255, 153, 0);
            line-height: 18px;
          }
        }
        .time{
          margin-bottom: 0;
          .deliveryTime{
            font-size: 12px;
            color: rgb(147, 153, 159);
            line-height: 18px;
          }
        }
      }
    }
    .rating-wrapper{
      background-color:#fff;
      padding: 18px;
      padding-bottom: 0;
      .rating-item{
        .border-1px(#e6e6e6);
        position: relative;
        padding-bottom: 18px;
        .user{
          display: flex;
          .avatar{
            margin-right: 12px;
            img{
              border-radius: 50%;
            }
          }
          .name-box{
            .name{
              font-size: 10px;
              line-height: 12px;
              color: rgb(7, 17, 27);
              margin-bottom: 4px;
            }
            .deliveryTime{
              display: flex;
              .deliveryTime-box{
                margin-left: 6px;
                font-size: 10px;
                font-weight: 200;
                color: rgb(147, 153, 159);
                line-height: 12px;
                margin-bottom: 6px;
              }
            }
          }
        }
        .text{
          font-size: 12px;
          color: rgb(7, 17, 27);
          line-height: 18px;
        }
        .evaluate{
          margin-top: 8px;
          .icon-box{
            float: left;
            font-size: 12px;
            color: rgb(183, 187, 191);
            line-height: 16px;
            &.icon-thumb_up{
              color: rgb(0, 160, 220);
            }
          }
          .recommend-wrapper{
            float: left;
            .recommend{
              float: left;
              font-size: 0;
              .recommend-box{
                display: block;
                font-size: 9px;
                color: rgb(147, 153, 159);
                line-height: 16px;
                padding: 0 12px;
                border: 1px solid rgba(7, 17, 27, 0.1);
                border-radius: 2px;
                background-color: rgb(255, 255, 255);
                max-width: 30px;
                margin-left: 8px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
        .time-content{
          position: absolute;
          right: 0;
          top: 0;
          .rateTime{
            font-size: 10px;
            font-weight: 200;
            color: rgb(147, 153, 159);
            line-height: 12px;
          }
        }
      }
    }
  }
}
</style>

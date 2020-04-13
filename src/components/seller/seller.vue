<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title-name">{{ seller.name }}</h1>
        <div class="desc border-1px">
          <v-star class="star" :size="36" :score="seller.score"></v-star>
          <span class="text text1">({{ seller.ratingCount }})</span>
          <span class="text">月售{{ seller.sellCount }}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2 class="title">起送价</h2>
            <div class="content">
              <span class="stress">{{ seller.minPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2 class="title">商家配送</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2 class="title">平均配送时间</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryTime }}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{ 'active': favorite }"></span>
          <span class="text">{{ favoriteText }}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{ seller.bulletin }}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li v-for="(support, index) in seller.supports" :key="index" class="support-item border-1px">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{ seller.supports[index].description }}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="live-action">
        <h1 class="title">商家实景</h1>
        <div class="pics-list" ref="picsList">
          <ul v-if="seller.pics" class="pics" ref="pics">
            <li v-for="(pic, index) in seller.pics" :key="index" class="pics-item">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="message">
        <h1 class="title border-1px">商家信息</h1>
        <ul v-if="seller.infos" class="infos">
          <li v-for="(info, index) in seller.infos" :key="index" class="infos-item border-1px">
            <p class="info">{{ info }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import star from 'components/star/star';
import split from 'components/split/split';
import BScroll from 'better-scroll';
import {urlParse} from 'common/js/urlParse.js';
import {saveToLocal, loadFromLocal} from 'common/js/store';

export default {
  name: '',
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      },
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      favorite: (() => {
        return loadFromLocal(urlParse().id, 'favorite', false);
      })()
    };
  },
  created () {
    this.init();
  },
  mounted () {
    this.picsScroll();
  },
  watch: {
    'seller' () {
      this.scroll();
      this.picsScroll();
    }
  },
  methods: {
    init () {
      this.$http.get('./api/seller?id=' + this.seller.id)
      .then(response => {
        response = response.body;
        if (response.errno === 0) {
          this.seller = Object.assign({}, this.seller, response.data);
        }
      });
    },
    scroll () {
      this.scroll = new BScroll(this.$refs.seller, {
        click: true
      });
    },
    picsScroll () {
      if (this.seller.pics) {
        let picWidth = 120;
        let margin = 6;
        let width = (picWidth + margin) * this.seller.pics.length - margin;
        this.$nextTick(() => {
          this.$refs.pics.style.width = width + 'px';
          this.picsScroll = new BScroll(this.$refs.picsList, {
            scrollX: true,
            eventPassthrough: 'vertical'
          });
        });
      }
    },
    toggleFavorite (event) {
      if (!event._constructed) {
        return;
      }
      this.favorite = !this.favorite;
      saveToLocal(this.seller.id, 'favorite', this.favorite);
    }
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏';
    }
  },
  components: {
    'v-star': star,
    split
  }
};
</script>

<style lang="less" scoped>
@import '../../common/stylus/mixin';

.seller{
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  .seller-content{
    .overview{
      padding: 18px;
      background-color: #fff;
      .title-name{
        font-size: 14px;
        font-weight: 700;
        color: rgb(7, 17, 27);
        line-height: 14px;
        margin-bottom: 8px;
      }
      .desc{
        padding-bottom: 18px;
        .border-1px(rgba(7, 17, 27, 0.1));
        font-size: 0;
        .star{
          display: inline-block;
          margin-right: 8px;
          vertical-align: top;
        }
        .text{
          display: inline-block;
          line-height: 18px;
          font-size: 10px;
          color: rgb(77, 85, 93);
          vertical-align: top;
          &.text1{
            margin-right: 12px;
          }
        }
      }
      .remark{
        display: flex;
        padding-top: 18px;
        .block{
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(7, 17, 27, 0.1);
          &:last-child{
            border-right: 0;
          }
          .title{
            font-size: 10px;
            color: rgb(147, 153, 159);
            line-height: 10px;
            margin-bottom: 4px;
          }
          .content{
            font-size: 10px;
            color: rgb(7, 17, 27);
            .stress{
              font-size: 24px;
            }
          }
        }
      }
      .favorite{
        position: absolute;
        right: 10px;
        top: 18px;
        width: 50px;
        text-align: center;
        .icon-favorite{
          display: block;
          color: #d4d6d9;
          font-size: 24px;
          line-height: 24px;
          &.active{
            color: rgb(240, 20, 20);
          }
        }
        .text{
          display: block;
          font-size: 10px;
          color: rgb(77, 85, 93);
          line-height: 10px;
          margin-top: 4px;
        }
      }
    }
    .bulletin{
      padding: 18px 18px 0 18px;
      background-color: #fff;
      .title{
        font-weight: 700;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .content-wrapper{
        padding: 8px 12px 16px 12px;
        .border-1px(rgba(7, 17, 27, 0.1));
        .content{
          font-size: 12px;
          font-weight: 200;
          color: rgb(240, 20, 20);
          line-height: 24px;
        }
      }
      .supports{
        .support-item{
          font-size: 0;
          padding: 16px 12px;
          .border-1px(rgba(7, 17, 27, 0.1));
          &:last-child{
            .border-none();
          }
          .icon{
            display: inline-block;
            width: 16px;
            height: 16px;
            vertical-align: top;
            margin-right: 6px;
            background-size: 16px 16px;
            background-repeat: no-repeat;
            &.decrease{
              .bg-image('../../components/seller/img/decrease_4');
            }
            &.discount{
              .bg-image('../../components/seller/img/discount_4');
            }
            &.special{
              .bg-image('../../components/seller/img/special_4');
            }
            &.invoice{
              .bg-image('../../components/seller/img/invoice_4');
            }
            &.guarantee{
              .bg-image('../../components/seller/img/guarantee_4');
            }
          }
          .text{
            font-size: 12px;
            font-weight: 200;
            color: rgb(7, 17, 27);
            line-height: 16px;
          }
        }
      }
    }
    .live-action{
      padding: 18px;
      background-color: #fff;
      .title{
        font-weight: 700;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
        margin-bottom: 12px;
      }
      .pics-list{
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        .pics{
          font-size: 0;
          .pics-item{
            display: inline-block;
            width: 120px;
            height: 90px;
            margin-right: 6px;
            &:last-child{
              margin-right: 0;
            }
          }
        }
      }
    }
    .message{
      background-color: #fff;
      padding: 18px 18px 0 18px;
      .title{
        line-height: 14px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(7, 17, 27);
        padding-bottom: 12px;
        .border-1px(rgba(7, 17, 27, 0.1));
      }
      .infos{
        .infos-item{
          padding: 16px 12px;
          .border-1px(rgba(7, 17, 27, 0.1));
          &:last-child{
            .border-none();
          }
          .info{
            font-size: 12px;
            font-weight: 200;
            color: rgb(7, 17, 27);
            line-height: 16px;
          }
        }
      }
    }
  }
}
</style>

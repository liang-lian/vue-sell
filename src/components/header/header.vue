<template>
  <div class="header">
    <div class="content-wrapper clearfix">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar" />
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{ seller.name }}</span>
        </div>
        <div class="description">
          {{ seller.description }}/{{ seller.deliveryTime }}分钟送达
        </div>
        <div v-if="seller.supports" class="supports" >
          <span class="subtract" :class="classMap[seller.supports[supportsType].type]"></span>
          <span class="supports-text">{{ seller.supports[supportsType].description }}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="right" @click="detailShow=true">
        <span class="right-text">{{ seller.supports.length }}个</span>
        <span class="sell-icon icon-keyboard_arrow_right"></span>
      </div>
    </div>
    <div class="bulletin-wrapper">
      <span class="bulletin"></span>
      <span class="text">{{ seller.bulletin }}</span>
      <span class="sell-icon icon-keyboard_arrow_right bulletin-right"></span>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition>
      <detail @detailShow="detailShows" :classMap="classMap" v-show="detailShow" :seller="seller"></detail>
    </transition>
  </div>
</template>

<script>
import detail from 'components/detail/detail';

export default {
  name: '',
  data () {
    return {
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      supportsType: 0,
      detailShow: false
    };
  },
  props: ['seller'],
  created () {
  },
  methods: {
    detailShows () {
      this.detailShow = false;
    }
  },
  components: {
    detail
  }
};
</script>

<style lang="less" scoped>
@import '../../common/stylus/mixin';

.header{
  overflow: hidden;
  color: #fff;
  background-color: rgba(7, 17, 27,0.5);
  position: relative;
  padding-bottom: 28px;
  .content-wrapper{
    width: 100%;
    padding-top: 24px;
    box-sizing: border-box;
    position: relative;
    .avatar{
      margin:0 24px 18px 16px;
      float: left;
      font-size: 0;
    }
    .content{
      float: left;
      .title{
        display: flex;
        .brand{
          .bg-image('../../components/header/img/brand');
          width: 30px;
          height: 18px;
          margin: 2px 6px 8px 0;
          background-size: 30px 18px;
          display: block;
        }
        .name{
          font-size: 16px;
          color: rgb(255, 255, 255);
          font-weight: bold;
          line-height: 18px;
          display: block;
        }
      }
      .description{
        font-size: 10px;
        color: rgb(255, 255, 255);
        font-weight: 200;
        line-height: 12px;
        margin-bottom: 10px;
      }
      .supports{
        display: flex;
        .subtract{
          margin-bottom: 2px;
          margin-right: 4px;
          width: 12px;
          height: 12px;
          display: block;
          background-size: 12px 12px;
          &.decrease{
            .bg-image('../../components/header/img/decrease_1');
          }
          &.discount{
            .bg-image('../../components/header/img/discount_1');
          }
          &.special{
            .bg-image('../../components/header/img/special_1');
          }
          &.invoice{
            .bg-image('../../components/header/img/invoice_1');
          }
          &.guarantee{
            .bg-image('../../components/header/img/guarantee_1');
          }
        }
        .supports-text{
          display: block;
          color: rgb(255, 255, 255);
          font-weight: 200;
          font-size: 10px;
          line-height: 12px;
        }
      }
    }
    .right{
      position: absolute;
      right: 12px;
      bottom: 14px;
      height: 24px;
      background-color: rgba(0, 0, 0, 0.2);
      font-size: 10px;
      color: rgb(255, 255, 255);
      font-weight: 200;
      line-height: 24px;
      border-radius: 40px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      .right-text{
        visibility: top;
        font-size: 10px;
      }
      .icon-keyboard_arrow_right{
        margin-left: 2px;
        line-height: 24px;
        font-size: 10px;
      }
    }
  }
  .bulletin-wrapper{
    position: absolute;
    width: 100%;
    line-height: 28px;
    font-size: 10px;
    color: rgb(255, 255, 255);
    font-weight: 200;
    background-color: rgb(7,17,27);
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    .bulletin{
      position: absolute;
      .bg-image('../../components/header/img/bulletin');
      display: block;
      width: 24px;
      margin: 0 4px 0 12px;
      height:12px;
      background-size: 24px 12px;
    }
    .text{
      display: block;
      overflow: hidden;
      width: 100%;
      padding-left: 40px;
      padding-right:  24px;
      white-space: nowrap;
      text-overflow: ellipsis;
      box-sizing: border-box;
    }
    .bulletin-right{
      position: absolute;
      right: 12px;
      display: block;

    }
  }
  .background{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(10px);
  }
}

.v-enter-active,
.v-leave-active{
  transition: opacity 0.7s;
}

.v-enter,
.v-leave-active{
  opacity: 0;
}

</style>

<template>
  <div class="detail">
      <div class="detail-wrapper clearfix">
          <div class="detail-main">
              <div class="name">{{ seller.name }}</div>
              <div class="star-wrapper">
                  <v-star :size="48" :score="seller.score"></v-star>
              </div>
              <div class="title">
                  <div class="line"></div>
                  <div class="text">优惠活动</div>
                  <div class="line"></div>
              </div>
              <ul v-if="seller.supports" class="supports">
                <li  v-for="(support, i) in seller.supports" :key="i" class="supports-item" >
                    <span class="subtract" :class="classMap[seller.supports[i].type]"></span>
                    <span class="supports-text">{{ seller.supports[i].description }}</span>
                </li>
              </ul>
              <div class="title">
                  <div class="line"></div>
                  <div class="text">商家公告</div>
                  <div class="line"></div>
              </div>
              <div class="bulletin">
                  <span class="bulletin-text">{{ seller.bulletin }}</span>
              </div>
          </div>
      </div>
      <div class="detail-close" @click="detailShow">
          <i class="sell-icon icon-close"></i>
      </div>
  </div>
</template>

<script>
import star from 'components/star/star';

export default {
  name: 'detail',
  data () {
    return {
    };
  },
  props: ['seller', 'classMap'],
  methods: {
      detailShow () {
          this.$emit('detailShow');
      }
  },
  components: {
      'v-star': star
  }
};
</script>

<style lang="less" scoped>
@import '../../common/stylus/mixin';

.detail{
    position: fixed;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    left: 0;
    top: 0;
    z-index: 100;
    background-color: rgba(7,17,27,0.8);
    .detail-wrapper{
        min-height: 100%;
        .detail-main{
            padding: 64px 0;
            .name{
                text-align: center;
                font-size: 16px;
                font-weight: 700;
                color: rgb(255,255,255);
                line-height: 16px;
            }
            .star-wrapper{
                text-align: center;
                margin-top: 16px;
                padding: 2px 0;
            }
            .title{
                display: flex;
                width: 80%;
                margin: 28px auto;
                .line{
                    flex: 1;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                    position: relative;
                    top: -6px;
                }
                .text{
                    flex: 1;
                    font-size: 14px;
                    font-weight: 700;
                    text-align: center;

                }
            }
            .supports{
                width: 80%;
                margin: 0 auto;
                margin-top: 12px;
                .supports-item{
                    margin-top: 12px;
                    display: flex;
                    padding: 0 12px;
                    .subtract{
                        display: block;
                        width: 16px;
                        height: 16px;
                        background-size: 16px 16px;
                        &.decrease{
                            .bg-image('../../components/detail/img/decrease_2');
                        }
                        &.discount{
                            .bg-image('../../components/detail/img/discount_2');
                        }
                        &.special{
                            .bg-image('../../components/detail/img/special_2');
                        }
                        &.invoice{
                            .bg-image('../../components/detail/img/invoice_2');
                        }
                        &.guarantee{
                            .bg-image('../../components/detail/img/guarantee_2');
                        }
                    }
                    .supports-text{
                        margin-left: 6px;
                        font-size: 12px;
                        font-weight: 200;
                        color: rgb(255,255,255);
                        line-height: 12px;
                    }
                }
            }
            .bulletin{
                width: 80%;
                padding: 0 12px;
                box-sizing: border-box;
                margin: 0 auto;
                .bulletin-text{
                    font-size: 12px;
                    font-weight: 200;
                    color: rgb(255,255,255);
                    line-height: 24px;
                }
            }
        }
    }
    .detail-close{
        position: relative;
        width: 32px;
        height: 32px;
        font-size: 32px;
        margin: -64px auto 0 auto;
        clear: both;
    }
}
</style>

<template>
  <div class="rataingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{'active': selectType === 2}">{{ desc.all }}<span class="count">{{ ratings.length }}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active': selectType === 0}">{{ desc.positive }}<span class="count">{{ positives.length }}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active': selectType === 1}">{{ desc.negative }}<span class="count">{{ negatives.length }}</span></span>
    </div>
    <div @click="toggleContent($event)" class="switch" :class="{'active':onlyContent}">
      <span class="icon-check_circle icon-box"></span>
      <span class="text" >只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  name: '',
  data () {
    return {
    };
  },
  props: {
    ratings: {
      type: Array,
      default () {
        return [];
      }
    },
    selectType: {
      type: Number,
      default () {
        return ALL;
      }
    },
    onlyContent: {
      type: Boolean,
      default () {
        return false;
      }
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        };
      }
    }
  },
  computed: {
    positives () {
      return this.ratings.filter(rating => {
        return rating.rateType === POSITIVE;
      });
    },
    negatives () {
      return this.ratings.filter(rating => {
        return rating.rateType === NEGATIVE;
      });
    }
  },
  methods: {
    select (type, event) {
      if (!event._constructed) {
        return;
      }
      this.$emit('select', type);
    },
    toggleContent (event) {
      if (!event._constructed) {
        return;
      }
      this.$emit('toggle-content');
      this.$emit('needShow');
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../common/stylus/mixin';

.rataingselect{
  background-color: #fff;
  .rating-type{
    padding: 18px 0;
    margin: 0 18px;
    .border-1px(rgba(7, 17, 27, 0.1));
    font-size: 0;
    .block{
      display: inline-block;
      padding: 8px 12px;
      font-size: 12px;
      border-radius: 1px;
      margin-right: 8px;
      line-height: 16px;
      color: rgb(77, 85, 93);
      &.active{
        color: #fff;
      }
      .count{
        font-size: 8px;
        margin-left: 2px;
      }
      &.positive{
        background: rgba(0, 160, 220, 0.2);
        &.active{
          background-color: rgb(0, 160, 220);
        }
      }
      &.negative{
        background: rgba(77, 85, 93, 0.2);
        &.active{
        background: rgb(77, 85, 93);
      }
      }
    }
  }
  .switch{
    padding: 12px 18px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    font-size: 0;
    line-height: 24px;
    color: rgb(147, 153, 159);
    &.active{
      .icon-box{
        color: #00c850;
      }
    }
    .icon-box{
      display: inline-block;
      font-size: 24px;
      margin-right: 4px;
    }
    .text{
      display: inline-block;
      font-size: 12px;
      vertical-align: top;
    }
  }
}
</style>

<template>
  <div id="app">
    <v-header :seller="data"></v-header>

    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import header from './components/header/header.vue';

const ERR_OK = 0;

export default {
  name: 'App',
  data () {
    return {
      data: []
    };
  },
  created () {
    this.fn();
  },
  methods: {
    fn () {
      this.$http.get('/api/seller').then(response => {
        if (response.body.errno === ERR_OK) {
          this.data = response.body.data;
        }
      });
    }
  },
  components: {
    'v-header': header
  }
};
</script>

<style lang="less">
@import 'common/stylus/mixin';
#app{
  .tab{
    display: flex;
    height: 40px;
    width: 100%;
    line-height: 40px;
    .tab-item{
      flex: 1;
      text-align: center;
      .border-1px(rgba(7, 17, 27, 0.1));
      a{
        display: block;
        color: rgb(77,85,93);
        font-size: 14px;
      }
      .active{
        color: rgb(240, 20, 20);
      }
    }
  }
}
</style>

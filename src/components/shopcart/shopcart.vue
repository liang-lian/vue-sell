<template>
    <div class="shopcart">
       <div class="container" @click="toggleList">
            <div class="shopcart-wrapper">
                <div class="great-circle">
                    <div class="small-circle" :class="{'highlinght': totalCount > 0}">
                        <i class="icon-shopping_cart shopcart-icon"></i>
                    </div>
                    <div class="num" v-show="totalCount > 0">{{ totalCount }}</div>
                </div>
            </div>
            <div class="shopcart-content">
                <div class="left border-right-1px" :class="{'highlinght': totalPrice > 0}">￥{{ totalPrice }}</div>
                <div class="center">另外配送费￥{{ deliveryPrice }}元</div>
            </div>
            <div class="shopcart-money" :class="{'enough': totalPrice >= minprice}">
                <p class="name">{{ payDesc }}</p>
            </div>
            <div class="ball-container">
                <div v-for="(ball, i) in balls" :key="i" >
                    <transition
                            @before-enter="beforeEnter"
                            @enter="enter"
                            @after-enter="afterEnter">
                        <div class="ball" v-show="ball.show">
                            <span class="globule globule-hook"></span>
                        </div>
                    </transition>
                </div>
            </div>
       </div>
        <transition name="fold" appear>
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <li class="food" v-for="(food, index) in selectFoods" :key="index">
                            <span class="name">{{ food.name }}</span>
                            <div class="price">
                                <span class="price-num">￥{{ food.price * food.count}}</span>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol @cartcontrolevent="cartcontrolevent" :food="food"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import cartcontrol from 'components/cartcontrol/cartcontrol';
import Bscroll from 'better-scroll';

export default {
    data () {
        return {
            balls: [
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                }
            ],
            dropBalls: [],
            fold: false
        };
    },
    props: ['minprice', 'deliveryPrice', 'selectFoods'],
    created () {
    },
    mounted () {
        this.$nextTick(() => {
            this.scroll();
        });
    },
    computed: {
        totalPrice () {
            let total = 0;
            this.selectFoods.forEach((food) => {
                total += food.price * food.count;
            });
            return total;
        },
        totalCount () {
            let count = 0;
            this.selectFoods.forEach((food) => {
                count += food.count;
            });
            return count;
        },
        payDesc () {
            if (this.totalPrice === 0) {
                return `￥${this.minprice}起送`;
            } else if (this.totalPrice < this.minprice) {
                return `还差￥${this.minprice - this.totalPrice}起送`;
            } else if (this.totalPrice >= this.minprice) {
                return '结算';
            }
        },
        listShow: {
            get: function () {
                return this.fold;
            },
            set: function () {
                if (!this.totalCount) {
                    this.fold = false;
                    return false;
                }
                let show = !this.fold;
                return show;
            }
        }
    },
    methods: {
        drop (el) {
            for (let i = 0; i < this.balls.length; i++) {
                let ball = this.balls[i];
                if (!ball.show) {
                    ball.show = true;
                    ball.el = el;
                    this.dropBalls.push(ball);
                    return;
                }
            }
        },
        beforeEnter (el) {
            let count = this.balls.length;
            while (count--) {
                let ball = this.balls[count];
                if (ball.show) {
                    const rect = ball.el.getBoundingClientRect();
                    const x = rect.left - 32;
                    const y = -(window.innerHeight - rect.top - 22);
                    el.style.transform = el.style.webKitTransform = `translate3d(0, ${y}px, 0)`;
                    const inner = el.getElementsByClassName('globule-hook')[0];
                    inner.style.transform = inner.style.webKitTransform = `translate3d(${x}px, 0, 0)`;
                }
            }
        },
        enter (el, done) {
            /* eslint-disable no-unused-vars */
            const rf = el.offsetHeight;
            el.style.transform = el.style.webkitTransform = 'translate3d(0,0,0)';
            const inner = el.getElementsByClassName('globule-hook')[0];
            inner.style.transform = inner.style.webkitTransform = 'translate3d(0,0,0)';
            el.addEventListener('transitionend', done);
        },
        afterEnter (el) {
            const ball = this.dropBalls.shift();
            if (ball) {
                ball.show = false;
                el.style.display = 'none';
            }
        },
        toggleList () {
            if (!this.totalCount) {
                return;
            }
            this.listShow = false;
            this.fold = !this.fold;
        },
        scroll () {
            this.top = new Bscroll(this.$refs.listContent, {
                click: true
            });
        },
        empty () {
            this.selectFoods.forEach(food => {
                food.count = 0;
            });
            this.listShow = false;
        },
        cartcontrolevent () {
            if (!this.totalCount) {
                this.listShow = false;
            }
        }
    },
    components: {
        cartcontrol
    }
};
</script>

<style lang="less" scoped>
@import '../../common/stylus/mixin';

.shopcart{
    height: 48px;
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 40;
    color: rgba(255,255,255,0.1);
    .container{
        background-color: #141d27;
        display: flex;
        .shopcart-wrapper{
            flex: 0 0 80px;
            padding: 0 12px;
            box-sizing: border-box;
            position: relative;
            .great-circle{
                width: 58px;
                height: 58px;
                background-color: #141d27;
                border-radius: 50%;
                position: absolute;
                bottom: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                .small-circle{
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background-color: #2a353a;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    &.highlinght{
                        background-color: rgb(0, 160, 220);
                        .shopcart-icon{
                            color: #fff;
                        }
                    }
                    .shopcart-icon{
                        font-size: 24px;
                        color: rgba(255,255,255,0.4);
                    }
                }
                .num{
                    width: 24px;
                    height: 16px;
                    position: absolute;
                    border-radius: 16px;
                    font-weight: 700;
                    font-size: 9px;
                    right: 0;
                    top: 0;
                    color: #fff;
                    background-color: rgb(244, 20, 20);
                    text-align: center;
                    line-height: 16px;
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
                }
            }
        }
        .shopcart-content{
            flex: 1;
            padding: 12px 0;
            .left{
                float: left;
                font-size: 12px;
                line-height: 24px;
                font-weight: 700;
                padding-right: 12px;
                color: rgba(255,255,255,0.4);
                .border-right-1px(rgba(255,255,255,0.1));
                &.highlinght{
                    color: #fff;
                }
            }
            .center{
                float: left;
                padding-left: 12px;
                line-height: 24px;
                font-size: 12px;
                color: rgba(255,255,255,0.4);
            }
        }
        .shopcart-money{
            flex: 0 0 105px;
            background-color: #2a353a;
            font-size: 12px;
            font-weight: 700;
            height: 100%;
            line-height: 48px;
            text-align: center;
            color: rgba(255,255,255,0.4);
            &.enough{
                background-color: #00b43c;
                color: #fff;
            }
        }
        .ball-container{
            .ball{
                position: fixed;
                left: 32px;
                bottom: 22px;
                z-index: 200;
                transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
                .globule{
                    display: block;
                    width: 16px;
                    height: 16px;
                    background-color:rgb(0, 160, 220);
                    border-radius: 50%;
                    transition: all 0.4s linear
                }
            }
        }
    }
    .shopcart-list{
        position: absolute;
        bottom: 48px;
        left: 0;
        z-index: -1;
        width: 100%;
        &.fold-enter, &.fold-leave-active{
            transform: translate3d(0, 100%, 0);
        }
        &.fold-enter-active, &.fold-leave-active{
            transition: all .3s ease-in-out;
        }
        .list-header{
            width: 100%;
            box-sizing: border-box;
            height: 40px;
            line-height: 40px;
            padding: 0 18px;
            background-color: #f3f5f7;
            border-bottom: 1px solid rgba(7, 17, 27, 0.1);
            .title{
                float: left;
                font-size: 12px;
                color: rgb(7, 17, 27);
            }
            .empty{
                font-size: 12px;
                float: right;
                color: rgb(0, 160, 220);
            }
        }
        .list-content{
            background-color: #fff;
            padding: 0 18px;
            overflow: hidden;
            max-height: 261px;
            .food{
                height: 48px;
                font-size: 12px;
                border-bottom: 1px solid rgba(7, 17, 27, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                .name{
                    color: rgb(7, 17, 27);
                }
                .price{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .price-num{
                        font-size: 14px;
                        color: rgb(240, 20, 20);
                        font-weight: 700;
                    }
                }
            }
        }
    }
}
</style>

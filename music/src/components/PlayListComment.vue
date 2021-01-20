<template>
    <div class="cmt">
        <div class="title">
            <h4>精彩评论</h4>
        </div>
        <div class="cmt-item" v-for="(item, index) in comment" :key="index">
            <div class="lf">
                <img :src="item.user.avatarUrl" alt="">
            </div>
            <div class="lr">
                <div class="header">
                    <div class="cmt_meta">
                        <p class="one">{{item.user.nickname}}</p>
                        <p class="two">{{new Date().getFullYear(item.time) + '年' + new Date().getMonth(item.time) + "月" + new Date().getDate(item.time) + "日"}}</p>
                    </div>
                    <div class="like">
                        <span>
                            {{item.likedCount}}
                        </span>
                        <svg class="u-svg u-svg-unzancmt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><path fill="#999" d="m25.857 14.752c-.015.059-1.506 5.867-2.932 8.813-1.162 2.402-3 2.436-3.099 2.436h-12.826v-13c3 0 5.728-4 5.728-7.275 0-3.725 1.433-3.725 2.142-3.725 1.327 0 1.978 1.345 1.978 4 0 2.872-.832 4.525-.839 4.537-.161.31-.155.682.027.981.181.299.5.482.849.482h6.942c.922 0 1.551.215 1.866.64.467.626.286 1.705.164 2.112m-23.857 10.248v-10c0-1.795.659-1.981.855-2h2.145v13h-2.173c-.829 0-.827-.648-.827-1m25.309-13.54c-.713-.969-1.886-1.46-3.482-1.46h-5.519c.26-.932.519-2.285.519-4 0-5.221-2.507-6-4-6-1.909 0-4.185.993-4.185 5.725 0 2.206-1.923 5.275-3.815 5.275h-4-.011c-1.034.011-2.816.862-2.816 4v10.02c0 1.198.675 2.979 2.827 2.979h16.971.035c.364 0 3.224-.113 4.894-3.564 1.514-3.127 3.01-8.942 3.056-9.14.071-.23.664-2.289-.474-3.836"></path></svg>
                    
                    </div>
                </div>
                <div class="content">
                    <span>{{item.content}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['comment'],
    data() {
      return {
        times:null
      }
    },
    // methods: {
    //     methods: {
    // // 时间转格式的方法
    // CurentTime : function (now) {
    //     const date = new Date(now);
    //     var y = date.getFullYear() ;// 年份
    //     var m = date.getMonth() +  1;// 月份，注意：js里的月要加1
    //     var d = date.getDate(); // 日
    //     // var h = date.getHours(); // 小时
    //     // var min = date.getMinutes() ;// 分钟
    //     // var s = date.getSeconds(); // 秒
    //     //返回值，根据自己需求调整，现在已经拿到了年月日时分秒了
    //     return y + '年' + m + '月' + d + '日'
    //   }
    // },
    // },
    
}
</script>
<style lang="less">
    .cmt{
        position: relative;
        width: 100%;
        margin-top: -50px;
        .title{
            h4{
                text-align: left;
                padding: 0 10px;
                height: 23px;
                line-height: 23px;
                color: #666;
                font-size: 12px;
                font-weight: 400;
                background: rgba(0,0,0,.05);
            }
        }
        .cmt-item{
            padding-top: 10px;
            padding-left: 10px;
            width: 100%;
            display: flex;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            flex-direction: row;
            // background: red;
            .lf{
                height: 35px;
                img{
                    display: block;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                }
            }
            .lr{
                padding-right: 10px;
                padding-left: 10px;
                -webkit-flex: auto;
                -webkit-box-flex: 1;
                flex: auto;
                width: 0;
                // background-color: royalblue;
                border-bottom: 1px solid #ccc;
                .header{
                    align-items: flex-start;
                    display: flex;
                    height: 50px;
                    // background-color: saddlebrown;
                    .cmt_meta{
                        flex: 1;
                        text-align: left;
                        .one{
                            font-size: 14px;
                            color: #666;
                            line-height: 20px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            -webkit-box-flex: 1;
                            -webkit-flex: auto;
                            flex: auto;
                        }
                        .two{
                            font-size: 9px;
                            color: #999;
                        }
                    }
                    .like{
                        width: 20%;
                        text-align: right;
                        span{
                            font-size: 11px;
                            color: #999;
                        }
                        svg{
                            width: 15px;
                        }
                    }
                }
                .content{
                    text-align: left;
                    padding-bottom: 5px;
                    padding-left: 5px;
                    span{
                        color: #333;
                        font-size: 15px;
                        line-height: 22px;
                        margin-top: 5px;
                    }
                }
            }
        }
    }
</style>
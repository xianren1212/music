<template>
<!-- 将播放的歌曲的数组和数组下标传给父级 -->
    <li class="item" @click="$emit('update:music', {item , index}); $emit('update:playlist');">
        <div class="info">
            <h5>
                {{item.name}}   
            </h5>
            <p>
                <span class="sq"></span>
                <span class="zuozhe" v-for="(alias, index) in item.song.artists" :key="index">
                    <template v-if="index"> / </template>
                        {{alias.name}}
                </span>
                <span class="zuozhe">
                    -{{item.name}}  
                </span>
            </p>
        </div>

        <div class="icon">
            <span
                class="playing"
                :class="{ paused: paused }"
                v-if="currentMusic && currentMusic.id === item.id"
            >
                <i></i>
                <i class="one"></i>
                <i class="two"></i>
                <i></i>
            </span>
            <span class="play" v-else></span>
        </div>
    </li>
</template>
<script>
export default {
    props : [ 'item','index','currentMusic','paused']
}
</script>
<style lang="less">
.item{
    display: flex;
    margin-left: 13px;
    border-bottom: 1px solid #f2f2f3;
    height: 54px;
    align-items: center;
    margin-left: 10px;
    .info {
        flex: 1;
        text-align: left;
        h5{
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 95%;
        }
        p{  
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #888;
            width: 95%;

        }
        .sq{
            display: inline-block;
            width: 12px;
            height: 8px;
            margin-right: 4px;
            background: url('https://s3.music.126.net/mobile-new/img/index_icon_2x.png?5207a28c3767992ca4bb6d4887c74880=') no-repeat;
            background-size: 166px 97px;
        }
        .zuozhe{
            font-size: 12px;
        }
    }
    .icon {
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        .playing {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-right: 5px;
            // background: b;
            i {
                width: 4px;
                height: 30px;
                background: linear-gradient(to bottom, #ed6ea0, #ec8c69, #f7186a , #FBB03B);
                // display: inline-block;
                transform-origin: center bottom;
                animation: playing 0.6s linear -0.2s infinite alternate-reverse;
                &:first-of-type {
                    animation-delay: 0s;
                }
                &:last-of-type {
                    animation-delay: -0.6s;
                }
            }
            .one{
                animation-delay: -0.2s;
            }
            .two{
                animation-delay: -0.4s;
            }
            &.paused {
                i {
                animation-play-state: paused;
                }
            }
        }
    }
    .play{
        display: block;
        width: 23px;
        height: 23px;
        margin-top: 4px;
        background-position: -24px 0;
        background-image: url('https://s3.music.126.net/mobile-new/img/index_icon_3x.png?49a82fee3e0fc602e9c8b25df2bda159=');
        background-repeat: no-repeat;
        background-size: 166px 95px;
    }
}

    @keyframes playing {
    from {
        // height: 50px;
        transform: scaleY(1);
    }
    to {
        // height: 10px;
        transform: scaleY(0.2);
    }
}
</style>
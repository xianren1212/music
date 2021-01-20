<template>
    <div class="nav">
        <div class="banner">
            <div class="shade"></div>
            <div class="hotopct">
                <div class="hoticon"></div>
                <p>更新日期：{{updateTime}}</p>
            </div>
        </div>

        <div class="musiclist">
            <ul>
                <HotSongListItem
                v-for="(item, index) in HotPlaylist" 
                :key="index"
                :item='item'
                :index='index'
                :currentMusic='$attrs.currentMusic'
                :paused='$attrs.paused'
                @update:music="$emit('update:music', $event)"
                @update:playlist="$emit('update:playlist', HotPlaylist
                )"
                ></HotSongListItem>
            </ul>
        </div>
    </div>

    
</template>
<script>
import HotSongListItem from "@/components/HotSongListItem.vue";

export default {
    props : ['HotPlaylist','updateTime'],
    components : {
        HotSongListItem
    }
}
</script>
<style scoped  lang="less">
.nav{
    margin-top: 67.5px;
    .banner{
        width: 100%;
        height: 140px;
        background-image: url('https://s3.music.126.net/mobile-new/img/hot_music_bg_3x.jpg?2bfefd3ba37eaffbd66b7d108b9de26a=');
        background-size: contain;
        position: relative;
        .shade{
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,.2);
        }
        .hotopct{
            position: absolute;
            left: 20px;
            top: 15%;
            text-align: left;
            .hoticon{
                width: 142px;
                height: 67px;
                background: url('https://s3.music.126.net/mobile-new/img/index_icon_2x.png?5207a28c3767992ca4bb6d4887c74880=') no-repeat;
                background-size: 166px 97px;
                background-position: -24px -30px;
            }
            p{
                margin-top: 10px;
                color: hsla(0,0%,100%,.8);
                font-size: 12px;
            }
        }
    }
    .musiclist{
        margin-bottom: 100px;
    }
}
</style>
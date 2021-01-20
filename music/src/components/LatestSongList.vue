<template>
    <section class="SongList">
        <BorderedTitle><slot></slot></BorderedTitle>
        <ul>
            <LatestSongListItem
            v-for="(item, index) in newsonglist" 
            :key="index"
            :item='item'
            :index='index'
            :currentMusic='$attrs.currentMusic'
            :paused='$attrs.paused'
            @update:music="$emit('update:music', $event)"
            @update:playlist="$emit('update:playlist', newsonglist)"
            ></LatestSongListItem>
        </ul>
    </section>
</template>

<script>
import BorderedTitle from "@/components/BorderedTitle.vue";
import LatestSongListItem from "@/components/LatestSongListItem.vue";

export default {
    props : {
        newsonglist : {
            type : Array
        }
    },
    components : {
        BorderedTitle,
        LatestSongListItem
    }
}
</script>
<style lang="less">
.SongList{
    margin-bottom: 100px;
}
</style>
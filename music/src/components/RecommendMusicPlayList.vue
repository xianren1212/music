<template>
    <section class="mtop">
        <BorderedTitle><slot></slot></BorderedTitle>
        <ul class="recommedmusicplaylist">
            <RmusicPlayListItem 
            v-for="(item,index) in currentRecommends"
            :key="index"
            :item='item'
            :index='index'
            :currentRecommends='currentRecommends'
            />
        </ul>
    </section>
</template>
<script>
import BorderedTitle from "@/components/BorderedTitle.vue";
import RmusicPlayListItem from "@/components/RmusicPlayListItem.vue";
export default {
    props : {
        currentRecommends : {
            type : Array
        }
    },
    components : {
        BorderedTitle,
        RmusicPlayListItem
    }
}
</script>
<style lang="less">
.mtop{
    margin-top: 90px;
    .recommedmusicplaylist{
        display: flex;
        flex-wrap: wrap;
    }

}
</style>
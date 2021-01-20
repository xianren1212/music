<template>
    <div class="search">
        <SearchMusic
            :SerchList='SerchList'
            :searchHot='searchHot'
            :currentMusic="$attrs.currentMusic"
            :paused="$attrs.paused"
            @update:music="$emit('update:music', $event)"
            @update:playlist="$emit('update:playlist', $event)"
            @update:something='something = $event'
            :updateTime='updateTime'
        ></SearchMusic>
    </div>
</template>
<script>
// 引入lodash
// var _ = require('lodash');

import SearchMusic from "@/components/SearchMusic.vue";

// console.log("_",_)
export default {
    data() {
        return {
            something : null,
            timer : null,
            // 热门搜索列表
            SerchList : [],
            // 推荐的歌曲
            searchHot : [],
            
            updateTime: 0,
            // 完成请求任务的请求数
            count : 0,
            countw : 0
        };
    },
    components: {
        SearchMusic
    },
    
    methods: {
        getData: function () {
            if(this.something == ''){
                this.SerchList = []
            }else{
                this.$root.isShowLoading = true;
                this.axios
                .get("/search/suggest?keywords=" + this.something + "&type=mobile")
                .then((response) => {
                    // console.log(response)
                    this.SerchList = response.data.result.allMatch
                    if(this.countw == 1){this.$root.isShowLoading = false;}
                    // console.log(this.SerchList)
                    
                });
            }
        },
    },
    watch: {
        something: function () {
            // 防抖
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                this.getData();
                this.countw = 1
            }, 1000);
            
        },
        // count: function(newCount){
        //     if(newCount > 0){
        //         this.$root.isShowLoading = false;
        //     }
        // }
    },
    created(){
        this.$root.isShowLoading = true;
        this.axios
        .get("/search/hot/detail")
        .then((response) => {
            // console.log(response)
            this.searchHot = response.data.data.slice(0,10)
            this.count = 1
            if(this.count == 1){this.$root.isShowLoading = false;}
        });
    }
    


}
</script>
<style lang="less">
    .search{
        margin-top: 70px;
    }
</style>
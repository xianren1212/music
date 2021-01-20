<template>
  <div class="recommend">

    <div v-show="isLoading" style="color: red">加载中</div>
    <RecommendMusicPlayList 
    :currentRecommends="currentRecommends"
      >推荐歌单</RecommendMusicPlayList
    >

    <LatestSongList
      :newsonglist="newsonglist"
      :currentMusic="$attrs.currentMusic"
      :paused="$attrs.paused"
      @update:music="$emit('update:music', $event)"
      @update:playlist="$emit('update:playlist', $event)"
      >最新音乐</LatestSongList
    >
  </div>
</template>

<script>
import RecommendMusicPlayList from "@/components/RecommendMusicPlayList.vue";
import LatestSongList from "@/components/LatestSongList.vue";

export default {
  data: function () {
    return {
      // recommends推荐歌单
      recommends: [],
      // newsonglist最新歌单
      newsonglist: [],
      // 推荐歌单的下标
      recommendsIndex: 0,
      // 数据是否加载出来再让页面显示
      isLoading : false,
      // 完成请求任务的数
      count : 0
    };
  },
  components: {
    RecommendMusicPlayList,
    LatestSongList,
  },
  // 计算属性，只要数组6个数据
  computed: {
    currentRecommends: function () {
      return this.recommends.slice(
        // 每次回来都是不一样的的歌单
        this.recommendsIndex * 6,
        6 * (this.recommendsIndex + 1)
      );
    },
  },
  created() {
    this.$root.isShowLoading = true;

    this.axios.get("/personalized").then((response) => {
      this.recommends = response.data.result;
      this.count += 1
    }),

    this.axios.get("/personalized/newsong").then((response) => {
      this.newsonglist = response.data.result;

      this.count += 1
    });
  },

  watch : {
    count: function(newCount){
      if(newCount >= 2){
        this.$root.isShowLoading = false;
      }
    }
  },
  // 每次回来都是不同的推荐音乐歌单
  // 首屏幕优化
  activated() {
    // console.log("切换")
    this.recommendsIndex = this.recommendsIndex >= 4 ? 0 : this.recommendsIndex + 1
  },
};
</script>

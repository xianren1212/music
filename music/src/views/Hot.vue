<template>
  <div class="hot">
    <HotSongList 
    :HotPlaylist='HotPlaylist'
    :updateTime='updateTime'
    :currentMusic="$attrs.currentMusic"
    :paused="$attrs.paused"
    @update:music="$emit('update:music', $event)"
    @update:playlist="$emit('update:playlist', $event)"
    />
  </div>
</template>
<script>
import HotSongList from "@/components/HotSongList.vue";

export default {
  components: {
    HotSongList,
  },
  data: function () {
    return {
      // 热歌榜歌单
      HotPlaylist: [],
      updateTime : 0
    };
  },
  methods: {
    // 时间转格式的方法
    CurentTime : function (now) {
        const date = new Date(now);
        // var y = date.getFullYear() ;// 年份
        var m = date.getMonth() +  1;// 月份，注意：js里的月要加1
        var d = date.getDate(); // 日
        // var h = date.getHours(); // 小时
        // var min = date.getMinutes() ;// 分钟
        // var s = date.getSeconds(); // 秒
        //返回值，根据自己需求调整，现在已经拿到了年月日时分秒了
        return m + '月' + d + '日'
    }
  },

  created() {
    // 请求热歌单的数据和设置Loading的状态
    this.$root.isShowLoading = true;
    this.axios
      .get("/top/list?idx=1")
      .then((response) => {
        // 当前月日
        this.updateTime = this.CurentTime( response.data.playlist.updateTime )
        
        // console.log(this.updateTime)
        // console.log(
        //   response.data.playlist.trackIds
        //     .slice(0, 20)
        //     .map((e) => e.id)
        //     .join()
        // );
        this.$root.isShowLoading = true;
        this.axios
          .get(
            "/song/detail?ids=" +
              response.data.playlist.trackIds
                .slice(0, 20)
                .map((e) => e.id)
                .join()
          )
          .then((response) => {
            // console.log(response.data)
            let hotlist = response.data.songs
            // console.log(hotlist)
            for(var i in hotlist){
              let HotPlaylistObj  = {}
              HotPlaylistObj.name = hotlist[i].name;
              HotPlaylistObj.id = hotlist[i].id;
              HotPlaylistObj.picUrl = hotlist[i].al.picUrl;
              HotPlaylistObj.song = {artists : hotlist[i].ar};
              HotPlaylistObj.al = hotlist[i].al.name;

              this.HotPlaylist.push(HotPlaylistObj)
            }

            // console.log(this.HotPlaylist)
          })
          .finally(() => {
            this.$root.isShowLoading = false;
          });
      })
      .finally(() => {
        this.$root.isShowLoading = false;
      });

        // this.currentRecommends[this.index].id

  },
};
</script>

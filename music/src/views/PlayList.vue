<template>
<!-- 如果数据还没有请求到，item为null，就先不让他显示 就不会报错数据为null-->
  <div v-if="item">
    <!-- <div v-for="(index) in recommendsa" :key="index"></div> -->
    <div class="header">
      <div class="bg" :style='{backgroundImage : "url("+ item.picUrl + ")"}'></div>
      <div class="wrap">
        <div class="wrapfl">
          <img :src="item.picUrl" alt="">
          <span>歌单</span>
          <i>{{ item.playCount | aboutPlayCount }}</i>
          <div class="zz"></div>
        </div>
        <div class="wrapfr">
          <h2>{{item.name}}</h2>
          <div class="thide" v-if="creator">
            <div class="icon">
              <img :src="creator.avatarUrl" alt="">
              <span></span>
            </div>
            <h6>{{creator.nickname}}</h6>
          </div>
        </div>
      </div>
    </div>
    <div class="title">
      <h4>歌曲列表</h4>
    </div>
    <!-- 复用 -->
    <LatestSongList
      :newsonglist="recommendsa"
      :currentMusic="$attrs.currentMusic"
      :paused="$attrs.paused"
      @update:music="$emit('update:music', $event)"
      @update:playlist="$emit('update:playlist', $event)"
      ></LatestSongList
    >
    <PlayListComment
    :comment='comment'
      ></PlayListComment
    >
  </div>
</template>
<script>
import LatestSongList from "@/components/LatestSongList.vue";
import PlayListComment from "@/components/PlayListComment.vue";
// import LatestSongListItem from "@/components/LatestSongListItem.vue";
export default {
//   props: ["recommends"],
  data() {
      return {
          recommendsa : [],
          item: null,
          // 歌曲封面内容
          creator : null,
          // 歌曲评论
          comment:[],
      }
  },
  components: {
    LatestSongList,
    PlayListComment
    // LatestSongListItem
  },
  
  // 被 keep-alive 缓存的组件激活时调用。该钩子在服务器端渲染期间不被调用。
  activated() {
    this.$root.isShowLoading = true;

    this.recommendsa = []
    // 当前的歌单
    this.item = this.$route.query.item
    // console.log(this.item)
    this.axios
      .get("/playlist/detail?id=" + this.$route.query.item.id)
      .then((response) => {
        this.creator = response.data.playlist.creator
        // console.log(response)

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
            let hotlist = response.data.songs;
            // console.log(hotlist)
            for (var i in hotlist) {
              let HotPlaylistObj = {};
              HotPlaylistObj.name = hotlist[i].name;
              HotPlaylistObj.id = hotlist[i].id;
              HotPlaylistObj.picUrl = hotlist[i].al.picUrl;
              HotPlaylistObj.song = { artists: hotlist[i].ar };
              HotPlaylistObj.al = hotlist[i].al.name;

              this.recommendsa.push(HotPlaylistObj);
            }

            // console.log(this.recommendsa);
          })
          .finally(() => {
            this.$root.isShowLoading = false;
          });
      })
      .finally(() => {
        this.$root.isShowLoading = false;
      });

    this.axios.get("/comment/playlist?id="+ this.$route.query.item.id + "&limit").then((res)=>{
      this.comment = res.data.comments
      console.log(this.comment)
    })
    
  },
  // 过滤器
  filters: {
    aboutPlayCount: function (value) {
      return (value / 10000).toFixed(1) + "万";
    },
  },
};
</script>
<style scoped lang="less">
  .header{
    position: relative;
    padding: 30px 10px 30px 15px;
    overflow: hidden;
    height: 200px;
    margin-top: -60px;
    .bg{
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
      filter: blur(20px);
      transform: scale(1.5);
      &::after{
        display: block;
        content:'';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        background-color: rgba(155, 94, 94, 0.5);
      }
    }
    .wrap{
      display: flex;
      position: relative;
      z-index: 2;
      .wrapfl{
        position: relative;
        width: 145px;
        height: 145px;
        background-color: #e2e2e3;
        img{
          width: 100%;
          vertical-align: middle;
        }
        span{
          position: absolute;
          z-index: 3;
          top: 10px;
          left: 0;
          padding: 0 8px;
          height: 17px;
          color: #fff;
          font-size: 9px;
          text-align: center;
          line-height: 17px;
          background-color: rgba(217,48,48,.8);
          border-top-right-radius: 17px;
          border-bottom-right-radius: 17px;
        }
        i{
          position: absolute;
          font-style: normal;
          right: 2px;
          top: 0;
          z-index: 3;
          padding-left: 15px;
          color: #fff;
          font-size: 12px;
          background-position: 0;
          background-repeat: no-repeat;
          background-size: 11px 10px;
          text-shadow: 1px 0 0 rgba(0,0,0,.15);
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMiAyMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMDQwMDAwIiBkPSJNMjIgMTYuNzc3YzAgMS4yMzMtMS4xMjEgMi4yMzMtMi41MDYgMi4yMzMtMS4zODQgMC0yLjUwNi0xLTIuNTA2LTIuMjMzdi0yLjU1M2MwLTEuMjM0IDEuMTIyLTIuMjMzIDIuNTA2LTIuMjMzLjE3NCAwIC4zNDMuMDE3LjUwNi4wNDZ2LTEuMzdoLS4wMzNjLjAxNy0uMjIuMDMzLS40NDEuMDMzLS42NjZhOCA4IDAgMCAwLTE2IDBjMCAuMjI1LjAxNi40NDYuMDM0LjY2Nkg0djEuMzdjLjE2My0uMDI5LjMzMy0uMDQ2LjUwNS0uMDQ2IDEuMzg0IDAgMi41MDYuOTk5IDIuNTA2IDIuMjMzdjIuNTUzYzAgMS4yMzMtMS4xMjIgMi4yMzMtMi41MDYgMi4yMzNTMiAxOC4wMTEgMiAxNi43Nzd2LTIuNTUzYzAtLjI1OC4wNTktLjUwMS4xNDgtLjczQS45ODIuOTgyIDAgMCAxIDIgMTMuMDAxdi0yLjY2N2MwLS4wMjMuMDEyLS4wNDMuMDEzLS4wNjctLjAwNC0uMDg4LS4wMTMtLjE3Ni0uMDEzLS4yNjYgMC01LjUyMyA0LjQ3Ny0xMCAxMC0xMHMxMCA0LjQ3NyAxMCAxMGMwIC4wOS0uMDA5LjE3OC0uMDE0LjI2Ni4wMDIuMDI0LjAxNC4wNDQuMDE0LjA2N3YyYS45ODguOTg4IDAgMCAxLS4zNi43NTNjLjIyNC4zMzQuMzYuNzIuMzYgMS4xMzh2Mi41NTIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI2ZmZiIgZD0iTTIwIDE2Ljc3N2MwIDEuMjMzLTEuMTIxIDIuMjMzLTIuNTA2IDIuMjMzLTEuMzg0IDAtMi41MDYtMS0yLjUwNi0yLjIzM3YtMi41NTNjMC0xLjIzNCAxLjEyMi0yLjIzMyAyLjUwNi0yLjIzMy4xNzQgMCAuMzQzLjAxNy41MDYuMDQ2di0xLjM3aC0uMDMzYy4wMTctLjIyLjAzMy0uNDQxLjAzMy0uNjY2YTggOCAwIDAgMC0xNiAwYzAgLjIyNS4wMTYuNDQ2LjAzNC42NjZIMnYxLjM3Yy4xNjMtLjAyOS4zMzMtLjA0Ni41MDUtLjA0NiAxLjM4NCAwIDIuNTA2Ljk5OSAyLjUwNiAyLjIzM3YyLjU1M2MwIDEuMjMzLTEuMTIyIDIuMjMzLTIuNTA2IDIuMjMzUzAgMTguMDExIDAgMTYuNzc3di0yLjU1M2MwLS4yNTguMDU5LS41MDEuMTQ4LS43M0EuOTgyLjk4MiAwIDAgMSAwIDEzLjAwMXYtMi42NjdjMC0uMDIzLjAxMi0uMDQzLjAxMy0uMDY3LS4wMDQtLjA4OC0uMDEzLS4xNzYtLjAxMy0uMjY2IDAtNS41MjMgNC40NzctMTAgMTAtMTBzMTAgNC40NzcgMTAgMTBjMCAuMDktLjAwOS4xNzgtLjAxNC4yNjYuMDAyLjAyNC4wMTQuMDQ0LjAxNC4wNjd2MmEuOTg4Ljk4OCAwIDAgMS0uMzYuNzUzYy4yMjQuMzM0LjM2LjcyLjM2IDEuMTM4djIuNTUyIi8+PC9zdmc+');
        }
        .zz{
          position: absolute;
          top: 0;
          display: block;
          content: '';
          width: 100%;
          height: 18px;
          z-index: 2;
          background-image: linear-gradient(90deg,rgba(0,0,0,0),rgba(0,0,0,.7));
        }
      }
      
      .wrapfr{
        -webkit-box-flex: 1;
        -webkit-flex: 1 1 auto;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        width: 1%;
        margin-left: 16px;
        h2{
          padding-top: 1px;
          font-size: 17px;
          line-height: 1.3;
          text-align: left;
          color: #fefefe;
          height: 44px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .thide{
          display: block;
          position: relative;
          top: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: normal;
          text-align: left;
          display: flex;
          align-items: center;
          justify-items: center;
          .icon{
            width: 30px;
            height: 30px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 5px;
            display: flex;
            position: relative;
            img{
              border-radius: 50%;
              width: 100%;
              vertical-align: middle;
            }
            span{
              position: absolute;
              right: -5px;
              bottom: 0;
              width: 12px;
              height: 12px;
              background-image: url('https://s3.music.126.net/mobile-new/img/usericn_2x.png?6423c0681bfb3358d5c684c9b998e412=');
              background-repeat: no-repeat;
              background-size: 75px auto;
              background-position: -40px 0;
            }
          }
          h6{
            display: inline-block;
            flex: 1;
            color:white;
            font-size: 15px;
          }
        }
      }
    }
  }
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
</style>
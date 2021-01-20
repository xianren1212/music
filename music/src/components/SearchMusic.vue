<template>
  <div class="serchBox">
    <div class="serchb">
      <div class="serchInput">
        <i class="oneI"></i>
        <input
          type="text"
          v-model="something"
          @input="inputCut"
          @keyup.enter="KeyCallElse"
        />
        <label v-if="isLabel">搜索歌曲、歌手、专辑</label>
        <i class="twoI" v-show="isX" @click="ICut"></i>
      </div>
    </div>

    <div class="one" v-if="isOne">
      <div class="serchli" v-if="isSearchHot">
        <h6>搜索"{{ something }}"</h6>
        <ul @click="isOne = false">
          <li
            @click="matchingMusic(item.keyword)"
            v-for="(item, index) in SerchList"
            :key="index"
            @update:matchingMusicList="matchingMusicList = $event"
          >
            <i></i>
            <span>
              {{ item.keyword }}
            </span>
          </li>
          <!-- <SerchMusicItem
              :item="item"
              :index="index"
              v-for="(item, index) in SerchList"
              :key="index"
              @update:matchingMusicList="matchingMusicList = $event"
            ></SerchMusicItem> -->
        </ul>
      </div>

      <div class="searchHot" v-else>
        <h6>热门搜索</h6>
        <div
          class="hot"
          v-for="(item, index) in searchHot"
          :key="index"
          @click="
            callElse(item.searchWord);
            isX = true;
          "
        >
          {{ item.searchWord }}
        </div>

        <div class="record">
          <ul v-if="records[0] !== ''">
            <li v-for="(item, index) in records" :key="index">
              <i class="u-svg-histy"></i>
              <span @click='recordCut(item)'>{{item}}</span>
              <i class="u-svg-close" @click='deleteRecord(index)'></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="two" v-else>
      <ul>
        <li
          v-for="(item, index) in matchingMusicList"
          :key="index"
          :currentMusic="$attrs.currentMusic"
          :paused="$attrs.paused"
          @click="
            $emit('update:music', { item, index });
            $emit('update:playlist', matchingMusicList);
            getCover(item.name);
          "
        >
          <div class="info">
            <h5>
              {{ item.name }}
            </h5>
            <p>
              <span class="sq"></span>
              <span>
                {{ item.name }}
              </span>
              <span class="zuozhe"> -{{ item.song.artists[0].name }} </span>
            </p>
          </div>
          <div class="icon">
            <span
              class="playing"
              v-if="currentMusic && currentMusic.id === item.id"
              :class="{ paused: paused }"
            >
              <i></i>
              <i class="one"></i>
              <i class="two"></i>
              <i></i>
            </span>
            <span class="play" v-else></span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import SerchMusicItem from "@/components/SerchMusicItem.vue";
export default {
  props: ["SerchList", "searchHot", "currentMusic", "paused"],
  components: {
    // SerchMusicItem,
  },
  data() {
    return {
      // 输入框的值
      something: null,
      //搜索的歌单
      matchingMusicList: [],
      // 记录搜索内容的数组
      record: [],
      records: [],
      // 显示搜索列表或者搜索的歌单
      isOne: true,
      // 显示隐藏label
      isLabel: true,
      // 显示隐藏x
      isX: false,
      // 显示隐藏热门搜索
      isSearchHot: false,
      // 完成请求任务的请求数
      countq: false,
    };
  },
  methods: {
    getCover: function (coverName) {
      this.$root.isShowLoading = true;
      this.axios.get("/search/multimatch?keywords=" + coverName).then((res) => {
        for (var k in this.matchingMusicList) {
          if (res.data.result.mv != undefined) {
            this.matchingMusicList[k].picUrl = res.data.result.mv[0].cover;
          } else {
            this.matchingMusicList[k].picUrl =
              "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg";
          }
        }
        if (this.countq) {
          this.$root.isShowLoading = false;
        }
      });
    },
    // 搜索的歌单
    matchingMusic: function (newVlue) {
      this.matchingMusicList = [];
      this.$root.isShowLoading = true;

      this.axios.get("/search?keywords=" + newVlue).then((response) => {
        // this.matchingMusicList = response.data.result.songs
        let hotlist = response.data.result.songs;
        // console.log(hotlist);

        for (var i in hotlist) {
          let HotPlaylistObj = {};
          HotPlaylistObj.name = hotlist[i].name;
          HotPlaylistObj.id = hotlist[i].id;
          HotPlaylistObj.picUrl = this.imgs;
          HotPlaylistObj.song = { artists: hotlist[i].artists };
          HotPlaylistObj.al = hotlist[i].artists[0].name;
          this.matchingMusicList.push(HotPlaylistObj);
        }
        // 数组去重和然后搜索的内容最新的最近显示
        if(this.record.indexOf(newVlue) == -1){
            this.record.unshift(newVlue)
            localStorage.setItem('record',this.record)
        }else{
          for(var k in this.records){
            if(this.records[k] == newVlue){
              this.records.splice(k,1);
              this.records.unshift(newVlue)
              localStorage.setItem('record',this.records)
            }
          }
        }
        this.records = localStorage.getItem("record").split(',');

        // 将输入的something的值插入记录搜索内容的数组中
        // console.log(111)
        if (this.countq) {
          this.$root.isShowLoading = false;
        }
      });
    },
    // 点击历史搜索内容调用请求数据和隐藏显示一些内容
    recordCut: function(newValue){

      this.isX = true;
      this.callElse(newValue)
    },
    // 点击历史搜索内容的删除时删除数组的对应的内容
    deleteRecord:function(index){
      // if(!this.records){
        this.records.splice(index,1)
        localStorage.setItem('record',this.records)
      // }
    },
    // 点击推荐的内容调用请求数据和隐藏显示一些内容
    callElse: function (newValue) {
      this.countq = true;
      this.matchingMusicList = [];
      // 先清楚之前的数据
      this.something = newValue;
      this.isLabel = false;
      this.isOne = false;
      this.matchingMusic(newValue);
      // console.log(this.countq)
    },
    inputCut: function () {
      this.$emit("update:something", this.something);
      if (this.something == "") {
        this.isLabel = true;
        this.isX = false;
        this.isSearchHot = false;
        this.isOne = true;
      } else {
        this.isLabel = false;
        this.isX = true;
        this.isSearchHot = true;
      }
    },
    ICut: function () {
      this.something = null;
      this.isX = false;
      this.isLabel = true;
      this.isOne = true;
      this.isSearchHot = false;
    },
    // 回车事件
    KeyCallElse: function () {
      this.matchingMusicList = [];
      // 先清楚之前的数据
      if (this.something == null) {
        this.isLabel = true;
      } else {
        this.isLabel = false;
        this.callElse(this.something);
      }
    },
  },
  created()  {
    this.records = localStorage.getItem("record").split(',');
    // console.log(this.records)
  },
  deactivated () {
    this.ICut();
  }
};
</script>
<style scoped lang="less">
.serchBox {
  width: 100%;
  .serchb {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .serchInput {
      display: flex;
      position: relative;
      width: 92%;
      height: 30px;
      padding: 0 30px;
      box-sizing: border-box;
      background: #ebecec;
      border-radius: 30px;

      i.oneI {
        position: absolute;
        left: 0;
        top: 9px;
        margin: 0 8px;
        vertical-align: middle;
        width: 13px;
        height: 13px;
        background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNiAyNiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljOWNhIiBkPSJNMjUuMTgxIDIzLjUzNWwtMS40MTQgMS40MTQtNy4zMTUtNy4zMTRBOS45NjYgOS45NjYgMCAwIDEgMTAgMjBDNC40NzcgMjAgMCAxNS41MjMgMCAxMFM0LjQ3NyAwIDEwIDBzMTAgNC40NzcgMTAgMTBjMCAyLjM0Mi0uODExIDQuNDktMi4xNiA2LjE5NWw3LjM0MSA3LjM0ek0xMCAyYTggOCAwIDEgMCAwIDE2IDggOCAwIDAgMCAwLTE2eiIvPjwvc3ZnPg==");
      }
      i.twoI {
        position: absolute;
        right: 7px;
        top: 50%;
        margin-top: -7px;
        width: 14px;
        height: 14px;
        background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOCAyOCI+PGcgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjYmNiZGJkIiBkPSJNMTQgMGM3LjczMiAwIDE0IDYuMjY4IDE0IDE0cy02LjI2OCAxNC0xNCAxNFMwIDIxLjczMiAwIDE0IDYuMjY4IDAgMTQgMHoiLz48cGF0aCBkPSJNMTkgOUw5IDE5TTkgOWwxMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZWJlY2ViIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIi8+PC9nPjwvc3ZnPg==");
        background-position: 0 0;
        background-size: contain;
        background-repeat: no-repeat;
      }
      input {
        flex: 1;
        width: 100%;
        height: 30px;
        line-height: 18px;
        border-radius: 0;
        border: 0;
        background: rgba(0, 0, 0, 0);
        font-size: 14px;
        color: #333;
        outline: none;
      }
      label {
        position: absolute;
        left: 30px;
        top: 5px;
        font-size: 14px;
        color: #c9c9c9;
        background: rgba(0, 0, 0, 0);
        pointer-events: none;
      }
    }
  }
  .one {
    width: 100%;
    .serchli {
      width: 100%;
      h6 {
        height: 50px;
        margin-left: 10px;
        padding-right: 10px;
        font-size: 15px;
        line-height: 50px;
        color: #507daf;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        text-align: left;
      }
      ul {
        li {
          text-align: left;
          display: flex;
          height: 45px;
          padding-left: 10px;
          align-items: center;
          i {
            flex: 0 0 auto;
            margin-right: 7px;
            width: 15px;
            height: 15px;
            background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMDQwMDAwIiBkPSJNMjguMTgxIDI3LjUzNWwtMS40MTQgMS40MTQtNy43NTUtNy43NTRBMTEuNDQ1IDExLjQ0NSAwIDAgMSAxMS41IDI0QzUuMTQ5IDI0IDAgMTguODUyIDAgMTIuNSAwIDYuMTQ5IDUuMTQ5IDEgMTEuNSAxIDE3Ljg1MiAxIDIzIDYuMTQ5IDIzIDEyLjVjMCAyLjc1Ni0uOTczIDUuMjg1LTIuNTg5IDcuMjY2bDcuNzcgNy43Njl6TTExLjUgM2E5LjUgOS41IDAgMSAwIDAgMTkgOS41IDkuNSAwIDAgMCAwLTE5eiIgb3BhY2l0eT0iLjMiLz48L3N2Zz4=");
            display: inline-block;
            vertical-align: middle;
            background-position: 0 0;
            background-size: contain;
            background-repeat: no-repeat;
          }
          span {
            flex: 1;
            padding-right: 10px;
            font-size: 15px;
            line-height: 45px;
            color: #333;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
    .searchHot {
      width: 100%;
      text-align: left;
      padding: 10px;
      h6 {
        font-size: 12px;
        line-height: 12px;
        color: #666;
        margin-bottom: 10px;
      }
      div.hot {
        display: inline-block;
        height: 32px;
        box-sizing: border-box;
        margin-right: 8px;
        margin-bottom: 8px;
        padding: 0 14px;
        font-size: 14px;
        line-height: 32px;
        color: #333;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 60px;
      }
      .record {
        width: 100%;
        margin-top: 20px;
        ul {
          li {
            width: 100%;
            display: flex;
            align-items: center;
            height: 50px;
            line-height: 50px;
            border-color: rgba(0,0,0,.1);
            i{
              display: inline-block;
              vertical-align: middle;
              background-position: 0 0;
              background-size: contain;
              background-repeat: no-repeat;
            }
            span{
              padding-left: 10px;
              flex: 1;
              font-size: 14px;
              border-bottom: 1px solid rgba(0,0,0,.1);
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            i.u-svg-histy {
              width: 15px;
              height: 15px;
              background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljYWNhIiBkPSJNMTUgMzBDNi43MTYgMzAgMCAyMy4yODQgMCAxNVM2LjcxNiAwIDE1IDBzMTUgNi43MTYgMTUgMTUtNi43MTYgMTUtMTUgMTVtMC0yOEM3LjgyIDIgMiA3LjgyIDIgMTVzNS44MiAxMyAxMyAxMyAxMy01LjgyIDEzLTEzUzIyLjE4IDIgMTUgMm03IDE2aC04YTEgMSAwIDAgMS0xLTFWN2ExIDEgMCAxIDEgMiAwdjloN2ExIDEgMCAxIDEgMCAyIi8+PC9zdmc+");
            }
            i.u-svg-close{
              width: 12px;
              height: 12px;
              background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjOTk5ODk5IiBkPSJNMTMuMzc5IDEybDEwLjMzOCAxMC4zMzdhLjk3NS45NzUgMCAxIDEtMS4zNzggMS4zNzlMMTIuMDAxIDEzLjM3OCAxLjY2MyAyMy43MTZhLjk3NC45NzQgMCAxIDEtMS4zNzgtMS4zNzlMMTAuNjIzIDEyIC4yODUgMS42NjJBLjk3NC45NzQgMCAxIDEgMS42NjMuMjg0bDEwLjMzOCAxMC4zMzhMMjIuMzM5LjI4NGEuOTc0Ljk3NCAwIDEgMSAxLjM3OCAxLjM3OEwxMy4zNzkgMTIiLz48L3N2Zz4=');
            }
          }
        }
      }
    }
  }
  .two {
    ul {
      li {
        display: flex;
        border-bottom: 1px solid #f2f2f3;
        height: 54px;
        align-items: center;
        margin-left: 10px;
        .info {
          flex: 1;
          text-align: left;
          h5 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 95%;
          }
          p {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #888;
            font-size: 12px;
            width: 95%;
          }
          .sq {
            display: inline-block;
            width: 12px;
            height: 8px;
            margin-right: 4px;
            background: url("https://s3.music.126.net/mobile-new/img/index_icon_2x.png?5207a28c3767992ca4bb6d4887c74880=")
              no-repeat;
            background-size: 166px 97px;
          }
          .zuozhe {
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
              background: linear-gradient(
                to bottom,
                #ed6ea0,
                #ec8c69,
                #f7186a,
                #fbb03b
              );
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
            .one {
              animation-delay: -0.2s;
            }
            .two {
              animation-delay: -0.4s;
            }
            &.paused {
              i {
                animation-play-state: paused;
              }
            }
          }
        }
        .play {
          display: block;
          width: 23px;
          height: 23px;
          margin-top: 4px;
          background-position: -24px 0;
          background-image: url("https://s3.music.126.net/mobile-new/img/index_icon_3x.png?49a82fee3e0fc602e9c8b25df2bda159=");
          background-repeat: no-repeat;
          background-size: 166px 95px;
        }
      }
    }
  }
}
</style>
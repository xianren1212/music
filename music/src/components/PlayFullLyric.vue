<template>
  <div v-if="lyricArr" class="lyric" @click="$emit('toggleShowLyric')">
    <div
      class="lyricbox"
      :style="{
        marginTop: -30 * topIndex + 210 + 'px',
      }"
      ref="lyricbox"
    >
      <ul @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
        <li
          v-for="(item, index) in lyricArr"
          :key="item.time"
          ref="lis"
          :class="{ lineHigh: topIndex - 1 == index ? true : false }"
        >
          {{ item.text || "..." }}
        </li>
      </ul>
    </div>
    <div class="xian" v-if="isXian">
      <i>▲</i>
      <div class="two"></div>
      <span
        >{{ timeF > 10 ? timeF : "0" + timeF }}:{{
          timeS > 10 ? timeS : "0" + timeS
        }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: ["currentTime", "currentMusica", "lyricArr", "topIndex"],
  data() {
    return {
      scrollY: 0,
      // 提示线
      isXian: false,
      timeF: 0,
      timeS: 0,
      // 歌词将要去到的时间
      ct: 0,
    };
  },
  methods: {
    touchstart: function (e) {
      this.touching = true;
      this.Y = e.touches[0].clientY;
      this.$emit("updateTouchstart", this.touching);
    },
    touchmove: function (e) {
      this.isXian = true;
      this.scrollY = Math.floor((this.Y - e.touches[0].clientY) / 30);

      if (this.topIndex - 1 + this.scrollY < 0) {
        this.ct = 0;
      } else if (this.topIndex - 1 + this.scrollY > this.lyricArr.length - 1) {
        this.ct = this.lyricArr[this.lyricArr.length - 1].time;
      } else {
        this.ct = this.lyricArr[this.topIndex - 1 + this.scrollY].time;
        // 让盒子移动
        this.$refs.lyricbox.style.marginTop =
          -30 * (this.topIndex - 1 + this.scrollY) + 210 + "px";
        // 设置类名
        for (var k in this.$refs.lis) {
          this.$refs.lis[k].removeAttribute("class");
        }
        this.$refs.lis[this.topIndex - 1 + this.scrollY].className = "lineHigh";
        this.timeF = parseInt(this.ct / 60);
        this.timeS = parseInt(this.ct % 60);
      }
    },
    touchend: function () {
      this.touching = false;
      this.$emit("updateCurrentTime", this.ct);
      setTimeout(() => {
        this.isXian = false;
      }, 500);
      this.$emit("updateTouchend", this.touching);
    },
    // lineHigh(){
    //     let ulist = this.$refs.ul
    //     let list =  ulist.getElementsByTagName("li")
    //     if(this.topIndex > 0){
    //         list[this.topIndex - 2].removeAttribute("class")
    //     }
    //     list[this.topIndex - 1].className = "lineHigh"
    // },
    // 获取歌词的方法
    // paresLyric(lyric) {
    //     let patt = /\[\d{2}:\d{2}\.\d{2,3}\]/gi;
    //     let arr = lyric
    //     .split("\n")
    //     .filter((e) => e)
    //     .map((str) => {
    //         var time = str.match(patt)[0].replace(/(\[|\])/gi, "");
    //         var timeArr = time.split(":");
    //         time = Number(timeArr[0]) * 60 + Number(timeArr[1]);
    //         var text = str.replace(patt, "");
    //         return { time, text };
    //     });
    //     return arr;
    // }
  },
};
</script>

<style lang="less">
li.lineHigh {
  // color: red !important;
  color: red !important;
  font-size: 19px !important;
  // transition: all 0.2s;
}
.lyric {
  width: 100%;
  height: 420px;
  // background: red;
  position: fixed;
  top: 45%;
  margin-top: -225px;
  color: white;
  overflow: hidden;
  .lyricbox {
    // overflow: scroll;
    margin-top: 210px;
    // background-color: red;
    position: relative;
    ul {
      line-height: 30px;
      li {
        height: 30px;
        font-size: 17px;
        color: white;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .xian {
    display: flex;
    position: fixed;
    width: 100%;
    height: 40px;
    line-height: 40px;
    top: 50%;
    margin-top: -60px;
    z-index: 88;
    // background: red;
    i {
      transform: rotate(90deg);
      color: white;
      font-size: 12px;
    }
    .two {
      width: 90%;
      flex: 1;
      height: 1px;
      background: rgba(206, 195, 195, 0.4);
      margin-top: 20px;
    }
    span {
      color: white;
      font-size: 12px;

    }
  }
}
</style>
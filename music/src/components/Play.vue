<template>
  <div class="play" :class="{ paused: paused }">
    <!-- 把audio的controls、style删除，让其不显示，不能直接把audio删除，因为要获取到当前播放的歌曲，通过自定义组件来修改其状态 -->
    <audio
      :src="
        'https://music.163.com/song/media/outer/url?id=' +
        currentMusic.id +
        '.mp3'
      "
      autoplay
      ref="audio"
    ></audio>

    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__slideInUp"
      leave-active-class="animate__animated animate__slideOutDown"
    >
      <!-- 自定义音乐组件 -->
      <div
        class="play-bar"
        v-show="isShowPlayBar"
        @click="isShowPlayBar = false"
      >
        <!-- 歌曲封面 -->
        <img :src="currentMusic.picUrl" alt="" />
        <!-- 歌曲名称歌手 -->
        <div class="text">
          <h6>
            {{ currentMusic.name }}
          </h6>
          <p>-{{ currentMusic.song.artists[0].name }}-</p>
        </div>
        <!--暂停播放歌曲  -->
        <div class="control" @click.stop="togglePlayState">
          <canvas v-if="currentTime" ref="circle" width="50" height="50"></canvas>
          <div class="icon">
            <svg
              v-if="paused"
              t="1608126785269"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4642"
              width="200"
              height="200"
            >
              <path
                d="M275.2 185.6v656L812.8 512z"
                fill="#d81e06"
                p-id="4643"
              ></path>
            </svg>
            <svg
              v-else
              t="1608126580904"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4389"
              width="200"
              height="200"
            >
              <path
                d="M716.805 780.798V243.2c0-21.205-17.197-38.404-38.404-38.404S640 221.993 640 243.2v537.598c0 21.205 17.197 38.393 38.402 38.393s38.404-17.188 38.404-38.393z m-332.804 0V243.2c0-21.205-17.188-38.404-38.391-38.404-21.216 0-38.404 17.197-38.404 38.404v537.598c0 21.205 17.188 38.393 38.404 38.393 21.203 0 38.39-17.188 38.39-38.393z"
                fill="#d81e06"
                p-id="4390"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </transition>

    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div class="play-full" v-if="!isShowPlayBar">
        <div
          class="shade"
          :style="{
            backgroundImage: 'url(' + currentMusic.picUrl + ')',
          }"
        ></div>
        <div class="details">
          <PlayFullHeader
            :currentMusica="currentMusic"
            @showPlayBar="isShowPlayBar = true"
            :paused='paused'
            :isShowLyric='isShowLyric'
          />
          <template>
            <PlayFullLyric
              v-if="isShowLyric"
              @toggleShowLyric="isShowLyric = !isShowLyric"
              :currentTime="currentTime"
              @updateCurrentTime="$refs.audio.currentTime = $event"
              :lyricArr="lyricArr"
              :topIndex="topIndex"
              @updateTouchstart="touching = $event"
              @updateTouchend="touching = $event"
            />
            <PlayFullCover
              :currentMusica="currentMusic"
              :paused="paused"
              :patternF='patternF'
              v-else
              @toggleShowLyric="isShowLyric = !isShowLyric"
            />
          </template>
          <PlayFullFooter
            v-bind:currentTime="currentTime"
            v-bind:duration="duration"
            :paused="paused"
            :isShowLyric="isShowLyric"
            @togglePlayStateFoot="togglePlayStateFoot"
            @update:currentTime="$refs.audio.currentTime = $event"
            @calculateNextFoot="calculateNextFoot"
            @calculateLastFoot="calculateLastFoot"
            :patternF='patternF'
            @shunxu="patternF = $event"
            @suiji="patternF = $event"
            @danqu="patternF = $event"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import PlayFullHeader from "@/components/PlayFullHeader.vue";
import PlayFullCover from "@/components/PlayFullCover.vue";
import PlayFullLyric from "@/components/PlayFullLyric.vue";
import PlayFullFooter from "@/components/PlayFullFooter.vue";
export default {
  // currentMusic当前播放的歌曲 currentIndex当前播放歌曲在数组中的下标
  // playlist当前播放歌曲的数组
  props: ["currentMusic", "currentIndex", "playlist", "lyricArr"],
  components: {
    // 歌词页面的头部
    PlayFullHeader,
    // 歌词页面的封面
    PlayFullCover,
    // 歌词详情页面
    PlayFullLyric,
    // 歌词页面的底部
    PlayFullFooter,
  },
  data: function () {
    return {
      paused: null,
      // 当前歌曲的总时间
      duration: 0,
      // 歌曲的当前时间
      currentTime: 0,
      // 歌词页面的切换
      isShowLyric: false,
      // 是否显示自定义播放器
      isShowPlayBar: true,
      // 当前歌词的下标
      topIndex: 0,
      // 设置滑动的时候是否开始监听时间赋值，来让音乐没有加快的声音
      touching: false,
      // 播放模式
      patternF: "shunxu",
    };
  },
  mounted() {
    let audio = this.$refs.audio;
    // console.log(audio)
    audio.addEventListener("pause", () => {
      this.paused = true;
    });
    audio.addEventListener("play", () => {
      this.paused = false;
    });
    // 当前歌曲的总时长
    audio.addEventListener("durationchange", () => {
      this.duration = audio.duration;
    });
    // 歌曲播放的当前时长
    audio.addEventListener("timeupdate", () => {
      this.currentTime = audio.currentTime;
      // 调用圆的方法,放判断解决Cannot read property 'getContext' of undefined
      if(this.$refs.circle){
        this.drawCircle(this.currentTime, this.duration);

      }
    });
    // 播放完成开始下一曲
    audio.addEventListener("ended", () => {
      this.playNext();
      console.log("播放完毕");
    });
  },
  methods: {
    // 绘制圆的方法
    drawCircle: function (start, end) {
      let canvas = this.$refs.circle;
      let ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, 50, 50);
      ctx.beginPath();
      ctx.strokeStyle = "#ccc";
      ctx.arc(25, 25, 20, 0, Math.PI * 2, false);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.arc(
        25,
        25,
        20,
        Math.PI * -0.5,
        Math.PI * ((start / end) * 2 - 0.5),
        false
      );
      ctx.stroke();
      ctx.closePath();
    },
    // 播放与暂停
    togglePlayState: function () {
      let audio = this.$refs.audio;
      this.paused ? audio.play() : audio.pause();
      this.$event;
    },
    // 为了随机播放设置葛随机数的方法
    getRandom: function(){
      let index;
      index = Math.floor(Math.random() * this.playlist.length);
      return index;
    },
    // 封装方法根据当前播放模式 随机 单曲循环 顺序 顺序循环
    // 下一首
    calculateAutoNext: function () {
      // 计算当前播放歌曲的索引
      let nextAutoIndex;
      // 列表播放
      if (this.patternF == "shunxu") {
        if (this.currentIndex < this.playlist.length - 1) {
          nextAutoIndex = this.currentIndex + 1;
        } else {
          nextAutoIndex = 0;
        }
        // 不让其显示暂停的按钮
        this.paused = false
        return nextAutoIndex;
      }
      // 单曲播放
      else if(this.patternF == "danqu"){
        nextAutoIndex = this.currentIndex
        this.$refs.audio.play();
        this.paused = false
        return nextAutoIndex;
      }
      // 随机
      else if(this.patternF == "suiji"){
        nextAutoIndex = this.getRandom();
        console.log(this.currentIndex,nextAutoIndex)
        if(this.currentIndex == nextAutoIndex){
          // 这里要加上return重新调用一下这个方法得到返回值来解决值虽然变化了，
          // 但是歌曲不播放，播放器关闭的bug，不加return是没有返回值的，
          // 进不去下面的else中的return
          return this.calculateAutoNext();
        }else{
          return nextAutoIndex;
        }
      }
    },
    calculateNext: function () {
      // 计算当前播放歌曲的索引
      let nextIndex;
      if (this.currentIndex < this.playlist.length - 1) {
        nextIndex = this.currentIndex + 1;
      } else {
        nextIndex = 0;
      }
      return nextIndex;
    },
    calculateLast: function () {
      // 计算当前播放歌曲的索引
      // 上一首
      let lastIndex;
      if (this.currentIndex > 0) {
        lastIndex = this.currentIndex - 1;
      } else {
        lastIndex = this.playlist.length - 1;
      }
      return lastIndex;
    },
    // 自动播放歌曲播放完调用此方法
    playNext: function () {
      // 自动下一首歌曲的下标
      let indexAutoNext = this.calculateAutoNext();
      // 子传父下标和下一首歌曲
      this.$emit("update:Autonextmusic", {
        item: this.playlist[indexAutoNext],
        indexAutoNext,
      });
    },
    calculateNextFoot: function () {
      let nextIndex;
      // 播放模式为随机的时候，下一首歌曲也要随机
      // 下一首歌曲的下标
      if(this.patternF == "suiji"){
        nextIndex = this.calculateAutoNext();
      }else{
        nextIndex = this.calculateNext();
      }
      this.$emit("update:nextmusic", {
        item: this.playlist[nextIndex],
        nextIndex,
      });
    },
    calculateLastFoot: function () {
      // 播放模式为随机的时候，上一首歌曲也要随机
      let lastIndex
      // 上一首歌曲的下标
      if(this.patternF == "suiji"){
        lastIndex = this.calculateAutoNext();
      }else{
        lastIndex = this.calculateLast();
      }
      this.$emit("update:lastmusic", {
        item: this.playlist[lastIndex],
        lastIndex,
      });
    },

    // 儿子传过来的自定义事件,调用歌曲播放的状态事件
    togglePlayStateFoot: function () {
      this.togglePlayState();
    },
  },
  // 监听歌曲的播放状态
  watch: {
    paused: function (n) {
      this.$emit("update:paused", n);
    },
    // 监听时间的最新值做判断
    // 时间变化时拿到数组的最新下标
    currentTime: function (newTime) {
      // console.log(newTime)
      // newTime为空的时候会报错
      if (this.lyricArr) {
        let index = this.lyricArr.findIndex((element) => {
          return element.time > newTime;
        });
        if (index > 0) {
          this.topIndex = index;

          // console.log(this.topIndex)
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.play {
  &.paused {
    .play-bar {
      img {
        animation-play-state: paused;
      }
    }
  }
  .play-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    // background: linear-gradient(to left, #f5ce62, #e43603, #fa7199, #e85a19);
    background-color: white;
    box-shadow: 0 4px 15px 0 rgba(221, 215, 213, 0.75);
    display: flex;
    align-items: center;
    padding: 5px;
    // box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.15);
    img {
      width: 45px;
      height: 45px;
      margin: 7px;
      border-radius: 50%;
      animation: playing 6s linear infinite;
      // box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
      box-shadow: 0 4px 5px 0 rgba(115, 99, 121, 0.75);
    }
    .text {
      flex: 1;
      h6 {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      p {
        font-size: 12px;
      }
    }
    .control {
      width: 50px;
      height: 50px;
      position: relative;
      .icon {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        // background: turquoise;
        text-align: center;
        svg {
          margin-left: 10px;
          width: 60%;
        }
      }
    }
  }
  .play-full {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    background: black;
    .shade {
      position: fixed;
      z-index: 10;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 1;
      transform: scale(1.5);
      transform-origin: center center;
      filter: blur(30px);
      background-color: #161824;
      background-position: 50%;
      background-repeat: no-repeat;
      background-size: auto 100%;
      overflow: hidden;
      &::after {
        display: block;
        width: 100%;
        height: 100%;
        content: "";
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
    .details {
      width: 100%;
      height: 100%;
      position: relative;
      top: 0;
      left: 0;
      overflow: hidden;
      z-index: 12;
    }
  }
}

// 自定义动画
@keyframes playing {
  form {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
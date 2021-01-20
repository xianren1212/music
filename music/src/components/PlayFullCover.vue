<template>
  <div class="cover" @click="$emit('toggleShowLyric')">
    <div class="coverxx" :class="{ paused: paused }">
      <div
        class="turn"
        :style="{
          backgroundImage: 'url(' + currentMusica.picUrl + ')',
        }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["currentMusica", "paused"],
};
</script>

<style lang='less'>
.cover {
  width: 100%;
  height: 300px;
  position: fixed;
  top: 50%;
  margin-top: -300px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 15;
  // background-color: burlywood;
  .coverxx {
    width: 300px;
    height: 300px;
    overflow: hidden;
    background-image: url("https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/4602256867/5855/63fb/325b/d7e4e3a244701ee85fecb5d4f6b5bd57.png?imageView=&quality=75&thumbnail=200y200");
    background-size: contain;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 14;
    animation: palycover 12s linear infinite;
    .turn {
      width: 190px;
      height: 190px;
      background-position: center center;
      background-size: 220px;
      border-radius: 50%;
    }
    &.paused {
      animation-play-state: paused;
    }
  }
  &::after {
    content: "";
    display: block;
    width: 300px;
    height: 300px;
    background-image: url("https://p6.music.126.net/obj/wo3DlcOGw6DClTvDisK1/4204002263/4d50/4866/ad46/996fc8a2bc62e1ab3f51f135fc459577.png?imageView=&quality=75&thumbnail=200y200&tostatic=0");
    background-size: 300px;
    background-repeat: no-repeat;
    position: absolute;
    z-index: 15;
  }
}

@keyframes palycover {
  form {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
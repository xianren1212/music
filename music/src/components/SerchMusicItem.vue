<template>
    <li @click='matchingMusic(item.keyword);'>
        <i></i>
        <span>
            {{item.keyword}}
        </span>
    </li>
    <!-- 废弃的组件 -->
</template>
<script>
export default {
    props : ['item','index'],
    data() {
        return {
            matchingMusicList : [],

        }
    },
    methods: {
        matchingMusic : function(newVlue){
            this.axios
            .get("/search?keywords=" + newVlue )
            .then((response) => {
                    // this.matchingMusicList = response.data.result.songs
                    let hotlist = response.data.result.songs
                    console.log(hotlist)
                    for(var i in hotlist){
                        let HotPlaylistObj  = {}
                        HotPlaylistObj.name = hotlist[i].name;
                        HotPlaylistObj.id = hotlist[i].id;
                        HotPlaylistObj.picUrl = hotlist[i].artists[0].img1v1Url;
                        HotPlaylistObj.song = {artists : hotlist[i].artists};
                        HotPlaylistObj.al = hotlist[i].artists[0].name;
                        this.matchingMusicList.push(HotPlaylistObj)
                    }
                
            });

            this.$emit("update:matchingMusicList", this.matchingMusicList);
            
        }
    },
}
</script>
<style scoped lang="less">
    li{
        text-align: left;
        display: flex;height: 45px;
        padding-left: 10px;
        align-items: center;
        i{
            flex: 0 0 auto;
            margin-right: 7px;
            width: 15px;
            height: 15px;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMDQwMDAwIiBkPSJNMjguMTgxIDI3LjUzNWwtMS40MTQgMS40MTQtNy43NTUtNy43NTRBMTEuNDQ1IDExLjQ0NSAwIDAgMSAxMS41IDI0QzUuMTQ5IDI0IDAgMTguODUyIDAgMTIuNSAwIDYuMTQ5IDUuMTQ5IDEgMTEuNSAxIDE3Ljg1MiAxIDIzIDYuMTQ5IDIzIDEyLjVjMCAyLjc1Ni0uOTczIDUuMjg1LTIuNTg5IDcuMjY2bDcuNzcgNy43Njl6TTExLjUgM2E5LjUgOS41IDAgMSAwIDAgMTkgOS41IDkuNSAwIDAgMCAwLTE5eiIgb3BhY2l0eT0iLjMiLz48L3N2Zz4=');
            display: inline-block;
            vertical-align: middle;
            background-position: 0 0;
            background-size: contain;
            background-repeat: no-repeat;
        }
        span{
            flex: 1;
            padding-right: 10px;
            font-size: 15px;
            line-height: 45px;
            color: #333;
            border-bottom: 1px solid rgba(0,0,0,.1);

        }
    }
</style>
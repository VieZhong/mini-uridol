const {
    static_base_url
} = require('../../utils/constant.js');
Page({
    onLoad: function({name,music_name,value,fusePic, music_url}) {
        // const {name,music_name,value,fusePic} ={
        //     name:"孟美岐",
        //     music_name:"我就是这种女孩",
        //     value:"67%",
        //     fusePic:"http://activity-10053123.image.myqcloud.com/LtuRnhEvgsWI"
        // }
        this.setData({
            similarity: name,
            song: music_name,
            value: value,
            fusePic: fusePic
        });
        this.innerAudioContext = wx.createInnerAudioContext()
        this.innerAudioContext.autoplay = false;
        this.innerAudioContext.src = music_url;
        this.innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },
    onShow: function() {
         const query = wx.createSelectorQuery();
         const that = this;
         let screenWdh = 0;
         wx.getSystemInfo({
            success: ({screenWidth}) => {
                screenWdh = screenWidth;
            },
            fail:({screenWidth}) => {
                screenWdh = screenWidth;
            }
         });
         query.select('#song-text').boundingClientRect((rect) => {
            const width = rect.width*(750/screenWdh)+338;
            this.setData({
                songBarWth:  width + 'rpx'
            });
        }).exec();
    },
    data: {
        innerAudioContext: '',
        showStartMusic: true,
        music_name: '',
        music_url: '',
        similarity: '',
        fusePic: '',
        value: 0,
        songBarWth:'',
        posterPic: `${static_base_url}/app/generate-poster.png`,
        startPlaying: `${static_base_url}/app/start-Playing.png`,
        stopPlaying: `${static_base_url}/app/stop-playing.png`,
        avatar: `${static_base_url}/app/avatar.jpg`,
        poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    },
    startMusic: function() {
        this.setData({
            showStartMusic: false
        })
        this.innerAudioContext.play();
    },
    stopMusic: function() {
        this.setData({
            showStartMusic: true
        });
        this.innerAudioContext.pause();
    },
    generatePoster: function() {
        wx.navigateTo({
            url: `../production/production?photo_url=${this.data.fusePic}`,
            fail: () => {
                wx.showToast('生成海报失败');
            }
        })
    }
})
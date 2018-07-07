const {
    static_base_url
} = require('../../utils/constant.js');
Page({
    onLoad: function({
        name,
        value,
        fusePic,
        music_name,
        music_url
    }) {
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
    data: {
        innerAudioContext: '',
        showStartMusic: true,
        music_name: '',
        music_url: '',
        similarity: '',
        fusePic: '',
        value: 0,
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
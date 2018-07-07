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
    },
    onReady: function(e) {
        this.innerAudioContext = wx.createInnerAudioContext()
        this.innerAudioContext.autoplay = false;
        this.innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
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
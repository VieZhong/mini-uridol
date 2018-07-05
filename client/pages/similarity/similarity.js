Page({
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
        song: "撑腰",
        lyric: 'party girl知道,姐妹为你撑腰',
        similarity: '孟美岐',
        poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
        name: '此时此刻',
        author: '许巍',
        src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    },
    startMusic: function() {
        this.setData({
            showStartMusic: false
        })
        this.innerAudioContext.play(() => {
            console.log('开始播放')
        })
    },
    stopMusic: function() {
        this.setData({
            showStartMusic: true
        });
         this.innerAudioContext.pause(() => {
            console.log('暂停播放')；
        })
    }
})
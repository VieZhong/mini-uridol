/**
 * 人脸融合图片和人脸相似度展示页面
 */
const {
    static_base_url
} = require('../../utils/constant.js');
Page({
    /**
     * 页面加载事件获取上一个页面传过来的 query 对象
     * @param  {string} options.name       [与11位小姐姐中相似度最高的人名字]
     * @param  {string} options.music_name [音乐的歌名]
     * @param  {number} options.value      [人脸相似度百分比]
     * @param  {string} options.fusePic    [人脸融合的图片的url]
     * @param  {string} options.music_url  [云服务器上音乐的url]
     */
    onLoad: function({ name, music_name, value, fusePic, music_url }) {
        this.setData({
            similarity: name,
            song: music_name,
            value: Math.round(value),
            fusePic: fusePic
        });
        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.autoplay = true;
        this.innerAudioContext.src = music_url;
        this.innerAudioContext.onError((res) => {
            console.log(res.errMsg);
            console.log(res.errCode);
        });
    },
    /**
     * 显示页面时候 创建音乐播放器动态改变播放器栏的宽度
     */
    onShow: function() {
        const query = wx.createSelectorQuery();
        let screenWdh = 0;
        wx.getSystemInfo({
            success: ({ screenWidth }) => {
                screenWdh = screenWidth;
            },
            fail: ({ screenWidth }) => {
                screenWdh = screenWidth;
            }
        });
        query.select('#song-text').boundingClientRect((rect) => {
            const width = rect.width * (750 / screenWdh) + 338;
            this.setData({
                songBarWth: width + 'rpx'
            });
        }).exec();
    },
    data: {
        innerAudioContext: '',
        showStartMusic: false,
        music_name: '',
        music_url: '',
        similarity: '',
        fusePic: '',
        value: 0,
        songBarWth: '',
        posterPic: `${static_base_url}/app/generate-poster.png`,
        startPlaying: `${static_base_url}/app/start-Playing.png`,
        stopPlaying: `${static_base_url}/app/stop-playing.png`,
        avatar: `${static_base_url}/app/101.jpg`,
        static_base_url
    },
    /**
     * 播放音乐事件触发显示播放按钮
     */
    startMusic: function() {
        this.setData({
            showStartMusic: false
        });
        this.innerAudioContext.play();
    },
    /**
     * 暂停播放音乐事件触发显示暂停按钮
     */
    stopMusic: function() {
        this.setData({
            showStartMusic: true
        });
        this.innerAudioContext.pause();
    },
    /**
     * 生成我的海报事件 跳转到海报页面
     */
    generatePoster: function() {
        wx.navigateTo({
            url: `../production/production?photo_url=${this.data.fusePic}`,
            fail: () => {
                wx.showToast('生成海报失败');
            }
        });
    }
})
const { static_base_url } = require('../../utils/constant.js');

Page({
    data: {
        imgUrl: null,
        static_base_url
    },
    onLoad: function({url}) {
        this.setData({
            imgUrl: url
        });
    },
    playAgain: function() {
        wx.navigateTo({
            url: '../home/home'
        });
    }
});
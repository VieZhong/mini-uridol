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
        console.log(url)
        wx.cloud.callFunction({
            name: 'getwxacode',
            data: {
                modelName: 1,
                imgUrl: ''
            }
        }).then(({ errMsg, result }) => {
            if (errMsg == "cloud.callFunction:ok") {
                console.log(result);
            }
        }).catch(err => {
            console.log('错误' + err)
        })
    },
    playAgain: function() {
        wx.navigateTo({
            url: '../home/home'
        });
    },
    onShareAppMessage: function() {

        return {
            imageUrl: 'https://development-bb7096-1256746843.cos.ap-shanghai.myqcloud.com/compare/1.JPG'
        }
    }
});
const { static_base_url } = require('../../utils/constant.js');
Page({
    onLoad: function(option) {
        console.log('analysis', option.pic);
        this.setData({
            userPic: option.pic
        });
        wx.cloud.callFunction({
            name: 'faceCompare',
            data: {
                url: option.pic,
            }
        }).then(({ errMsg, result }) => {
            if (errMsg == "cloud.callFunction:ok") {
                console.log(result);
                const value = result.value;
                const name = result.name;
                this.faceFuse(name,value);
            }
        }).catch(err => {
            console.log('错误' + err)
        })
    },
    faceFuse: function(name,value) {
        console.log('fusing',this.data.userPic);
        const userPic = this.data.userPic;
        wx.cloud.callFunction({
            name: 'faceFuse',
            data: {
                imgUrl: userPic,
                modelName: name
            }
        }).then(({ errMsg, result }) => {
            if (errMsg == "cloud.callFunction:ok") {
                const fusePic = result.img_url;
                wx.navigateTo({
                    url: `../similarity/similarity?value=${value}&name=${name}&fusePic=${fusePic}`,
                    fail: () => {
                        wx.showToast('分析图片失败');
                    }
                })
            }
        }).catch(err => {
            console.log('错误' + err)
        })
    },
    data: {
        userPic: '',
        sharePic: `${static_base_url}/app/share-btn.png`,
        onceMorePic: `${static_base_url}/app/again-btn.png`,
    }
})
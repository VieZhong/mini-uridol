const {
    static_base_url
} = require('../../utils/constant.js');
Page({
    onLoad: function(option) {
        this.setData({
            userPic: option.pic
        });
        wx.cloud.callFunction({
            name: 'faceCompare',
            data: {
                url: option.pic,
            }
        }).then(({
            errMsg,
            result
        }) => {
            if (errMsg == "cloud.callFunction:ok") {
                const value = result.value;
                const name = result.name;
                this.faceFuse(name, value);
            }
        }).catch(err => {
            console.log('错误' + err)
        })
        this.textAnimation();
    },
    faceFuse: function(name, value) {
        const userPic = this.data.userPic;
        wx.cloud.callFunction({
            name: 'faceFuse',
            data: {
                imgUrl: userPic,
                modelName: name
            }
        }).then(({
            errMsg,
            result
        }) => {
            if (errMsg == "cloud.callFunction:ok") {
                const {
                    img_url,
                    song_id,
                    song_name
                } = result;
                const song_url = `${static_base_url}/music/${song_id}.mp3`;
                wx.navigateTo({
                    url: `../similarity/similarity?value=${value}&name=${name}&fusePic=${img_url}&music_name=${song_name}&music_url=${song_url}`,
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
        curentNum: 1,
        static_base_url
    },
    textAnimation: function() {
        setTimeout(() => {
            const curentNum = this.data.curentNum + 1;
            this.setData({
                curentNum
            })
            if (curentNum <= 3) {
                this.textAnimation();
            } else {
                return;
            }
        }, 2000)
    }
})
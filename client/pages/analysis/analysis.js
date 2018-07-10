/**
 * 人脸分析页面 获取人脸相似度 人脸融合图片
 */
const {
    static_base_url
} = require('../../utils/constant.js');
Page({
    /**
     * 页面加载事件触发 调用人脸分析云函数、人脸融合云函数获得人脸相似度、融合过后人脸的图片 url
     * @param  {string} pic [待分析的人脸图片 url]
     * @returns {undefined}
     */
    onLoad: function({
        pic
    }) {
        this.setData({
            userPic: pic
        });
        wx.cloud.callFunction({
            name: 'faceCompare',
            data: {
                url: pic,
            }
        }).then(({
            errMsg,
            result
        }) => {
            console.log(result)
            if (errMsg === "cloud.callFunction:ok") {
                if (!result || !result.value) {
                    wx.showToast({
                        title: '分析图片失败',
                        duration: 6000,
                        icon: "none",
                        complete: () => {
                            wx.navigateTo({
                                url: `../home/home`
                            })
                        }
                    });
                    return;
                }
                const {
                    value,
                    name
                } = result;
                this.faceFuse(name, value);
                return;
            }
        }).catch(err => {
            console.log('错误' + err)
        });
        this.textAnimation();
    },
    /**
     * 调用云函数进行人脸融合 融合成功跳转到展示相似度页面
     * @param  {string} name  [与11位小姐姐中相似度最高的人名字]
     * @param  {number} value [人脸相似度值]
     * @returns {undefined}
     */
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
            if (errMsg === "cloud.callFunction:ok") {
                const {
                    img_url,
                    song_id,
                    song_name
                } = result;

                if (!img_url) {
                    wx.showToast({
                        title: '分析图片失败,请重新上传图片',
                        duration: 2000,
                        icon: "none",
                        success: () => {
                            wx.navigateTo({
                                url: `../home/home`
                            })
                        }
                    });
                    return;
                }

                const song_url = `${static_base_url}/music/${song_id}.mp3`;
                wx.navigateTo({
                    url: `../similarity/similarity?value=${value}&name=${name}&fusePic=${img_url}&music_name=${song_name}&music_url=${song_url}`,
                    fail: () => {
                        wx.showToast({
                            title: '分析图片失败,请重新上传图片',
                            duration: 6000,
                            icon: "none"
                        });
                    }
                });
            }
        }).catch(err => {
            console.log('错误' + err);
        });
    },
    data: {
        userPic: '',
        sharePic: `${static_base_url}/app/share-btn.png`,
        onceMorePic: `${static_base_url}/app/again-btn.png`,
        curentNum: 1,
        static_base_url
    },
    /**
     * 控制分析文案加载动画的时间
     * @returns {undefined}
     */
    textAnimation: function() {
        setTimeout(() => {
            const curentNum = this.data.curentNum + 1;
            this.setData({
                curentNum
            });
            if (curentNum > 3) {
                return;
            }
            this.textAnimation();
        }, 2000);
    }
})
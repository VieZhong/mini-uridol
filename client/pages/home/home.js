/**
 * Created by zyy on 2018/6/30.
 */
const util = require('../../utils/util.js');
const STORE_KEY = 'weapp_session_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A';
const { static_base_url } = require('../../utils/constant.js');
Page({
    data: {
        tempFilePaths: '',
        firstRowList: [{
            pic: `${static_base_url}/app/meng-mei-qi.png`,
            num: 1
        }, {
            pic: `${static_base_url}/app/wu-xuan-yi.png`,
            num: 2
        }, {
            pic: `${static_base_url}/app/yang-chao-yue.png`,
            num: 3
        }, {
            pic: `${static_base_url}/app/duan-ao-juan.png`,
            num: 4
        }],
        fivePic: {
            pic: `${static_base_url}/app/yamy.png`,
            num: 12
        },
        sixPic: {
            pic: `${static_base_url}/app/lai-mei-yun.png`,
            num: 11
        },
        sevenPic: {
            pic: `${static_base_url}/app/zi-ning.png`,
            num: 5
        },
        eightPic: {
            pic: `${static_base_url}/app/sunny.png`,
            num: 6
        },
        fourRowList: [{
            pic: `${static_base_url}/app/li-zi-ting.png`,
            num: 10
        }, {
            pic: `${static_base_url}/app/fu-jin.png`,
            num: 9
        }, {
            pic: `${static_base_url}/app/xu-meng-jie.png`,
            num: 8
        }, {
            pic: `${static_base_url}/app/twelve-person.png`,
            num: 7
        }],
        centerPic: `${static_base_url}/app/101.jpg`,
        lightNum: 100,
        isClicked: false,
        lightPic: `${static_base_url}/app/florescent-light.png`,
        activeNum: 1,
        timeId:0,
        startMatchBefore:`${static_base_url}/app/start-match-before.png`,
        startMatchAfter:`${static_base_url}/app/start-match-after.png`
    },
    onReady: function() {
        console.log('111');
        this.rollAnimation();
    },
    onStartMatch: function() {
        // this.isClicked=true;
        this.modal = this.selectComponent('#modal');
        this.modal.showModal();
    },
    onMyEvent: function() {
        wx.showActionSheet({
            itemList: ['从手机相册选择', '拍照', '取消'],
            success: res => {
                console.log(res.tapIndex);
                if (res.tapIndex == 0) {
                    this.chooseWxImage('album');
                }
                if (res.tapIndex == 1) {
                    this.chooseWxImage('camera');
                }
            },
            fail: ({
                errMsg
            }) => {
                console.log(errMsg)
            }
        })
    },
    chooseWxImage: function(type) {
        wx.chooseImage({
            sourceType: [type],
            success: res => {
                this.setData({
                    tempFilePaths: res.tempFilePaths[0],
                });
                // const url = '../analysis/analysis?pic='+res.tempFilePaths[0]
                //  wx.navigateTo({
                //             url: url,
                //             fail: () => {
                //                 wx.showToast('上传图片失败');
                //             }
                //         })
                const name = `${ new Date().valueOf()}${Math.ceil(Math.random()*1000)}.png`;
                wx.cloud.uploadFile({
                    cloudPath: `user/${name}`,
                    filePath: res.tempFilePaths[0],
                    success: () => {
                        const pic = `${static_base_url}/user/${name}`;
                        wx.navigateTo({
                            url: `../analysis/analysis?pic=${pic}`,
                            fail: () => {
                                wx.showToast('上传图片失败');
                            }
                        })
                    }
                });

            },
            fail: ({
                errMsg
            }) => {
                console.log(errMsg)
            }
        });
    },
    rollAnimation: function() {
       this.data.timeId = setTimeout(() => {
            const num = this.data.activeNum + 1;
            this.setData({
                activeNum: num
            })
            if (num <= 12) {
                this.rollAnimation();
            } else {
                this.setData({
                    activeNum:1
                })
                this.rollAnimation();
            }
        }, 300)
    },
    unOnload: function(){
        clearTimeout(this.data.timeId)
    }
})
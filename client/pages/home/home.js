/**
 *首页展示11位小姐姐的图片 用户拍照上传照片匹配小姐姐
 */
const {
    static_base_url
} = require('../../utils/constant.js');
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
        centerPic: `${static_base_url}/app/center-img.png`,
        lightNum: 100,
        isClicked: false,
        lightPic: `${static_base_url}/app/light-react2.png`,
        activeNum: 1,
        timeId: 0,
        startMatchBefore: `${static_base_url}/app/start-match-before.png`,
        startMatchAfter: `${static_base_url}/app/start-match-after.png`,
        static_base_url
    },
    /**
     * 该事件触发老虎机的动画效果
     * @returns {undefined}
     */
    onReady: function() {
        this.rollAnimation();
    },
    /**
     * 开始匹配 弹出提示框
     * @returns {undefined}
     */
    onStartMatch: function() {
        this.modal = this.selectComponent('#modal');
        this.modal.showModal();
    },
    /**
     * 点击提示框以后触发选择照片的事件
     * @returns {undefined}
     */
    onMyEvent: function() {
        wx.showActionSheet({
            itemList: ['从手机相册选择', '拍照', '取消'],
            success: res => {
                if (+res.tapIndex === 0) {
                    this.chooseWxImage('album');
                }
                if (+res.tapIndex === 1) {
                    this.chooseWxImage('camera');
                }
            },
            fail: ({
                errMsg
            }) => {
                wx.showToast({
                    title: '上传图片失败',
                    icon: "none",
                    complete: () => {
                        this.modal = this.selectComponent('#modal');
                        this.modal.hideModal();
                    }
                });
                console.log(errMsg);
            }
        });
    },
    /**
     * 拍照和选择照片 将照片上传到云服务器上
     * @param  {string} type [照片的操作种类]
     * @returns {undefined}
     */
    chooseWxImage: function(type) {
        wx.chooseImage({
            sourceType: [type],
            success: res => {
                this.setData({
                    tempFilePaths: res.tempFilePaths[0],
                });
                const name = `${ new Date().valueOf()}${Math.ceil(Math.random()*1000)}.png`;
                wx.cloud.uploadFile({
                    cloudPath: `user/${name}`,
                    filePath: res.tempFilePaths[0],
                    success: () => {
                        const pic = `${static_base_url}/user/${name}`;
                        wx.navigateTo({
                            url: `../analysis/analysis?pic=${pic}`,
                            fail: () => {
                                wx.showToast({
                                    title: '上传图片失败',
                                    icon: "none"
                                });
                            }
                        });
                    },
                    fail: () => {
                        wx.showToast({
                            title: '上传图片失败',
                            icon: "none",
                            complete: () => {
                                this.modal = this.selectComponent('#modal');
                                this.modal.hideModal();
                            }
                        });
                    }
                });
            },
            fail: ({
                errMsg
            }) => {
                console.log(errMsg);
            }
        });
    },
    /**
     * 模拟老虎机顺时针的动画效果
     * @returns {undefined}
     */
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
                    activeNum: 1
                })
                this.rollAnimation();
            }
        }, 300);
    },
    /**
     * 页面卸载清除定时器
     * @returns {undefined}
     */
    unOnload: function() {
        clearTimeout(this.data.timeId);
    }
})
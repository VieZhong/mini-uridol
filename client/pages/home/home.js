/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-06-30 14:03:49 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-30 14:17:09
 */
/**
 * Created by zyy on 2018/6/30.
 */
var util = require('../../utils/util.js');
var STORE_KEY = 'weapp_session_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A'
Page({
    data: {
        tempFilePaths: ''
    },
    onStartMatch:function(){
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
            fail: ({errMsg}) => {
                console.log(errMsg)
            }
        })
    },
    chooseWxImage: function(type){
        wx.chooseImage({
            sourceType: [type],
            success: res => {
                console.log("choose success")
                this.setData({
                    tempFilePaths: res.tempFilePaths[0],
                })
            },
            fail: ({errMsg}) => {
                console.log(errMsg)
            }
        });
    }
})
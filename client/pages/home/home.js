/**
 * Created by zyy on 2018/6/30.
 */
var util = require('../../utils/util.js');
var STORE_KEY = 'weapp_session_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A'
Page({
  data: {
    tempFilePaths: '',
    firstRowList: [1,2,3,4],
    fourRowList: [8,9,10,11],
    lightNum:100,
    isClicked:false
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
        console.log("choose success")
        this.setData({
          tempFilePaths: res.tempFilePaths[0],
        })
      },
      fail: ({
        errMsg
      }) => {
        console.log(errMsg)
      }
    });
  }
})
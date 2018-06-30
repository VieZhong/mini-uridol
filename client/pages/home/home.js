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
    data:{
        userInfo:{}
    },
    onLoad:opts => {
        //需要判断用户是否登录过
      const loginStatus=wx.getStorageSync(STORE_KEY);
        if(loginStatus) {

        } else {
            wx.login({
                success:res => {
                    if(res.code){                
                        wx.cloud.callFunction({
                            name: 'loginByCode',
                            data: {
                              code: res.code,                              
                            }
                          }).then(data => {
                            this.setData({userInfo:data})
                            wx.setStorageSync(STORE_KEY, data);
                            console.log(data);
                          }).catch(err => {
                            console.log('登陆错误'+err)
                          })
                        
                    }else{
                        console.log('登陆错误'+res.errMsg);
                        util.showModel('登录错误', err.message);
                    }
                },
                fail:err => {
                    console.log(err);
                    util.showModel('登录错误', err.message);
                }
            })
        }
       
    },
    onReady:function(){

    },
    onShareAppMessage: function () {
        return {
          title: '自定义转发标题',
          path: ''
        }
      }
})
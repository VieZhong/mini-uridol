//app.js

var util = require('./utils/util.js');
var STORE_KEY = 'weapp_session_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A'
App({
    onLaunch: function() {

        wx.cloud.init({
          env: 'heyli-9b1eec',
          traceUser: true
        })

        //需要判断用户是否登录过
        const store_key = wx.getStorageSync(STORE_KEY);
        if (!store_key) {
            wx.login({
                success: res => {
                    if (res.code) {
                        wx.cloud.callFunction({
                            name: 'loginByCode',
                            data: {
                                code: res.code,
                            }
                        }).then(data => {
                            wx.setStorageSync(STORE_KEY, data);
                            console.log(data);
                        }).catch(err => {
                            console.log('登陆错误' + err)
                        })


                    } else {
                        console.log('登陆错误' + res.errMsg);
                        util.showModel('登录错误', err.message);
                    }
                },
                fail: err => {
                    console.log(err);
                    util.showModel('登录错误', err.message);
                }
            })
        }
    },
})
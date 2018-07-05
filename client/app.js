//app.js

const util = require('./utils/util.js');
const STORE_KEY = 'weapp_session_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A'
App({
    onLaunch: function() {

        wx.cloud.init({
            env: 'development-bb7096',
            traceUser: true
        })

        //需要判断用户是否登录过
        // const store_key = wx.getStorageSync(STORE_KEY);
        // if (!store_key) {
        wx.login({
            success: res => {
                if (res.code) {

                    // wx.cloud.callFunction({
                    //     name: 'faceCompare',
                    //     data: {
                    //         url: "https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=264e6f7072ec54e755e1124cd851f035/7a899e510fb30f2445d60e4dc195d143ad4b032b.jpg",
                    //     }
                    // }).then(({ errMsg, result }) => {
                    //     if (errMsg == "cloud.callFunction:ok") {

                    //         console.log(result);
                    //     }
                    // }).catch(err => {
                    //     console.log('错误' + err)
                    // })

                    // wx.chooseImage({
                    //     sizeType: 'original',
                    //     sourceType: 'camera',
                    //     success: function(filePaths) {
                    //         console.log(filePaths)
                    //     }
                    // });


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
        // }
    },
})
//app.js
const qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function() {
        // qcloud.setLoginUrl(config.service.loginUrl)
        wx.cloud.init({
            // env: 'sft-test-c5bf8f',
            traceUser: true
        })
        wx.login({
            success: res => {
                if (res.code) {
                    wx.cloud.callFunction({
                        name: 'loginByCode',
                        data: {
                            code: res.code,
                        }
                    }).then(r => {
                        console.log(r);
                    }).catch(err => {
                        console.log('登陆错误' + err)
                    })
                }
            },
            fail: err => {}
        });

    }
})
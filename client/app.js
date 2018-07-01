//app.js
// var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function() {

        wx.cloud.init({
          env: 'heyli-9b1eec',
          traceUser: true
        })
        wx.login({
            success: ({code}) => {
                if (code) {
                    wx.cloud.callFunction({
                        name: 'loginByCode',
                        data: {
                            code
                        }
                    }).then(({ result }) => {
                      console.log(result);
                    }).catch(err => {
                        console.log('登陆错误' + err)
                    })
                }
            },
            fail: err => {}
        });

    }
})
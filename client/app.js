//app.js

const util = require('./utils/util.js');
App({
    onLaunch: function() {

        wx.cloud.init({
            env: 'development-bb7096',
            traceUser: true
        })

        //需要判断用户是否登录过
        // const store_key = wx.getStorageSync(STORE_KEY);
        // if (!store_key) {
        // wx.login({
        //     success: res => {
        //         if (res.code) {

                    // wx.cloud.callFunction({
                    //     name: 'faceFuse',
                    //     data: {
                    //         imgUrl: "https://development-bb7096-1256746843.cos.ap-shanghai.myqcloud.com/compare/9.JPG",
                    //         modelName: "Yamy"
                    //     }
                    // }).then(({ errMsg, result }) => {
                    //     if (errMsg == "cloud.callFunction:ok") {

                    //         console.log(result);
                    //     }
                    // }).catch(err => {
                    //     console.log('错误' + err)
                    // });

                    // wx.chooseImage({
                    //     sizeType: 'original',
                    //     sourceType: 'camera',
                    //     success: function(filePaths) {
                    //         console.log(filePaths)
                    //     }
                    // });


            //     } else {
            //         console.log('登陆错误' + res.errMsg);
            //         util.showModel('登录错误', err.message);
            //     }
            // },
            // fail: err => {
            //     console.log(err);
            //     util.showModel('登录错误', err.message);
            // }
        // })
        // }
    },
})
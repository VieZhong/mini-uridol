//app.js

App({
    onLaunch: function() {

        wx.cloud.init({
            env: 'development-bb7096',
            traceUser: true
        })
    },
})
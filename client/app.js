//app.js

App({
	/**
     * 初始化云 wx.cloud
     * @returns {undefined}
     */
    onLaunch: function() {

        wx.cloud.init({
            env: 'development-bb7096',
            traceUser: true
        })
    },
})
Page({
	onReady:function(){
		setTimeout(() => {
			wx.redirectTo({
				url:'../home/home'
			})
		},1000)
	}
})
Component({
    data: {
        isLoading: true
    },
    /**
     * 动画加载完毕以后隐藏动画
     */
    methods: {
        loadingFinish: function() {
            setTimeout(() => {
                this.setData({
                    isLoading: false
                });
            }, 1500)
        }
    },
    /**
     * 组件加载完成以后显示动画
     * @return {[type]} [description]
     */
    ready: function() {
        this.loadingFinish();
    }
})
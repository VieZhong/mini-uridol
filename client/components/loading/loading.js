/**
 * 火箭和太空人的加载动画
 */
Component({
    data: {
        isLoading: true
    },
    /**
     * 设置加载动画的显示时间
     */
    methods: {
        loadingFinish: function() {
            setTimeout(() => {
                this.setData({
                    isLoading: false
                });
            }, 1500);
        }
    },
    /**
     * 页面加载事件触发动画显示
     */
    ready: function() {
        this.loadingFinish();
    }
})
Component({
    /**
     * 组件的初始数据
     */
    data: {
        isLoading: true
    },

    /**
     * 组件的方法列表
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
    ready: function() {
        this.loadingFinish();

    }
})
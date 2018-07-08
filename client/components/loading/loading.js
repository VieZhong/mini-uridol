/**
 * 火箭和太空人的加载动画
 */
const {
    static_base_url
} = require('../../utils/constant.js');
Component({
    data: {
        isLoading: true,
        static_base_url
    },
    methods: {
        /**
         * 设置加载动画的显示时间
         * @returns {undefined}
         */
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
     * @returns {undefined}
     */
    ready: function() {
        this.loadingFinish();
    }
})
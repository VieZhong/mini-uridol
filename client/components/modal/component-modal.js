/**
 * 带图片的模态框组件
 */
const {
    static_base_url
} = require('../../utils/constant.js');
Component({
    properties: {
        title: {
            type: String,
            value: '提示',
        },
        isShowImg: {
            type: Boolean,
            value: true,
        },
        buttonText: {
            type: String,
            value: '确定',
        },
    },
    data: {
        isShowModal: false,
        goIt: `${static_base_url}/app/go-it.png`,
        tipImg: 'https://development-bb7096-1256746843.cos.ap-shanghai.myqcloud.com/app/wang-yi-bo.png'
    },
    methods: {
        /**
         * 组价触发父组件的事件
         */
        _onTap: function() {
            this.triggerEvent('myevent', {});
        },
        /**
         * 显示模态框
         */
        showModal: function() {
            this.setData({
                isShowModal: true
            });
        },
        /**
         * 隐藏模态框
         */
        hideModal: function() {
            this.setData({
                isShowModal: false
            });
        }
    }
})
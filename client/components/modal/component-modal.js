const {
    static_base_url
} = require('../../utils/constant.js');
Component({
    /**
     * 组件的属性列表
     */
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
    /**
     * 组件的初始数据
     */
    data: {
        isShowModal: false,
        goIt: `${static_base_url}/app/go-it.png`,
        tipImg: 'https://development-bb7096-1256746843.cos.ap-shanghai.myqcloud.com/app/wang-yi-bo.png'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _onTap: function() {
            this.triggerEvent('myevent', {})
        },
        showModal: function() {
            this.setData({
                isShowModal: true
            })
        },
        hideModal: function() {
            this.setData({
                isShowModal: false
            })
        }
    }
})
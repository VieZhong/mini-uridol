const {
    static_base_url
} = require('../../utils/constant.js');

Component({
    data: {
        static_base_url
    },
    properties: {
        info: {
            type: Object,
            value: {
                size: 100,
                rotation: 0,
                location: [50, 50]
            }
        }
    },
    methods: {
        remove: function() {
            this.triggerEvent("handle", {
                type: 'REMOVE',
                item: this.properties.info
            });
        },
        move: function({
            touches
        }) {
            const {
                clientX,
                clientY
            } = touches[0];
            const {
                LT_DOT,
                T,
                W,
                H
            } = this.data;
            const size = Math.sqrt(Math.pow(clientY - LT_DOT[1], 2) / 2 + Math.pow(clientX - LT_DOT[0], 2) / 2);

            function transform(x) {
                return 40 / T * x;
            }
            this.triggerEvent("handle", {
                type: 'TRANSFORM',
                item: {
                    ...this.properties.info,
                    size: transform(size) - 20,
                    rotation: Math.atan2(clientY - LT_DOT[1], clientX - LT_DOT[0]) * 180 / Math.PI - 45,
                    location: [(LT_DOT[0] + size / 2) / W * 100, (LT_DOT[1] + size / 2) / H * 100]
                }
            });
        }
    },
    ready: function() {
        let rate = 0;
        /**
         * It returns rate + x
         * @params {int} x The rpx value
         * @returns {int} The real px value
         */
        function transform(x) {
            return rate * x;
        }
        const {
            location,
            size
        } = this.properties.info;
        wx.createSelectorQuery().select('#canvas').boundingClientRect(({
            width,
            height,
            top,
            left
        }) => {
            rate = top / 40;
            this.setData({
                T: top,
                L: left,
                W: width,
                H: height,
                LT_DOT: [width * location[0] / 100 - transform(size + 20) / 2 + left, height * location[1] / 100 - transform(size + 20) / 2 + top]
            });
        }).exec();
    }
})
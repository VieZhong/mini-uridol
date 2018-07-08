/**
 * 生成的结果展示页面
 */

const {
    static_base_url
} = require('../../utils/constant.js');

const {
    getImageInfo
} = require('../../utils/tool.js');

Page({
    data: {
        imgUrl: null,
        static_base_url,
        canvasWidth: 0,
        canvasHeight: 0,
        canvasContext: null
    },
    /**
     * 该事件触发后，获取canvas的宽高和上下文
     */
    onReady: function() {
        wx.createSelectorQuery().in(this).select('#canvas').boundingClientRect(({
            width,
            height
        }) => {
            this.setData({
                canvasWidth: width,
                canvasHeight: height,
                canvasContext: wx.createCanvasContext('canvas')
            });
        }).exec();
    },
    /**
     * 获取上一个页面传入的 url 参数
     * @param  {object} query object
     */
    onLoad: function({
        url
    }) {
        this.setData({
            imgUrl: url
        });
    },
    /**
     * 再玩一次，重新路由至主页
     */
    playAgain: function() {
        wx.navigateTo({
            url: '../home/home'
        });
    },
    /**
     * 保存图片至本地
     * 1. 获取 人物图片 和 二维码图片 的临时存放地址
     * 2. 利用canvas绘图，把 两张图片 和 文案信息 画进canvas
     * 3. canvas 生成图片
     * 4. 把图片保存至本地
     */
    saveImage: function() {
        const {
            imgUrl,
            canvasContext,
            canvasWidth,
            canvasHeight
        } = this.data;

        const rate = canvasWidth / 670;
        if (imgUrl) {

            Promise.all([getImageInfo(imgUrl), getImageInfo(`${static_base_url}/app/acode.jpg`)]).then(results => {
                const [image, code] = results;

                //清空并填白canvas
                canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
                canvasContext.setFillStyle('#FFF');
                canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);

                //人物图片
                canvasContext.drawImage(image.path, 0, 0, canvasWidth, canvasWidth * 423 / 335);

                //二维码
                canvasContext.drawImage(code.path, 6 * rate, canvasWidth * 423 / 335 + rate * 22, 100 * rate, 100 * rate);

                //文案
                canvasContext.setFontSize(18);
                canvasContext.setFillStyle('rgba(0, 0, 0, .63)');
                canvasContext.fillText('赶紧分享你的个人专属101形象', 168 * rate, canvasWidth * 423 / 335 + rate * 62);
                canvasContext.fillText('海报吧~', 168 * rate, canvasWidth * 423 / 335 + rate * 102);
                canvasContext.beginPath();
                canvasContext.setStrokeStyle('rgba(0, 0, 0, .63)');
                canvasContext.setLineWidth(1);
                canvasContext.moveTo(134 * rate, canvasWidth * 423 / 335 + 32 * rate);
                canvasContext.lineTo(134 * rate, canvasWidth * 423 / 335 + 112 * rate);
                canvasContext.stroke();

                //绘图并保存至本地
                canvasContext.draw(false, () => {
                    const name = `${new Date().valueOf()}${Math.ceil(Math.random() * 1000)}.png`;
                    wx.canvasToTempFilePath({
                        canvasId: 'canvas',
                        fileType: 'png',
                        success: ({
                            tempFilePath
                        }) => {
                            canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
                            canvasContext.draw();
                            wx.saveImageToPhotosAlbum({
                                filePath: tempFilePath,
                                success: () => {
                                    wx.showToast({
                                        title: '保存图片成功',
                                        icon: 'success',
                                        duration: 2000
                                    })
                                }
                            });
                        }
                    });
                });
            });
        }
    }
});
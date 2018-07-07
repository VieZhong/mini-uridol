const {
    static_base_url
} = require('../../utils/constant.js');

const getImageInfo = src => new Promise((resolve, reject) => {
    wx.getImageInfo({
        src,
        success: ({
            path,
            width,
            height
        }) => {
            resolve({
                path,
                width,
                height
            });
        },
        fail: e => {
            reject(e)
        }
    })
});

Page({
    data: {
        imgUrl: null,
        static_base_url,
        canvasWidth: 0,
        canvasHeight: 0,
        canvasContext: null
    },
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
    onLoad: function({
        url
    }) {
        this.setData({
            imgUrl: url
        });
    },
    playAgain: function() {
        wx.navigateTo({
            url: '../home/home'
        });
    },
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

                canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
                canvasContext.setFillStyle('#FFF');
                canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
                canvasContext.drawImage(image.path, 0, 0, canvasWidth, canvasWidth * 423 / 335);

                canvasContext.drawImage(code.path, 6 * rate, canvasWidth * 423 / 335 + rate * 22, 100 * rate, 100 * rate);

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
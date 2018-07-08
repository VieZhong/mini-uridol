/**
 * 用户制作自定义背景/挂饰图片的页面
 */

const {
    static_base_url
} = require('../../utils/constant.js');

const {
    getImageInfo
} = require('../../utils/tool.js');

Page({
    data: {
        active: "backgrounds",
        storage: {
            backgrounds: [1, 2, 3, 4, 5, 6, 7, 8],
            pendants: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        currentBackground: "",
        currentPendant: [],
        touch_start_cor: [null, null],
        canvasWidth: 0,
        canvasHeight: 0,
        canvasContext: null,
        photo: null,
        static_base_url
    },
    /**
     * 该事件触发后，获取canvas的宽高和上下文，并获取图片的临时存放位置
     * @returns {undefined}
     */
    onReady: function() {
        wx.createSelectorQuery().in(this).select('#canvas').boundingClientRect(({
            width,
            height,
            top
        }) => {
            this.setData({
                rate: top / 40,
                canvasWidth: width,
                canvasHeight: height,
                canvasContext: wx.createCanvasContext('canvas')
            });
        }).exec();
        this.getImageTmpPath();
    },
    /**
     * 获取上一个页面传来的 photo_url
     * @param  {object} query 对象
     * @returns {undefined}
     */
    onLoad: function({
        photo_url
    }) {
        if (photo_url) {
            getImageInfo(photo_url).then(result => {
                this.setData({
                    photo: result
                });
            });
        }
    },
    /**
     * 获取用到的背景和挂饰图片的临时存放路径，并于后续 canvas 绘画操作
     * 这是由于小程序 canvas 绘图，drawImage 的 API 不支持网络地址，只支持本地或临时地址
     * @returns {undefined}
     */
    getImageTmpPath() {
        const {
            backgrounds,
            pendants
        } = this.data.storage;


        Promise.all(backgrounds.map(b => getImageInfo(`${static_base_url}/material/b-${b}-max.png`))).then(results => {
            this.setData({
                storage: {
                    ...this.data.storage,
                    backgroundsUrl: results.map(({
                        path
                    }) => path)
                }
            });
        });

        Promise.all(pendants.map(g => getImageInfo(`${static_base_url}/material/g-${g}-max.png`))).then(results => {
            this.setData({
                storage: {
                    ...this.data.storage,
                    pendantsUrl: results.map(({
                        path
                    }) => path)
                }
            });
        });

    },
    /**
     * 切换 背景 或 挂饰 选项
     * @param  {obect} event 页面触发的事件
     * @returns {undefined}
     */
    switchActive: function({
        currentTarget: {
            id,
            dataset: {
                value
            }
        }
    }) {
        if (id === "tool") {
            this.setData({
                active: value
            });
        }
    },
    /**
     * 选择具体的挂饰或者背景
     * @param  {object} event 页面触发的事件
     * @returns {undefined}
     */
    chooseItem: function({
        target: {
            dataset: {
                index
            }
        }
    }) {
        const {
            active,
            currentPendant
        } = this.data;
        if (active === 'backgrounds') {
            this.setData({
                currentBackground: index
            })
        } else if (active === 'pendants') {
            this.setData({
                currentPendant: [...currentPendant, {
                    index,
                    size: 100,
                    rotation: 0,
                    location: [50, 50],
                    key: new Date().valueOf(),
                    editing: false
                }]
            })
        }
    },
    /**
     * 对 pendant 进行移动 删除 缩放 旋转 等操作
     * @param {object} detail 字段带有详细 pendant 的信息
     * @returns {undefined}
     */
    handlePendant: function({
        detail
    }) {
        const {
            type,
            item
        } = detail;
        const {
            currentPendant,
            canvasWidth,
            canvasHeight
        } = this.data;
        if (type === "REMOVE") {
            const {
                key
            } = item;
            this.setData({
                currentPendant: currentPendant.filter(p => p.key !== key)
            })
        } else if (type === "TRANSFORM") {
            this.setData({
                currentPendant: currentPendant.map(p => {
                    if (p.key === item.key) {
                        return item;
                    }
                    return p;
                })
            })
        } else if (type === "MOVE") {
            const {
                key,
                distance
            } = item;
            this.setData({
                currentPendant: currentPendant.map(p => {
                    if (p.key !== key) {
                        return p;
                    }
                    return {
                        ...p,
                        location: [p.location[0] + distance[0] * 100 / canvasWidth, p.location[1] + distance[1] * 100 / canvasHeight]
                    };
                })
            });
        }
    },
    /**
     * 用户移动 pendant 时，触发的事件
     * @param {object} event 页面事件
     * @returns {undefined}
     */
    movePendant: function({
        type,
        target,
        touches
    }) {
        if (type == "touchstart") {
            const {
                clientX,
                clientY
            } = touches[0];
            const {
                currentPendant
            } = this.data;

            this.setData({
                touch_start_cor: [clientX, clientY],
                currentPendant: currentPendant.map(p => {
                    if (p.key === target.dataset.key) {
                        return {
                            ...p,
                            editing: true
                        }
                    }
                    return {
                        ...p,
                        editing: false
                    };
                })
            });
        } else if (type == "touchmove") {
            const {
                clientX,
                clientY
            } = touches[0];
            const {
                touch_start_cor
            } = this.data;
            this.handlePendant({
                detail: {
                    type: "MOVE",
                    item: {
                        key: target.dataset.key,
                        distance: [clientX - touch_start_cor[0], clientY - touch_start_cor[1]]
                    }
                }
            });
            this.setData({
                touch_start_cor: [clientX, clientY]
            });
        } else if (type === "touchend") {
            this.setData({
                touch_start_cor: [null, null]
            });
        }
    },
    /**
     * 用户点击页面其他内容时，使挂件失焦
     * @param {object} event 页面的事件
     * @returns {undefined}
     */
    cancelSelect: function({
        target: {
            id
        }
    }) {
        if (id === "layer" || id === "background" || id === "person") {
            this.setData({
                currentPendant: this.data.currentPendant.map(p => ({
                    ...p,
                    editing: false
                }))
            })
        }
    },
    /**
     * 用户完成拼图，并调至结果页面
     * @returns {undefined}
     */
    submit: function() {
        const {
            currentBackground,
            currentPendant,
            canvasContext,
            canvasWidth,
            canvasHeight,
            rate,
            storage,
            photo
        } = this.data;

        const {
            backgroundsUrl,
            pendantsUrl
        } = storage;

        canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

        // 绘制背景
        if (currentBackground) {
            canvasContext.drawImage(backgroundsUrl[currentBackground - 1], 0, 0, canvasWidth, canvasHeight);
        }
        // 绘制人物
        if (photo) {
            const {
                path,
                width,
                height
            } = photo;
            const W_H_Rate = canvasWidth / canvasHeight;
            const w_h_rate = width / height;
            let sw = canvasWidth * 0.8,
                sh = canvasHeight * 0.8;
            if (w_h_rate > W_H_Rate) {
                sh = sw / w_h_rate;
            } else if (w_h_rate < W_H_Rate) {
                sw = sh * w_h_rate;
            }
            canvasContext.drawImage(path, (canvasWidth - sw) / 2, canvasHeight - sh, sw, sh);
        }
        canvasContext.save();

        // 绘制挂件
        currentPendant.forEach(p => {
            const {
                size,
                rotation,
                location,
                index
            } = p;
            canvasContext.save();
            canvasContext.translate(canvasWidth * location[0] / 100 - rate * size / 2, canvasHeight * location[1] / 100 - rate * size / 2);
            canvasContext.rotate(rotation * Math.PI / 180);
            canvasContext.drawImage(pendantsUrl[index - 1], 0, 0, size * rate, size * rate);
            canvasContext.restore();
        });
        canvasContext.save();

        // 绘制canvas，并生成图片
        canvasContext.draw(false, () => {
            const name = `${new Date().valueOf()}${Math.ceil(Math.random() * 1000)}.png`;
            wx.canvasToTempFilePath({
                canvasId: 'canvas',
                fileType: 'png',
                success: ({
                    tempFilePath
                }) => {
                    wx.cloud.uploadFile({
                        cloudPath: `user/${name}`,
                        filePath: tempFilePath,
                        success: () => {
                            const url = `${static_base_url}/user/${name}`;
                            wx.navigateTo({
                                url: `../result/result?url=${url}`
                            });
                        }
                    })
                }
            });
        });

    }
});
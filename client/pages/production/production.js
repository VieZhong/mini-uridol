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
    onLoad: function({
        photo_url
    }) {
        // const photo_url = "https://development-bb7096-1256746843.cos.ap-shanghai.myqcloud.com/compare/1.JPG";
        if (photo_url) {
            getImageInfo(photo_url).then(result => {
                this.setData({
                    photo: result
                });
            });
        }
    },
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
    switchActive: function({
        currentTarget: {
            id,
            dataset: {
                value
            }
        }
    }) {
        if (id == "tool") {
            this.setData({
                active: value
            });
        }
    },
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
        if (active == 'backgrounds') {
            this.setData({
                currentBackground: index
            })
        } else if (active == 'pendants') {
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
        if (type == "REMOVE") {
            const {
                key
            } = item;
            this.setData({
                currentPendant: currentPendant.filter(p => p.key != key)
            })
        } else if (type == "TRANSFORM") {
            this.setData({
                currentPendant: currentPendant.map(p => {
                    if (p.key == item.key) {
                        return item;
                    }
                    return p;
                })
            })
        } else if (type == "MOVE") {
            const {
                key,
                distance
            } = item;
            this.setData({
                currentPendant: currentPendant.map(p => {
                    if (p.key != key) {
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
                    if (p.key == target.dataset.key) {
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
        } else if (type == "touchend") {
            this.setData({
                touch_start_cor: [null, null]
            });
        }
    },
    cancelSelect: function({
        target: {
            id
        }
    }) {
        if (id == "layer" || id == "background" || id == "person") {
            this.setData({
                currentPendant: this.data.currentPendant.map(p => ({
                    ...p,
                    editing: false
                }))
            })
        }
    },
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
        if (currentBackground) {
            canvasContext.drawImage(backgroundsUrl[currentBackground - 1], 0, 0, canvasWidth, canvasHeight);
        }
        if (photo) {
            const {
                path,
                width,
                height
            } = photo;
            console.log(width, height)
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
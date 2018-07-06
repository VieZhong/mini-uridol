const { static_base_url } = require('../../utils/constant.js');

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
    handlePendant: function({detail}) {
        const { type, item } = detail;
        const { currentPendant, canvasWidth, canvasHeight } = this.data;
        if(type == "REMOVE") {
            const { key } = item;
            this.setData({
                currentPendant: currentPendant.filter(p => p.key != key)
            })
        } else if(type == "TRANSFORM") {
            this.setData({
                currentPendant: currentPendant.map(p => {
                    if(p.key == item.key) {
                        return item;
                    }
                    return p;
                })
            })
        } else if(type == "MOVE") {
            const { key, distance } = item;
            this.setData({
                currentPendant: currentPendant.map(p => {
                    if(p.key != key) {
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
    movePendant: function({type, target, touches}) {
        if(type == "touchstart") {
            const { clientX, clientY } = touches[0];
            const { currentPendant } = this.data;

            this.setData({
                touch_start_cor: [clientX, clientY],
                currentPendant: currentPendant.map(p => {
                    if(p.key == target.dataset.key) {
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
        } else if(type == "touchmove") {
            const { clientX, clientY } = touches[0];
            const { touch_start_cor } = this.data;
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
        } else if(type == "touchend") {
            this.setData({
                touch_start_cor: [null, null]
            });
        }
    },
    cancelSelect: function({target:{id}}) {
        if(id == "layer" || id == "background") {
            this.setData({
                currentPendant: this.data.currentPendant.map(p => ({
                    ...p,
                    editing: false
                }))
            })
        }
    },
    submit: function() {
        const { currentBackground, currentPendant, canvasContext, canvasWidth, canvasHeight, rate } = this.data;

        canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        canvasContext.drawImage(`${static_base_url}/material/b-${currentBackground}-max.png`, 0, 0, canvasWidth, canvasHeight);
        canvasContext.save();
        
        currentPendant.forEach(p => {
            const { size, rotation, location, index } = p;
            canvasContext.save();
            canvasContext.translate(canvasWidth * location[0] /100 - rate * size / 2, canvasHeight * location[1] /100 - rate * size / 2);
            canvasContext.rotate(rotation * Math.PI / 180);
            canvasContext.drawImage(`${static_base_url}/material/g-${index}-max.png`, 0, 0, size * rate, size * rate);
            canvasContext.restore();
        });

        canvasContext.save();
        canvasContext.draw(false, () => {
            const name = `${new Date().valueOf()}${Math.ceil(Math.random() * 1000)}.png`;
            wx.canvasToTempFilePath({
                canvasId: 'canvas',
                fileType: 'png',
                success: ({tempFilePath}) => {
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
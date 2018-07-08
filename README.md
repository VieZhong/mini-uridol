
# viezhong

## 贡献
1. 完成所有云函数的编写和调试（主要包括人脸融合/人脸相似对比等函数）。
2. 完成人物/背景/挂饰融合效果，并实现挂饰拖动/缩放/旋转等效果。
3. 完成项目目录架构的制定和开发进度的把控。

## 收获
1. 了解到全新的开发模式。
2. 了解并实践“产品-视觉-交互-开发-测试-发布”的规范的开发流程，感受到了不同岗位在开发中的作用，大家都是重要且不可替代的，特别是产品，设计。产品不仅决定了产品的方向内容，实际上也掌控着整个项目的开发进度。今后会从更广的角度来看待项目。
3. 感受到了团队的力量，把起初构思的产品在不到两周的时间内完成上线。

## well done
1. 无论是遇到技术上的问题，还是进度上的问题，都能够做到及时沟通调整，能够快速地去解决。
2. 能够在实际开发中，能够承担关键的开发任务，并给出合作小伙伴有力的帮助和支持。

## less well
1. 作为小组的一员，我还可以更多地给我们做的产品方向和内容提供一些建议和参考。
2. 由于时间的紧迫，我们并没有对一些交互/设计/API做出文档，虽然我们都尽量按照统一的格式去设计和编码，但是对于产品后期的维护还是会可能造成一定的麻烦。

## 遇到的坑
1. 小程序自带的 canvas 组件，不是完全遵从 w3c 标准的。设置 visibility-hidden 和 z-index 都无法把 canvas 隐藏或移动到底层。解决办法：通过 position 移动到可视区域以外，才能够解决 canvas 的隐藏问题。
2. 小程序自带的 canvas 组件，drawImage API 只支持本地路径或临时路径，不支持网络路径。因此，需要调用其他 API 的接口，去获取图片的临时路径方可。 
3. 小程序云函数的调试，每次都要打包上传才能测试是否是好的，很麻烦。
4. 小程序请求白名单配置，而且每月只能改 5 次。没有配置白名单，只能够在开发模式或调试模式中正常请求。且只支持 https 的请求。
5. 人脸融合，如果图片模板的背景本来是透明的，但是只要有部分地方没抠干净，最后融合出来的图片背景会被转化成白色。
6. 小程序不支持直接分享朋友圈，只能够保存图片至本地。
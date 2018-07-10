/**
 * 人脸相似性分析
 */


const app = require('tcb-admin-node');

const url_prefix = "https://development-bb7096-1256746843.cos.ap-shanghai.myqcloud.com/compare/";

const girls = ["孟美岐", "吴宣仪", "杨超越", "段奥娟", "Yamy", "赖美云", "张紫宁", "杨芸晴", "李紫婷", "傅菁", "徐梦洁"];

/**
 * 调用腾讯云的 SKD 获取相似性对比数据 
 * @param  {string} urlA 图片一的网络地址
 * @param  {string} urlB 图片二的网络地址
 * @param  {name} name 对比本人的名字
 * @return {object} Promise 对象，对比结果
 */
function getSimilarity(urlA, urlB, name) {
    return new Promise(async (resovle, reject) => {
        try {
            const {
                result
            } = await app.callAI({
                param: {
                    type: "face-compare",
                    urlA,
                    urlB
                }
            });
            const value = +JSON.parse(result).data.similarity;
            resovle({
                value: (100 - value) / 4 * 3 + value,
                name
            });
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * 初始化 sdk 实例配置
 */
app.init({
    secretId: 'AKIDujOtDOWGyVuBIFepMiw0vhIiz62ntm08',
    secretKey: '792kGblrnZqyviKwSozyrcDdsw78ye8R',
    envName: 'development-bb7096',
    mpAppId: 'wx54a85d47e13e8c5c',
});

/**
 * 入口函数
 * @param  {object} event 传入对象事件参数
 * @param  {object} context
 * @param  {callback} callback 回调
 * @return {object} obj 包含两个字段：{ value, name }
 */
exports.main_handler = async function(event, context, callback) {

    const {
        url
    } = event;

    if(Math.random() * 10 > 1) {
        
        const result = (await Promise.all(girls.map((name, i) => getSimilarity(url, `${url_prefix}${i + 1}.JPG`, name)))).sort((x, y) => y.value - x.value);

        return result[0];
    }

    return {
        value: 100,
        name: "黄子韬"
    };

}
/**
 * 人脸融合
 */


const {
    ImageClient
} = require('image-node-sdk');

const https = require('https');

const AppId = '1253745510'; // 腾讯云 AppId
const SecretId = 'AKIDujOtDOWGyVuBIFepMiw0vhIiz62ntm08'; // 腾讯云 SecretId
const SecretKey = '792kGblrnZqyviKwSozyrcDdsw78ye8R'; // 腾讯云 SecretKey
const UIN = '3420533565';

/**
 * 存图片id和人物名字的对应关系
 * @type {Array}
 */
const modelIds = [{
    name: '黄子韬',
    ids: ['qc_100320_121258_31']
}, {
    name: '孟美岐',
    ids: ['qc_100320_121014_22', 'qc_100320_120938_20', 'qc_100320_120942_21']
}, {

    name: '吴宣仪',
    ids: ['qc_100320_121019_23', 'qc_100320_121022_24']
}, {
    name: '徐梦洁',
    ids: ['qc_100320_121028_25', 'qc_100320_121031_26']
}, {
    name: '杨超越',
    ids: ['qc_100320_121035_27', 'qc_100320_121037_28', 'qc_100320_121040_29']
}, {
    name: '张紫宁',
    ids: ['qc_100320_121047_30']
}, {
    name: '段奥娟',
    // ids: ['qc_100320_120815_11', 'qc_100320_120817_12']
    ids: ['qc_100320_120815_11']
}, {
    name: '傅菁',
    ids: ['qc_100320_120845_13']
}, {
    name: '赖美云',
    ids: ['qc_100320_120851_14', 'qc_100320_120854_15']
    // ids: ['qc_100320_120851_14', 'qc_100320_120854_15', 'qc_100320_120857_16']
}, {
    name: '李紫婷',
    ids: ['qc_100320_120903_17', 'qc_100320_120931_18', 'qc_100320_120934_19']
}, {
    name: '杨芸晴',
    ids: ['qc_100320_120659_8']
}, {
    name: 'Yamy',
    ids: ['qc_100320_120703_9', 'qc_100320_120706_10']
}];


/**
 * 存 modelId 和 对应曲目 的关系
 * @type {Object}
 */
const songs = {
    'qc_100320_121258_31': 'Underground King',
    'qc_100320_121014_22': '我就是这种女孩',
    'qc_100320_121019_23': '我又初恋了',
    'qc_100320_121022_24': 'promise',
    'qc_100320_121028_25': 'sugar',
    'qc_100320_121031_26': '我就是这种女孩',
    'qc_100320_121035_27': '麻烦少女',
    'qc_100320_121037_28': '不负青春',
    'qc_100320_121040_29': '全部都是你',
    'qc_100320_121047_30': '独家记忆',
    'qc_100320_120815_11': '逆光',
    'qc_100320_120817_12': '了不起',
    'qc_100320_120845_13': '逆风',
    'qc_100320_120851_14': 'Let Me Love You',
    'qc_100320_120854_15': '爱你',
    'qc_100320_120857_16': '了不起',
    'qc_100320_120903_17': '红色高跟鞋',
    'qc_100320_120931_18': '逆光',
    'qc_100320_120934_19': '我就是这种女孩',
    'qc_100320_120938_20': '撑腰',
    'qc_100320_120942_21': '忐忑',
    'qc_100320_120659_8': '逆风',
    'qc_100320_120703_9': '别人家的小孩',
    'qc_100320_120706_10': '中国话'
}

/**
 * 根据人名获取对应 model 的 id
 * @param  {string} name 对应人名
 * @return {string} model id
 */
const getModelId = name => {
    const {
        ids
    } = modelIds.find(m => m.name == name);
    return ids[Math.floor(Math.random() * ids.length)];
}

/**
 * 根据图片的地址，获取base64格式数据
 * @param  {string} url 网络地址
 * @return {object} promise 对象，resolve base64的数据
 */
const request = url => new Promise((resolve, reject) => {
    https.get(url, res => {
        const chunks = []; //用于保存网络请求不断加载传输的缓冲数据
        let size = 0;　　 //保存缓冲数据的总长度

        res.on('data', function(chunk) {　　　　
            chunks.push(chunk);　
            size += chunk.length;　　 //累加缓冲数据的长度
            　　
        });
        res.on('end', function(err) {
            if (err) {
                return reject(err);
            }
            const data = Buffer.concat(chunks, size);　　 //Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data
            const base64Img = data.toString('base64');　　 //将Buffer对象转换为字符串并以base64编码格式显示
            resolve(base64Img);　　　　
        });
    });
});

/**
 * 入口函数
 * @param  {object} event 传入对象事件参数
 * @param  {object} context
 * @param  {callback} callback 回调
 * @return {object} 包含三个 string 字段：{ img_url, song_id, song_name }
 */
exports.main = async function(event, context, callback) {

    const imgClient = new ImageClient({
        AppId,
        SecretId,
        SecretKey
    });

    const {
        imgUrl,
        modelName
    } = event;

    const model_id = getModelId(modelName);

    const {
        body
    } = await imgClient.faceFuse({
        data: {
            uin: UIN,
            project_id: '100320',
            model_id,
            img_data: await request(imgUrl),
            rsp_img_type: 'url'
        }
    });

    const {
        img_url
    } = JSON.parse(body);

    return {
        img_url: img_url && img_url.replace("http", "https"),
        song_id: model_id,
        song_name: songs[model_id]
    };
}
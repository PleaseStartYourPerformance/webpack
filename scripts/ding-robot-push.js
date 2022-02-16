const request = require('request');
const ver = process.argv[2].replace(/^v/, '');
const isRelease = process.argv[3] && process.argv[3] === 'release';
let refName = process.env['CI_COMMIT_REF_NAME'];
const projectUrl = process.env['CI_PROJECT_URL'];
const jobUrl = process.env['CI_JOB_URL'];
const userName = process.env['GITLAB_USER_NAME'];
const commitMessage = process.env['CI_COMMIT_MESSAGE'];

if (isRelease) {
    refName = 'master';
}

let url = 'https://oapi.dingtalk.com/robot/send?access_token=60799f42e2e9f670179dcae25f4277ade12883eb913d719146f3f13809b5885b';

const data = {
    'msgtype': 'markdown',
    'markdown': {
        'title': `组件库打包完成`,
        'text': `#### 组件库打包完成 ${isRelease ? '' : '[开发包]'} \n> 版本号: [${ver}](http://123.56.176.167/-/web/detail/@xin/xin-ui/v/${ver})\n\n` +
            `> 分支: [${refName}](${projectUrl}/tree/${refName})\n\n` +
            `> 构建者: ${userName}\n\n` +
            `> 提交消息: ${commitMessage}\n\n` +
            `###### [构建详情](${jobUrl})`
    },
    'at': {
        'isAtAll': true
    }
};

request.post({
    url: url,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
}, function (error, response, body) {
    console.log('钉钉消息发送成功');
});

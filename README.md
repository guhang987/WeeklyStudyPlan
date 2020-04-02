#周计划表
## 版本
1.0
## Usage
环境：node、mongodb
1. 修改config.js中的`serverUrl`为你的服务器地址
2. `npm run build`
3. `npm i -g serve`
4. `serve -s build`
## 实现功能
1. 用户身份认证
2. 制定周计划后，从周计划表中拖拽任务到日计划表，完成后打勾
3. 评论功能
## 技术栈
Antd3+react+redux+express+mongoDB
## 总结
去年开始就在做计划表，用的技术是bootstrap+jQuery，art-template后端渲染页面，结果各种操作dom的代码天花乱坠，复用性低。今年学了react，有了点面向对象的思想，开发过程感觉很爽，除了redux状态管理有点麻烦。react生态很好，UI可以用antd，逻辑可以用npm上现成的轮子，教程也很多。react最棒的地方是数据驱动，state更新后重新渲染组件，把开发的难度降低为开发一个个小组件的难度，而且组件复用性好，别人写好的组件copy就能用。而且每个组件有自己的props和state，互不干扰，用指定的方法通信
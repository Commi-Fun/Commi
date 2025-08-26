# 环境概述

我们的部署流程与 Vercel 的环境模型紧密对应，主要分为三类：

1. 生产环境 (Production)
   触发方式: 当代码被合并到 main 分支时自动触发。

对应分支: main

访问地址: https://commi.fun

用途: 面向最终用户的线上正式环境。只有经过充分测试、稳定可靠的代码才能进入此环境。

2. QA 环境 (QA / Pre-Production)
   触发方式: 当代码被合并到 qa 分支时自动触发。

对应分支: qa

访问地址: https://qa.commi.fun

用途: 这是正式发布前的最后一个测试环境。QA 团队在此环境中对集成了所有新功能的版本进行全面的回归测试和验收测试。

3. 开发环境 (Dev)
   触发方式: 当代码被推送到任何一个非 main 和 develop 的分支时自动触发（主要是 feature/\* 分支）。

对应分支: dev

访问地址: https://dev.commi.fun

用途:

开发者自测: 这个分支的内容可以随意更改。push -f。使用时在 dev channel 里通知

4. 本地开发

   本地绕过授权登录需要复制线上环境的 token

- 本地的 packages/web/.env.local 中添加环境变量

  NEXTAUTH_SECRET=

  NEXTAUTH_URL="http://localhost:3000"

  DATABASE_URL=

- 登录 https://dev.commi.fun. 打开控制台复制 token
  ![alt text](image.png)
- 本地 pnpm web:dev 启动后。在控制台执行

```
const token = "<your_token>";

document.cookie = `next-auth.session-token=${token}; path=/; max-age=2592000; samesite=lax`;
location.reload();
```

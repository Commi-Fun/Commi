代码贡献指南 (CONTRIBUTING.md)
欢迎为本项目贡献代码！为了维护代码质量和协作效率，请所有贡献者遵循以下开发流程。

核心分支策略
本项目采用基于 Git Flow 的简化模型，并与 Vercel 的部署环境深度集成。核心分支包括：

main: 生产分支。此分支的代码永远是稳定、可发布的，直接对应线上生产环境。严禁直接向 main 分支推送代码。

qa: QA(Quality Assurance) 分支。这是所有功能开发的集散地，代表了“下一个版本”的最新状态。此分支对应我们的 QA 测试环境。**请确保你的改动在不久后就可以测试并发布到生产再合并，否则不要合到qa分支**

feature/\*: 功能分支。例如 feature/user-login。每个新功能或修复都必须从 qa 分支创建。

开发流程

# 1. 开始新功能开发

所有新工作都必须从最新的 qa 分支开始。
git checkout qa

# 2. 拉取最新代码，确保你的 qa 分支是同步的

git pull origin qa

# 3. 创建一个新的功能分支，命名要清晰地描述功能

git checkout -b feature/your-feature-name

# 4. 创建 PR，目标分支是 qa

填写有意义的title和description。如果有冲突，请现在本地解决冲突。解决冲突推荐rebase qa分支

# 5. 合并代码

在确保你的功能自测没问题，并且可以上生产后再合并。 如果对生产环境其他功能有影响，但是你的功能又不需要立马上线时，请不要合并。
填写有意义的title和description。
merge时选择 Squash and Merge
![alt text](image.png)

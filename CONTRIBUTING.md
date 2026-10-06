# Contributing to Kinetic Atlas

感谢你帮助改进 Kinetic Atlas。提交代码前，请先搜索现有 Issue，避免重复工作。

## 开发流程

1. Fork 仓库并从 `main` 创建主题分支。
2. 安装依赖：`npm install`。
3. 如需完整界面，运行本地媒体安装脚本；不要提交 `public/media/` 中的第三方文件。
4. 保持改动聚焦，并为数据或行为变化补充验证方式。
5. 提交前运行：

```powershell
npm run lint
npm run anatomy:audit
npm run build
```

6. 创建 Pull Request，说明问题、解决方式、验证结果和界面变化截图。

## 数据贡献

- 动作肌群映射必须保留来源字段，并能通过 `npm run anatomy:audit`。
- 不要把教学权重描述为 EMG 实测值。
- 体态和疼痛相关文字应使用观察性语言，不提供诊断或治疗结论。
- 不要提交来源和许可不明确的 GIF、模型或其他媒体。

## 代码风格

- 使用 TypeScript；避免无类型数据穿过组件边界。
- 优先复用现有数据结构和 UI 样式。
- 保持本地优先，不引入不必要的运行时外部请求。
- 提交信息使用简洁的祈使句，例如 `Fix anatomy mesh matching`。

所有参与者都必须遵守 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。

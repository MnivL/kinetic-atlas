# Kinetic Atlas

一个本地优先的训练动作与 3D 解剖学习工具。选择动作后可查看主动肌、辅助肌、稳定肌、动作阶段、常见代偿与引导式自查。

## 本地运行

```powershell
npm install
npm run dev
```

## 模型和媒体

- 默认使用轻量级程序化人体模型，确保离线可用。
- 精细 FBX、动作索引和 GIF 安装在 `public/media/` 后，浏览器从本机读取，不依赖运行时外网。
- 精细模型加载后可切换筋膜视图，单独观察模型中 fascia、aponeurosis、retinaculum 命名结构。
- 动作 GIF 通过浏览器本地文件选择器导入，不会上传或写入仓库。
- 可按需载入 ExerciseGymGifsDB v1.1.0 的 1323 条动作元数据，并粗粒度映射到 3D 肌群；界面最多同时渲染 120 条结果。
- 第三方 GIF 只在用户点击后按需从本机文件加载；媒体目录被 Git 忽略，来源仓库不授予 GIF 再分发权。
- 许可边界见 `ANATOMY_ATTRIBUTION.md` 与 `MEDIA_NOTICE.md`。

### 安装本地媒体

首次安装可运行 `powershell -ExecutionPolicy Bypass -File scripts/download-local-media.ps1`。它会下载约 0.40 GiB 的两个 FBX、动作索引和 1323 个 GIF 到 `public/media/`；该目录不会提交到 Git。中断后重复运行即可只补齐缺失文件。

## 内容边界

肌肉参与比例是用于教学和界面表达的相对权重，不是 EMG 测量值。体态页面展示可能因素和检查思路，不提供医学诊断。

## 许可

应用代码按 AGPL-3.0-or-later 开源。第三方解剖模型和用户自行导入的动作媒体不属于应用代码许可范围，分别遵循 `ANATOMY_ATTRIBUTION.md` 与 `MEDIA_NOTICE.md`。

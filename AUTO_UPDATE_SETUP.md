# 自动更新说明

自动更新已配置完成，无需任何 API key。

## 数据来源

网站从 **wheniskickoff.com** 的免费公开 API 获取世界杯实时数据：
- 完全免费，无需注册，无需 API key
- 每 30 分钟由 GitHub Actions 自动抓取
- 自动更新比赛比分和状态
- 自动对比你的预测与实际赛果，计算命中率

## 开启 GitHub Actions

代码已全部就绪。上传到 GitHub 后：

1. 进入 GitHub 仓库，点顶部 `Actions`。
2. 如果页面提示启用 workflows，就点启用。
3. 打开 `Update World Cup Data`。
4. 点 `Run workflow`，手动跑一次。

如果运行失败并提示没有权限提交：

1. 点仓库顶部 `Settings`。
2. 点左侧 `Actions` -> `General`。
3. 找到 `Workflow permissions`。
4. 选择 `Read and write permissions`。
5. 保存后回到 `Actions` 再运行一次。

## 添加你的预测

编辑 `automation/prediction-overrides.json`，按以下格式添加：

```json
"2026-06-15|德国|库拉索": {
  "pick": "德国胜",
  "score": "2-0",
  "confidence": "高",
  "reason": "你的理由"
}
```

键的格式为 `{日期}|{主队中文名}|{客队中文名}`。日期使用北京时间（Asia/Shanghai）。

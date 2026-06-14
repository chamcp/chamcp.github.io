# 自动更新说明

当前自动化分两层：

1. `automation/matches.json` 是比赛、比分和预测输入。
2. `scripts/update-data.mjs` 会读取这个文件并生成网页使用的 `data.js`。

如果接入外部赛程接口，预测可以单独放在 `automation/prediction-overrides.json`。脚本会按“日期|主队|客队”自动匹配预测，避免外部接口刷新后把你的预测覆盖掉。

本地更新：

```bash
node scripts/update-data.mjs
```

如果想固定测试某一天：

```bash
node scripts/update-data.mjs --date=2026-06-14
```

只检查数据源有没有缺字段或格式错误：

```bash
node scripts/update-data.mjs --validate-only
```

检查生成后的 `data.js` 能不能被网页读取：

```bash
node scripts/smoke-test-data.mjs
```

上线后，`.github/workflows/update-data.yml` 会每 30 分钟尝试更新一次；只有赛程、比分、预测或复盘内容真的变化时才会提交 `data.js`。如果以后找到稳定的外部赛程/赛果接口，可以在 GitHub 仓库里设置 `MATCHES_SOURCE_URL`，脚本会优先读取那个地址。

## 接入真实赛程/比分

现在已经预留了 football-data.org 导入器：

```bash
node scripts/import-football-data.mjs
```

它需要在环境变量里设置 `FOOTBALL_DATA_TOKEN`。上传到 GitHub 后，可以在仓库的 Secrets 里添加这个密钥；有密钥时，GitHub Actions 会先抓真实赛程/比分，再生成 `data.js`。没有密钥时，会继续使用 `automation/matches.json`，网站不会坏。

不用密钥的离线转换测试：

```bash
node scripts/import-football-data.mjs --fixture=automation/football-data.sample.json --output=automation/matches.imported.json
```

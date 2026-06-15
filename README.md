# 世界杯预测追踪

这是一个可以部署到 GitHub Pages 的静态网页。

自动更新开通步骤见 `AUTO_UPDATE_SETUP.md`。

## 文件说明

- `index.html`: 页面和交互。
- `data.js`: 赛程、每日预测、复盘数据。这个文件现在可以由脚本自动生成。
- `automation/matches.json`: 自动更新的数据源，放比赛、比分和预测覆盖。
- `automation/prediction-overrides.json`: 接入外部接口时保留自己的预测。
- `automation/team-names.zh.json`: 外部接口球队英文名到中文名的映射。
- `scripts/update-data.mjs`: 根据数据源生成 `data.js`。
- `scripts/import-football-data.mjs`: 可选的 football-data.org 赛程/比分导入器。
- `scripts/smoke-test-data.mjs`: 检查生成后的 `data.js` 是否能被网页读取。
- `.github/workflows/update-data.yml`: GitHub 自动更新配置。
- `.gitignore`: 避免把临时生成文件上传。
- `CNAME`: 自定义域名，当前设置为 `chamcp.com`。

## 自动更新

本地生成最新数据：

```text
node scripts/update-data.mjs
```

固定按某一天生成，方便检查昨天/今天/明天：

```text
node scripts/update-data.mjs --date=2026-06-14
```

只检查数据源格式：

```text
node scripts/update-data.mjs --validate-only
```

上传到 GitHub 后，Actions 会每 30 分钟自动尝试更新一次。如果数据内容没有变化，就不会提交新版本。如果以后接入外部赛程/赛果接口，可以在 GitHub 里配置 `MATCHES_SOURCE_URL`，脚本会优先读取那个地址。

如果使用 football-data.org，在 GitHub 仓库的 Secrets 里添加 `FOOTBALL_DATA_TOKEN`。有这个密钥时，Actions 会自动抓赛程/比分；没有密钥时，仍然使用本地数据源。

页面顶部的“数据源”会显示当前使用的是 `本地数据`、`真实接口` 或其他远程数据，方便确认自动化是否真正接上外部来源。

## GitHub Pages 建议

用 GitHub 用户名 `chamcp` 创建仓库：

```text
chamcp.github.io
```

把本目录里的 `index.html`、`data.js`、`CNAME` 上传到仓库根目录。开启 GitHub Pages 后，先访问：

```text
https://chamcp.github.io
```

域名解析完成后，再访问：

```text
https://chamcp.com
```

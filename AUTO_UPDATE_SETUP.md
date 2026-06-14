# 自动更新开通步骤

现在项目已经支持两种自动更新方式：

1. 没有接口密钥：每 30 分钟检查一次本地数据源，内容没变就不提交。
2. 有 football-data.org 密钥：每 30 分钟抓一次真实赛程/比分，有变化才生成并提交 `data.js`。

## 先上传这些文件

把下面这些新增或修改的文件上传到 GitHub 仓库：

- `data.js`
- `index.html`
- `README.md`
- `.gitignore`
- `automation/matches.json`
- `automation/prediction-overrides.json`
- `automation/team-names.zh.json`
- `automation/football-data.sample.json`
- `automation/README.md`
- `scripts/update-data.mjs`
- `scripts/import-football-data.mjs`
- `scripts/smoke-test-data.mjs`
- `.github/workflows/update-data.yml`

## 开启 GitHub Actions

上传后进入 GitHub 仓库：

1. 点顶部 `Actions`。
2. 如果页面提示启用 workflows，就点启用。
3. 打开 `Update World Cup Data`。
4. 点 `Run workflow`，手动跑一次。

跑成功后，GitHub 会自动提交更新后的 `data.js`。网站会继续通过 GitHub Pages 显示。

如果运行失败并提示没有权限提交：

1. 点仓库顶部 `Settings`。
2. 点左侧 `Actions` -> `General`。
3. 找到 `Workflow permissions`。
4. 选择 `Read and write permissions`。
5. 保存后回到 `Actions` 再运行一次。

## 接入真实赛程/比分

如果要用 football-data.org：

1. 注册 football-data.org 并拿到 API token。
2. 回到 GitHub 仓库，点 `Settings`。
3. 找到 `Secrets and variables` -> `Actions`。
4. 新建一个 Repository secret：
   - Name: `FOOTBALL_DATA_TOKEN`
   - Secret: 粘贴你的 token
5. 再到 `Actions` 里手动运行一次 `Update World Cup Data`。

没有这个 token 时，网站不会坏，只是继续使用本地数据源。

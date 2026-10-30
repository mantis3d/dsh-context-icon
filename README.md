# dsh-context-icon

> 在会话标题旁和侧栏会话行上显示**上下文窗口用量** · Context-window usage beside DeepSeek Harness session titles and on sidebar session rows.

DSH 默认只在输入框附近显示上下文占用——切到别的会话就看不到了。这个插件把同一份数据（官方 `contextPressure` 投影）搬到标题旁和侧栏行首：小圆环 + 百分比，悬浮显示 `≈68k / 128k` 以及系统提示词 / 工具定义 / 对话消息的构成，并按用量分档变色。

## 功能

- **标题徽标**：会话标题左侧显示圆环 + `NN%`，鼠标悬浮显示 token 明细与构成
- **侧栏标记**：每个会话行行首的小圆环（`sidebar.session.row.leading`），悬浮卡里显示百分比与明细
- **四档配色**：< 50% 绿、50–79% 蓝、80–94% 橙、≥ 95% 红（可切换两档 / 中性）
- **设置界面**：设置 → 上下文用量，从 7 组选项里自由组合，即时预览
- **零配置**：装上就有默认外观；偏好只存在本机

## 截图

> 待补：把实际效果截图保存为 `docs/screenshot.png`，然后取消下一行注释。

<!-- ![Screenshot](docs/screenshot.png) -->

## 安装

需要 DSH Desktop `0.2.1-rc.2` 或更新版本。

**方式一：应用内市场**（收录后可用）
设置 → 插件 → 市场 → 搜索 `上下文用量` 安装，然后完全退出并重开 DSH。

**方式二：直接从 GitHub 源安装**
对该 DSH 会话说「安装 `github:mantis3d/dsh-context-icon` 这个插件」，或让 Agent 调用 `plugin_manager` 的 `install_bundle`，安装目标填：

```
github:mantis3d/dsh-context-icon
```

安装完成后完全退出并重新启动 DSH。

**方式三：本地开发**
克隆仓库到本地，用 `plugin_manager` 把本地目录作为 `install_bundle` 的目标即可（profile 里会生成一个 `link:` 依赖）。

## 设置项

设置 → 上下文用量，共 7 组：

| 组 | 选项 |
| --- | --- |
| 标题形态 | 圆环 + 百分比 / 仅百分比 / 仅圆环 / `68k / 128k` / `42% · 68k/128k` / 进度条 + 百分比 |
| 位置 | 标题前（actions 席位）/ 右上工具区（utilities 席位） |
| 侧栏行首 | 圆环 / 竖条 / 圆点 / 不显示 |
| 悬浮卡 | 明细三行 / 只显示一行摘要 |
| 显示规则 | 始终显示 / ≥ 50% / ≥ 80% / 低于 20% 时变淡 |
| 配色 | 四档 / 两档 / 中性 |
| 精度 | 整数百分比 / 一位小数 |

偏好保存在浏览器 `localStorage` 的 `dsh-context-icon:config` 键下。

## 已知限制

- 侧栏行首的标记只在**空闲且未归档**的会话行渲染。这是侧栏席位（`sidebar.session.row.leading`）本身的挂载条件；运行中的会话请看标题徽标或悬浮卡。
- 标题徽标出现在标题**左侧**：`conversation.session.header.actions` 是标题前的席位；如果想让它在右边，可在设置里切到 `utilities`（右上工具区）。
- 不做 `corner` / `lineage` 席位：那两个是单例替换席位（`shadows-shipped-ui`），会遮蔽系统自带的 UI。

## 数据来源与隐私

- 用量来自 `@deepseek-ai/dsh-token-meter` 发布的 `contextPressure` / `contextBreakdown` 会话投影，和输入框上方的上下文环同源；百分比 = 估算已用 token ÷ 上下文窗口，上限截断在 100%。
- 插件**不发起任何网络请求**，不上报任何数据；偏好只写入本机 `localStorage`。
- 样式只用公开的 `--dsw-alias-*` 主题变量，不依赖 Harness 私有 Client 包。

## 兼容性

- DSH `>= 0.2.1-rc.2`
- 不修改任何系统 UI，只通过 slot 注入自己的组件；没有命中数据时自动隐藏

## 开发

仓库没有构建步骤，源码即发布产物。

```bash
node --check index.js
node --check client.js
```

## 许可证

[MIT](LICENSE)

---

## English

A DeepSeek Harness plugin that shows context-window occupancy next to the session title and on sidebar session rows: a ring plus percentage, a hover tooltip with `≈used / window` and the system / tools / messages breakdown, four-tier colors at 50 / 80 / 95%, and a settings page (Settings → Context usage) to combine the header form, seat, sidebar mark, hover detail, visibility rule, palette and precision. Preferences live in `localStorage`; the plugin makes no network requests and reads only the official `contextPressure` / `contextBreakdown` session projections.

Install from source: ask DSH to install `github:mantis3d/dsh-context-icon`, then restart DSH completely (the Host caches client bundles at activation).

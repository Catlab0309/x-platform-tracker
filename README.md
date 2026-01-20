# X平台数据追踪器

一个Chrome浏览器扩展，用于追踪和统计您在X平台(x.com)上的活动数据。

## 功能特性

- ✅ **点赞追踪**：自动记录点赞和取消点赞
- ✅ **评论追踪**：记录回复/评论操作
- ✅ **转发追踪**：记录转发和引用转发
- ✅ **发帖追踪**：记录新发布的推文
- ✅ **实时统计**：显示今日活动统计
- ✅ **活动历史**：查看最近的活动记录
- ✅ **本地存储**：数据保存在Chrome Storage API
- ✅ **Liquid Glass设计**：macOS Tahoe 26风格的现代化UI
- ✅ **自适应主题**：支持浅色和深色模式
- ✅ **流畅动画**：Apple风格的平滑过渡效果
- ✅ **图表可视化**：7天活动趋势图表
- ✅ **日期显示**：显示当前日期和星期

## 截图

![UI预览](screenshots/ui-preview.png)

## 安装方法

### 方法1：从GitHub下载（推荐）

1. 下载最新版本的ZIP文件
2. 解压到任意文件夹
3. 打开Chrome浏览器，访问 `chrome://extensions/`
4. 启用右上角的"开发者模式"
5. 点击"加载已解压的扩展程序"
6. 选择解压后的项目文件夹

### 方法2：克隆项目

```bash
git clone https://github.com/your-username/x-platform-tracker.git
cd x-platform-tracker
```

然后在Chrome中加载扩展（同方法1的步骤3-6）

## 使用说明

### 开始追踪

1. 安装扩展后，访问 [x.com](https://x.com)
2. 正常使用X平台进行各种操作：
   - ❤️ 点击推文的点赞按钮
   - 💬 点击回复按钮，输入评论并发布
   - 🔄 点击转发按钮（直接转发或引用转发）
   - ✍️ 点击"有什么新鲜事？"或"+"图标，输入内容并发布
3. 点击浏览器工具栏中的扩展图标
4. 查看：
   - 今日统计（点赞、评论、转发、发帖数量）
   - 最近活动列表
   - 当前日期和星期

### 清空数据

1. 点击扩展图标打开弹窗
2. 点击底部的"清空数据"按钮
3. 确认清空操作

## 技术栈

- Chrome Extension Manifest V3
- Vanilla JavaScript (ES6+)
- Chrome Storage API
- Content Scripts
- Background Service Worker

## 项目结构

```
x-platform-tracker/
├── manifest.json          # 扩展清单文件
├── content/
│   └── content.js        # 内容脚本（DOM监控和事件处理）
├── popup/
│   ├── popup.html        # 弹窗界面
│   ├── popup.css         # 弹窗样式
│   └── popup.js         # 弹窗逻辑
├── background.js         # 后台脚本（数据处理和存储）
├── icons/                # 扩展图标
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── .gitignore
└── README.md
```

## 开发

### 本地开发

1. 克隆仓库：
   ```bash
   git clone https://github.com/your-username/x-platform-tracker.git
   cd x-platform-tracker
   ```

2. 在Chrome中加载扩展（见"安装方法"）

3. 修改代码后：
   - 在 `chrome://extensions/` 中点击刷新按钮 🔄
   - 刷新x.com页面查看更改

### 调试

1. 打开开发者工具：
   - x.com页面：按F12查看content script日志
   - background脚本：在 `chrome://extensions/` 中点击"Service Worker"

2. 所有操作都有详细的console日志输出，便于调试

## 更新日志

### v1.1.0 (2026-01-20) - 🎨 UI全面升级

**新功能**：
- ✨ **Liquid Glass设计**：采用Apple macOS Tahoe 26的Liquid Glass材质
- ✨ **浅色默认主题**：在X黑色背景下有更好的视觉对比度
- ✨ **深色模式支持**：自动适应系统浅色/深色主题
- ✨ **半透明卡片**：使用backdrop-filter实现毛玻璃效果
- ✨ **流畅动画**：Apple cubic-bezier缓动函数
- ✨ **镜面高光**：hover状态下的动态高光效果
- ✨ **现代配色**：Apple语义化颜色系统
- ✨ **图标优化**：黑色Logo背景匹配X品牌
- ✨ **图表可视化**：Chart.js实现的7天活动趋势图
- ✨ **数据导入导出**：JSON格式的备份和恢复功能

**设计改进**：
- 🎨 更柔和的圆角（10px/14px/18px/24px）
- 🎨 统一的间距系统（8pt网格）
- 🎨 细腻的阴影和边框
- 🎨 响应式按钮交互
- 🎨 平滑的hover和active状态

**技术实现**：
- CSS自定义属性（CSS Custom Properties）
- @media查询实现主题切换
- backdrop-filter毛玻璃效果
- Chart.js图表库集成

### v1.0.0 (2026-01-18) - 🎉 首次发布

**新功能**：
- ✨ 支持点赞追踪
- ✨ 支持评论/回复追踪
- ✨ 支持转发和引用转发追踪
- ✨ 支持发帖追踪
- ✨ 实时今日统计
- ✨ 最近活动列表
- ✨ 显示当前日期和星期
- ✨ 美观的UI设计（彩色统计卡片）
- ✨ 数据持久化存储
- ✨ 数据清空功能

**技术实现**：
- 使用Chrome Extension Manifest V3
- Content Script监控DOM事件
- Background Service Worker处理数据
- Chrome Storage API持久化存储

## 已知问题

- 扩展只在x.com上工作，不支持其他社交媒体平台
- 数据仅保存在本地浏览器，清理浏览器数据会丢失
- 引用转发（Quote）会同时记录转发和发帖操作

## 贡献

欢迎贡献！如果你想为这个项目做贡献：

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- 项目主页：[GitHub](https://github.com/your-username/x-platform-tracker)
- 问题反馈：[Issues](https://github.com/your-username/x-platform-tracker/issues)

## 致谢

感谢所有为这个项目做出贡献的开发者！

---

**注意**：此扩展仅供个人使用，不与Twitter/X官方有任何关联。

# X平台追踪器 - 诊断步骤

## 已添加的诊断日志

我已经在所有组件中添加了详细的诊断日志，现在需要重新测试来定位问题。

## 重新加载扩展

1. 访问 `chrome://extensions/`
2. 找到"X平台数据追踪器"
3. 点击刷新按钮 🔄 (在扩展卡片上)
4. 或者移除扩展后重新加载

## 测试并查看日志

### 步骤1: 检查content script日志

1. 访问 https://x.com
2. 按F12打开开发者工具，切换到Console标签
3. 应该看到:
   ```
   X Platform Tracker content script loaded
   ```

### 步骤2: 测试点赞并查看日志

1. 点击任意推文的点赞按钮
2. **立即查看Console**，应该看到:
   ```
   [X Tracker] Like button clicked, tweetId: 123456789
   [X Tracker] Sending activity: {id: "...", type: "like", ...}
   [X Tracker] Response from background: {success: true}
   ```

### 步骤3: 检查background script日志

1. 在 `chrome://extensions/` 页面
2. 找到"X平台数据追踪器"
3. 点击"Service Worker"或"背景页"链接
4. 查看background的Console，应该看到:
   ```
   [X Tracker Background] Received message: {type: "LOG_ACTIVITY", activity: {...}}
   [X Tracker Background] Processing activity: {...}
   [X Tracker Background] handleActivityLog called with: {...}
   [X Tracker Background] Current storage data: {activities: [], dailyStats: {}}
   [X Tracker Background] Activities after push: 1
   [X Tracker Background] Date: 2026-01-17
   [X Tracker Background] Like count incremented to: 1
   [X Tracker Background] Final daily stats: {likes: 1, replies: 0, retweets: 0, posts: 0}
   [X Tracker Background] Data saved successfully
   ```

### 步骤4: 检查popup日志

1. 点击扩展图标打开弹窗
2. 在popup中按F12（右键点击弹窗选择"检查"）
3. 查看Console，应该看到:
   ```
   [X Tracker Popup] loadStats called
   [X Tracker Popup] Storage result: {dailyStats: {"2026-01-17": {likes: 1, ...}}}
   [X Tracker Popup] Today date: 2026-01-17
   [X Tracker Popup] Today stats: {likes: 1, ...}
   ```

## 问题诊断

请告诉我你在每个步骤看到了什么：

### 如果Console显示 `[X Tracker] Like button clicked`
- ✅ 事件监听器正常工作
- ✅ DOM选择器正确
- 继续查看是否有 `[X Tracker] Response from background`

### 如果显示 `[X Tracker] Error sending message`
- ❌ 消息发送失败
- 可能原因: 扩展未正确加载或权限问题

### 如果background Console没有任何日志
- ❌ 消息未到达background
- 可能原因: manifest配置问题或权限问题

### 如果background显示日志但popup数据未更新
- ❌ 存储可能有问题
- 可能原因: chrome.storage.local.set失败

## 请告诉我

测试后请告诉我：
1. 步骤2中Console显示什么？
2. 步骤3中background Console显示什么？
3. 步骤4中popup Console显示什么？

根据你的反馈，我可以准确定位问题并提供修复。

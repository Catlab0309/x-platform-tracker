// background.js

// 初始化存储
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['activities', 'dailyStats'], (result) => {
    if (!result.activities) {
      chrome.storage.local.set({ activities: [] });
    }
    if (!result.dailyStats) {
      chrome.storage.local.set({ dailyStats: {} });
    }
  });
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LOG_ACTIVITY') {
    handleActivityLog(message.activity);
    sendResponse({ success: true });
  }
  return true;
});

// 处理活动日志
function handleActivityLog(activity) {
  chrome.storage.local.get(['activities', 'dailyStats'], (result) => {
    const activities = result.activities || [];
    const dailyStats = result.dailyStats || {};

    // 添加新活动
    activities.push(activity);

    // 更新每日统计
    const date = new Date().toISOString().split('T')[0];
    if (!dailyStats[date]) {
      dailyStats[date] = { likes: 0, replies: 0, retweets: 0, posts: 0 };
    }

    switch (activity.type) {
      case 'like':
        dailyStats[date].likes++;
        break;
      case 'reply':
        dailyStats[date].replies++;
        break;
      case 'retweet':
        dailyStats[date].retweets++;
        break;
      case 'post':
        dailyStats[date].posts++;
        break;
    }

    // 保存数据
    chrome.storage.local.set({ activities, dailyStats });
  });
}

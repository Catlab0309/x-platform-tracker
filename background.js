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
  console.log('[X Tracker Background] Received message:', message);
  if (message.type === 'LOG_ACTIVITY') {
    console.log('[X Tracker Background] Processing activity:', message.activity);
    handleActivityLog(message.activity);
    sendResponse({ success: true });
  }
  return true;
});

// 处理活动日志
function handleActivityLog(activity) {
  console.log('[X Tracker Background] handleActivityLog called with:', activity);
  chrome.storage.local.get(['activities', 'dailyStats'], (result) => {
    console.log('[X Tracker Background] Current storage data:', result);
    const activities = result.activities || [];
    const dailyStats = result.dailyStats || {};

    // 添加新活动
    activities.push(activity);
    console.log('[X Tracker Background] Activities after push:', activities.length);

    // 更新每日统计
    const date = new Date().toISOString().split('T')[0];
    console.log('[X Tracker Background] Date:', date);

    if (!dailyStats[date]) {
      dailyStats[date] = { likes: 0, replies: 0, retweets: 0, posts: 0 };
      console.log('[X Tracker Background] Created new daily stats entry');
    }

    switch (activity.type) {
      case 'like':
        dailyStats[date].likes++;
        console.log('[X Tracker Background] Like count incremented to:', dailyStats[date].likes);
        break;
      case 'reply':
        dailyStats[date].replies++;
        break;
      case 'retweet':
        dailyStats[date].retweets++;
        console.log('[X Tracker Background] Retweet count incremented to:', dailyStats[date].retweets);
        break;
      case 'post':
        dailyStats[date].posts++;
        break;
    }

    console.log('[X Tracker Background] Final daily stats:', dailyStats[date]);

    // 保存数据
    chrome.storage.local.set({ activities, dailyStats }, () => {
      console.log('[X Tracker Background] Data saved successfully');
      if (chrome.runtime.lastError) {
        console.error('[X Tracker Background] Error saving data:', chrome.runtime.lastError);
      }
    });
  });
}

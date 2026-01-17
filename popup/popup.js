// popup/popup.js

// 页面加载时获取数据
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadRecentActivities();
});

// 加载统计数据
function loadStats() {
  chrome.storage.local.get(['dailyStats'], (result) => {
    const dailyStats = result.dailyStats || {};
    const today = new Date().toISOString().split('T')[0];
    const todayStats = dailyStats[today] || { likes: 0, replies: 0, retweets: 0, posts: 0 };

    document.getElementById('today-likes').textContent = todayStats.likes;
    document.getElementById('today-replies').textContent = todayStats.replies;
    document.getElementById('today-retweets').textContent = todayStats.retweets;
    document.getElementById('today-posts').textContent = todayStats.posts;
  });
}

// 加载最近活动
function loadRecentActivities() {
  chrome.storage.local.get(['activities'], (result) => {
    const activities = result.activities || [];
    const recentActivities = activities.slice(-20).reverse();

    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';

    recentActivities.forEach(activity => {
      const li = document.createElement('li');
      li.className = 'activity-item';

      const time = new Date(activity.timestamp);
      const timeStr = time.toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      let typeText = '';
      switch (activity.type) {
        case 'like':
          typeText = '点赞了';
          break;
        case 'reply':
          typeText = '回复了';
          break;
        case 'retweet':
          typeText = '转发了';
          break;
        case 'post':
          typeText = '发布了';
          break;
      }

      li.innerHTML = `
        <div>${typeText}: ${activity.content.substring(0, 50)}...</div>
        <div class="activity-time">${timeStr}</div>
      `;

      activityList.appendChild(li);
    });
  });
}

// 清空数据
document.getElementById('clear-data').addEventListener('click', () => {
  if (confirm('确定要清空所有数据吗？')) {
    chrome.storage.local.clear(() => {
      chrome.storage.local.set({ activities: [], dailyStats: {} });
      loadStats();
      loadRecentActivities();
    });
  }
});

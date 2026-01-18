// popup/popup.js

// 页面加载时获取数据
document.addEventListener('DOMContentLoaded', () => {
  loadCurrentDate();
  loadStats();
  loadRecentActivities();
});

// 加载当前日期
function loadCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekDay = weekDays[now.getDay()];
  
  const dateStr = `${year}年${month}月${day}日 ${weekDay}`;
  document.getElementById('current-date').textContent = dateStr;
}

// 加载统计数据
function loadStats() {
  console.log('[X Tracker Popup] loadStats called');
  chrome.storage.local.get(['dailyStats'], (result) => {
    console.log('[X Tracker Popup] Storage result:', result);
    const dailyStats = result.dailyStats || {};
    const today = new Date().toISOString().split('T')[0];
    console.log('[X Tracker Popup] Today date:', today);
    const todayStats = dailyStats[today] || { likes: 0, replies: 0, retweets: 0, posts: 0 };
    console.log('[X Tracker Popup] Today stats:', todayStats);

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
          typeText = '评论了';
          break;
        case 'retweet':
          typeText = '转发了';
          break;
        case 'post':
          typeText = '发布了';
          break;
      }

      const contentDisplay = activity.content.length > 100
        ? activity.content.substring(0, 100) + '...'
        : activity.content;

      li.innerHTML = `
        <div>${typeText}: ${contentDisplay}</div>
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

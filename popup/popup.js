// popup/popup.js

// 页面加载时获取数据
document.addEventListener('DOMContentLoaded', () => {
  console.log('[X Tracker Popup] DOMContentLoaded');
  loadCurrentDate();
  loadStats();
  loadRecentActivities();
  loadActivityChart();
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
    console.log('[X Tracker Popup] All dailyStats keys:', Object.keys(dailyStats));
    
    // 使用本地时间获取今天的日期
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    
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

// 导出数据
document.getElementById('export-data').addEventListener('click', () => {
  chrome.storage.local.get(['activities', 'dailyStats'], (result) => {
    const data = {
      exportDate: new Date().toISOString(),
      activities: result.activities || [],
      dailyStats: result.dailyStats || {}
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // 使用本地时间作为文件名
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;
    const filename = `x-tracker-backup-${date}.json`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  });
});

// 导入数据
document.getElementById('import-data').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (!data.activities || !data.dailyStats) {
          alert('无效的数据文件格式');
          return;
        }
        
        if (confirm(`确定要导入 ${data.activities.length} 条活动记录吗？这将合并到现有数据中。`)) {
          chrome.storage.local.get(['activities', 'dailyStats'], (result) => {
            const existingActivities = result.activities || [];
            const existingDailyStats = result.dailyStats || {};
            
            const newActivities = [...existingActivities, ...data.activities];
            const newDailyStats = { ...existingDailyStats, ...data.dailyStats };
            
            chrome.storage.local.set({ 
              activities: newActivities,
              dailyStats: newDailyStats
            }, () => {
              loadStats();
              loadRecentActivities();
              loadActivityChart();
              alert('数据导入成功！');
            });
          });
        }
      } catch (error) {
        alert('无法解析文件：' + error.message);
      }
    };
    reader.readAsText(file);
  };
  
  input.click();
});

// 清空数据
document.getElementById('clear-data').addEventListener('click', () => {
  if (confirm('确定要清空所有数据吗？')) {
    chrome.storage.local.clear(() => {
      chrome.storage.local.set({ activities: [], dailyStats: {} });
      loadStats();
      loadRecentActivities();
      loadActivityChart();
    });
  }
});

// 加载活动趋势图表
function loadActivityChart() {
  console.log('[X Tracker Popup] loadActivityChart called');
  chrome.storage.local.get(['dailyStats'], (result) => {
    console.log('[X Tracker Popup] Chart storage result:', result);
    const dailyStats = result.dailyStats || {};
    
    // 生成最近7天的日期
    const dates = [];
    const labels = [];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      // 使用本地时间格式化日期
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      dates.push(dateStr);
      labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
      
      // 获取当天的统计数据，如果没有则使用默认值
      const stats = dailyStats[dateStr] || { likes: 0, replies: 0, retweets: 0, posts: 0 };
      const total = stats.likes + stats.replies + stats.retweets + stats.posts;
      data.push(total);
      console.log(`[X Tracker Popup] Date ${dateStr}: ${total} activities`);
    }
    
    console.log('[X Tracker Popup] Chart data:', { dates, labels, data });
    
    // 渲染图表
    const ctx = document.getElementById('activity-chart').getContext('2d');
    console.log('[X Tracker Popup] Canvas element found:', !!ctx);
    
    // 如果图表已存在，先销毁
    if (window.activityChartInstance) {
      window.activityChartInstance.destroy();
    }
    
    window.activityChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: '活动数量',
          data: data,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#667eea',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(15, 20, 25, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: function(context) {
                const index = context.dataIndex;
                const dateStr = dates[index];
                const stats = dailyStats[dateStr] || { likes: 0, replies: 0, retweets: 0, posts: 0 };
                const total = context.raw;
                
                let tooltipText = `总计: ${total} 次\n`;
                tooltipText += `  点赞: ${stats.likes}`;
                tooltipText += `\n  评论: ${stats.replies}`;
                tooltipText += `\n  转发: ${stats.retweets}`;
                tooltipText += `\n  发帖: ${stats.posts}`;
                
                return tooltipText;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#536471',
              font: {
                size: 11
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(207, 217, 222, 0.3)'
            },
            ticks: {
              color: '#536471',
              font: {
                size: 11
              },
              stepSize: 1
            }
          }
        }
      }
    });
  });
}
